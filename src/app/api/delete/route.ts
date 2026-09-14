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
      .select("id, file_path")
      .eq("access_code", accessCode.toUpperCase());

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete all files from storage
    const filePaths = data.map((file) => file.file_path);

    const { error: storageError } = await supabaseAdmin.storage
      .from("temp-files")
      .remove(filePaths);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // Delete all DB records for this access code
    const { error: dbError } = await supabaseAdmin
      .from("temporary_files")
      .delete()
      .eq("access_code", accessCode.toUpperCase());

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Files deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}