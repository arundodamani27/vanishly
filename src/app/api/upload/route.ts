import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { customAlphabet } from "nanoid";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10; // sanity cap per batch

const BLOCKED_EXTENSIONS = [
  ".exe", ".msi", ".bat", ".cmd", ".scr", ".com", ".dll", ".sys",
  ".sh", ".ps1", ".vbs", ".apk", ".html", ".htm", ".svg", ".iso",
];

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isBlockedFile(name: string) {
  const lowerName = name.toLowerCase();
  return BLOCKED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

const generateCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

async function generateUniqueCode() {
  let accessCode = "";
  let exists = true;

  while (exists) {
    accessCode = generateCode();

    const { data } = await supabaseAdmin
      .from("temporary_files")
      .select("access_code")
      .eq("access_code", accessCode)
      .maybeSingle();

    exists = !!data;
  }

  return accessCode;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files (max ${MAX_FILES} per upload)` },
        { status: 400 }
      );
    }

    const accessCode = await generateUniqueCode();

    const uploaded: {
      fileName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
    }[] = [];
    const skipped: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (isBlockedFile(file.name)) {
        skipped.push(`${file.name} (blocked file type)`);
        continue;
      }

      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        skipped.push(`${file.name} (video/audio not supported)`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        skipped.push(`${file.name} (exceeds 50MB limit)`);
        continue;
      }

      const sanitizedName = sanitizeFileName(file.name);
      const filePath = `${accessCode}/${Date.now()}-${i}-${sanitizedName}`;
      const fileBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("temp-files")
        .upload(filePath, fileBuffer, {
          contentType: file.type || "application/octet-stream",
        });

      if (uploadError) {
        // Roll back everything uploaded so far in this batch
        await Promise.all(
          uploaded.map((f) =>
            supabaseAdmin.storage.from("temp-files").remove([f.filePath])
          )
        );
        return NextResponse.json(
          { error: `Failed on "${file.name}": ${uploadError.message}` },
          { status: 500 }
        );
      }

      uploaded.push({
        fileName: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      });
    }

    if (uploaded.length === 0) {
      return NextResponse.json(
        {
          error:
            skipped.length > 0
              ? `No valid files. Skipped: ${skipped.join(", ")}`
              : "No valid files selected.",
        },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: dbError } = await supabaseAdmin
      .from("temporary_files")
      .insert(
        uploaded.map((f) => ({
          access_code: accessCode,
          file_name: f.fileName,
          file_path: f.filePath,
          mime_type: f.mimeType,
          file_size: f.fileSize,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          is_accessed: false,
          download_count: 0,
        }))
      );

    if (dbError) {
      // Roll back storage if DB insert fails
      await Promise.all(
        uploaded.map((f) =>
          supabaseAdmin.storage.from("temp-files").remove([f.filePath])
        )
      );
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      accessCode,
      expiresAt: expiresAt.toISOString(),
      uploaded: uploaded.map((f) => f.fileName),
      skipped,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}