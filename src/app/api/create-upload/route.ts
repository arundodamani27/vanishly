import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const {
      accessCode,
      fileName,
      filePath,
      fileSize,
      mimeType,
    } = await request.json();

    if (
      !accessCode ||
      !fileName ||
      !filePath ||
      !fileSize ||
      !mimeType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await supabaseAdmin
      .from("temporary_files")
      .insert({
        access_code: accessCode,
        file_name: fileName,
        file_path: filePath,
        mime_type: mimeType,
        file_size: fileSize,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        is_accessed: false,
        download_count: 0,
      });

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
      fileName,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}