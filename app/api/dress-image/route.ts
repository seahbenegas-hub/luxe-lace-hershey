import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin, unauthorized } from "@/lib/security";

const bucketName = "DressImages";

export async function POST(request: Request) {
  try {
    if (!(await isAdmin(request))) return unauthorized();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const imageExtensions = /\.(png|jpg|jpeg|gif|webp|heic|heif|bmp)$/i;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please upload an image file" }, { status: 400 });
    }

    const hasValidMime = typeof file.type === "string" && file.type.startsWith("image/");
    const hasValidExtension = imageExtensions.test(file.name || "");

    if (!hasValidMime && !hasValidExtension) {
      return NextResponse.json({ error: "Please upload a valid image file" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 10 MB or smaller" }, { status: 413 });
    }

    const safeExtension = (file.name?.split(".").pop()?.toLowerCase() || "jpg").replace(/heif/i, "jpg").replace(/heic/i, "jpg");
    const contentType = hasValidMime ? file.type : "image/jpeg";
    const path = `dresses/${crypto.randomUUID()}.${safeExtension}`;
    let { data, error } = await supabaseAdmin.storage.from(bucketName).upload(path, file, {
      contentType,
      upsert: false,
    });

    if (error) {
      await supabaseAdmin.storage.createBucket(bucketName, { public: true });
      ({ data, error } = await supabaseAdmin.storage.from(bucketName).upload(path, file, {
        contentType: file.type,
        upsert: false,
      }));
    }

    if (error || !data) {
      console.error("Dress image upload error:", error);
      return NextResponse.json(
        { error: error?.message || `Create a public Supabase storage bucket named ${bucketName}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Failed to upload dress image:", error);
    return NextResponse.json({ error: "Dress image upload failed" }, { status: 500 });
  }
}
