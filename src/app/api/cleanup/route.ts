import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const now = new Date().toISOString();

    const { data: expiredFiles, error } = await supabaseAdmin
  .from("temporary_files")
  .select("*")
  .lt("expires_at", now)
  .eq("is_active", true);

    if (error) {
      throw error;
    }

    for (const file of expiredFiles || []) {
  console.log("Deleting:", file.file_path);

  const { error: storageError } =
    await supabaseAdmin.storage
      .from("temp-files")
      .remove([file.file_path]);

  if (storageError) {
    console.error(storageError.message);
  }
}

    await supabaseAdmin
      .from("temporary_files")
      .delete()
      .lt("expires_at", now);

    return NextResponse.json({
      success: true,
      deleted: expiredFiles?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 }
    );
    }
    
}