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
      .select("id, is_accessed, expires_at, file_path")
      .eq("access_code", accessCode.toUpperCase())
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Check if all files are expired
    const now = new Date();

    const expiredFiles = data.filter(
      (file) => file.expires_at && new Date(file.expires_at) < now
    );

    if (expiredFiles.length > 0) {
      // Delete expired files from storage
      await supabaseAdmin.storage
        .from("temp-files")
        .remove(expiredFiles.map((file) => file.file_path));

      // Delete expired records from DB
      await supabaseAdmin
        .from("temporary_files")
        .delete()
        .in(
          "id",
          expiredFiles.map((file) => file.id)
        );

      return NextResponse.json({
        expired: true,
      });
    }

    // If any file has been accessed
    const isAccessed = data.some(
      (file) => file.is_accessed === true
    );

    return NextResponse.json({
      isAccessed,
      expired: false,
    });
  } catch (error) {
    console.error("Status check error:", error);

    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}