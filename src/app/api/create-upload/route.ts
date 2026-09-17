import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { customAlphabet } from "nanoid";


const generateCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6
);


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

     // Cleanup expired files first
    const now = new Date().toISOString();

    const { data: expiredFiles, error: cleanupError } = await supabaseAdmin
  .from("temporary_files")
  .select("file_path")
  .lt("expires_at", now);

    if (cleanupError) {
  console.error("Cleanup error:", cleanupError);
} 
 const filePaths =
  expiredFiles?.map(file => file.file_path) || [];

if (filePaths.length > 0) {
  await supabaseAdmin.storage
    .from("temp-files")
    .remove(filePaths);
}

    await supabaseAdmin
      .from("temporary_files")
      .delete()
      .lt("expires_at", now);

    
   const { files } = await request.json();

   const accessCode = await generateUniqueCode();

    if (
  !files ||
  !Array.isArray(files) ||
  files.length === 0
) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const rows = files.map(
  (file: {
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  }) => ({
    access_code: accessCode,
    file_name: file.fileName,
    file_path: file.filePath,
    mime_type: file.mimeType,
    file_size: file.fileSize,
    expires_at: expiresAt.toISOString(),
    is_active: true,
    is_accessed: false,
    download_count: 0,
  })
);

const { error } = await supabaseAdmin
  .from("temporary_files")
  .insert(rows);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
  success: true,
  accessCode,
  expiresAt: expiresAt.toISOString(),
  filesCount: files.length,
});

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}