import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("temporary_files")
      .select(`
  id,
  file_name,
  file_path,
  expires_at,
  is_active
`)
      .eq("access_code", accessCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 404 }
      );
    }

    // Expiry check
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      const { error: storageError } =
  await supabaseAdmin.storage
    .from("temp-files")
    .remove([data.file_path]);

if (storageError) {
  console.error(
    "Storage delete failed:",
    storageError.message
  );
}

      await supabaseAdmin
        .from("temporary_files")
        .delete()
        .eq("id", data.id);

      return NextResponse.json(
        { error: "File expired. Upload again." },
        { status: 410 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("temp-files")
        .createSignedUrl(data.file_path, 120, {
          download: data.file_name,
        });

    if (signedUrlError) {
      return NextResponse.json(
        { error: "Failed to create download link" },
        { status: 500 }
      );
    }

    // Mark accessed
    await supabaseAdmin
      .from("temporary_files")
      .update({
        is_accessed: true,
      })
      .eq("id", data.id);

    return NextResponse.json({
      success: true,
      fileName: data.file_name,
      downloadUrl: signedUrlData.signedUrl,
    });

  } catch {
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}