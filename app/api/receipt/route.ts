import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  try {
    if (!rateLimit(`receipt:${clientKey(request)}`, 10)) {
      return NextResponse.json({ error: "Too many upload attempts" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Receipt must be an image of 10 MB or smaller" }, { status: 400 });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const path = safeName;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from("Receipts")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        console.error("Upload path:", path);
        console.error("File type:", file.type);
      }

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("Receipts")
          .getPublicUrl(data.path);

        return NextResponse.json({
          url: publicUrlData.publicUrl,
          fileName: file.name,
        });
      }
    }

    return NextResponse.json({ error: "Receipt storage is not configured" }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Receipt upload failed" }, { status: 500 });
  }
}
