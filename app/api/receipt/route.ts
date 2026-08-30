import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const path = `receipts/${safeName}`;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from("receipts")
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("receipts")
          .getPublicUrl(data.path);

        return NextResponse.json({
          url: publicUrlData.publicUrl,
          fileName: file.name,
        });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fallbackUrl = `data:${file.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      url: fallbackUrl,
      fileName: file.name,
    });
  } catch {
    return NextResponse.json({ error: "Receipt upload failed" }, { status: 500 });
  }
}
