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
  .select("*")
  .eq("access_code", accessCode.toUpperCase())
  .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 404 }
      );
    }

    // Expiry check
const firstFile = data[0];

if (
  firstFile.expires_at &&
  new Date(firstFile.expires_at) < new Date()
) {
  const filePaths = data.map(file => file.file_path);
      const { error: storageError } =
 await supabaseAdmin.storage
  .from("temp-files")
  .remove(filePaths);

if (storageError) {
  console.error(
    "Storage delete failed:",
    storageError.message
  );
}

     await supabaseAdmin
  .from("temporary_files")
  .delete()
  .eq(
    "access_code",
    accessCode.toUpperCase()
  );

      return NextResponse.json(
        { error: "File expired. Upload again." },
        { status: 410 }
      );
    }

const files: {
  fileName: string;
  downloadUrl?: string;
}[] = [];

for (const file of data) {
  const {
  data: signedUrlData,
  error: signedUrlError,
} = await supabaseAdmin.storage
  .from("temp-files")
  .createSignedUrl(
    file.file_path,
    3600,
    { download: file.file_name }
  );

if (signedUrlError) {
  continue;
}

  files.push({
    fileName: file.file_name,
    downloadUrl: signedUrlData?.signedUrl,
  });
}
   

   
    

    // Mark accessed
  await supabaseAdmin
  .from("temporary_files")
  .update({
    is_accessed: true,
  })
  .eq(
    "access_code",
    accessCode.toUpperCase()
  );

    return NextResponse.json({
  success: true,
  files,
});

  } catch {
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}