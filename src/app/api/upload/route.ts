import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { customAlphabet } from "nanoid";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const BLOCKED_EXTENSIONS = [
  ".exe",
  ".msi",
  ".bat",
  ".cmd",
  ".scr",
  ".com",
  ".dll",
  ".sys",
  ".sh",
  ".ps1",
  ".vbs",
  ".apk",
  ".html",
  ".htm",
  ".svg",
  ".zip",
  ".rar",
  ".7z",
  ".iso",
];

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isBlockedFile(name: string) {
  const lowerName = name.toLowerCase();

  return BLOCKED_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext)
  );
}

const generateCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6
);

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
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Block dangerous extensions
    if (isBlockedFile(file.name)) {
      return NextResponse.json(
        { error: "This file type is not allowed" },
        { status: 400 }
      );
    }

    // Block video/audio
    if (
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/")
    ) {
      return NextResponse.json(
        { error: "Video and audio files are not supported" },
        { status: 400 }
      );
    }

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 50MB limit" },
        { status: 400 }
      );
    }


    const sanitizedName = sanitizeFileName(file.name);
    const filePath = `${accessCode}/${sanitizedName}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("temp-files")
      .upload(filePath, fileBuffer, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: dbError } = await supabaseAdmin
      .from("temporary_files")
      .insert({
        access_code: accessCode,
        file_name: sanitizedName,
        file_path: filePath,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        is_accessed: false,
        download_count: 0,
      });

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accessCode,
      expiresAt: expiresAt.toISOString(),
      fileName: sanitizedName,
    });

  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}