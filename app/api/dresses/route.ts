import { NextResponse } from "next/server";
import { dresses } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { isAdmin, unauthorized } from "@/lib/security";

export const dynamic = "force-dynamic";

const normalizeDress = (dress: any) => ({
  ...dress,
  ...(dress.additional_day_price !== undefined ? { additionalDayPrice: Number(dress.additional_day_price || 0) } : {}),
  ...(dress.additionalDayPrice !== undefined ? { additionalDayPrice: Number(dress.additionalDayPrice || 0) } : {}),
});

export async function GET() {
  const database = supabaseAdmin || supabase;

  if (database) {
    const { data, error } = await database.from("dresses").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase dress query error:", error);
      return NextResponse.json({ error: "Unable to load dresses from Supabase" }, { status: 500 });
    }

    if (data) {
      return NextResponse.json(data.map(normalizeDress), {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
  }

  return NextResponse.json(dresses.map((dress) => normalizeDress(dress)), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin(request))) return unauthorized();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const draftDress = {
      id: body.id || crypto.randomUUID(),
      name: body.name || "New Dress",
      description: body.description || "",
      price: Number(body.price || 0),
      additional_day_price: Number(body.additionalDayPrice ?? body.additional_day_price ?? 0),
      size: Array.isArray(body.size) ? body.size : ["S", "M", "L"],
      color: body.color || "Neutral",
      occasion: body.occasion || "General",
      image: body.image || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop",
      available: body.available !== false,
      category: body.category || "New",
      featured: body.featured === true,
    };

    const { data, error } = await supabaseAdmin.from("dresses").insert([draftDress]).select().single();
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create dress:", error);
    return NextResponse.json({ error: "Failed to create dress" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin(request))) return unauthorized();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "Missing dress id or updates" }, { status: 400 });
    }

    const { additionalDayPrice, additional_day_price, ...restUpdates } = updates;
    const normalizedUpdates = {
      ...restUpdates,
      ...(additionalDayPrice !== undefined || additional_day_price !== undefined
        ? { additional_day_price: Number(additionalDayPrice ?? additional_day_price ?? 0) }
        : {}),
      ...(restUpdates.size !== undefined && Array.isArray(restUpdates.size)
        ? { size: restUpdates.size }
        : {}),
    };

    const { data, error } = await supabaseAdmin
      .from("dresses")
      .update(normalizedUpdates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json(normalizeDress(data));
    }

    console.error("Supabase update error:", error);
    return NextResponse.json({ error: error?.message || "Dress not found" }, { status: error ? 500 : 404 });
  } catch (error) {
    console.error("Failed to update dress:", error);
    return NextResponse.json({ error: "Failed to update dress" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin(request))) return unauthorized();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing dress id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("dresses").delete().eq("id", id);

    if (!error) {
      return NextResponse.json({ success: true });
    }

    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } catch (error) {
    console.error("Failed to delete dress:", error);
    return NextResponse.json({ error: "Failed to delete dress" }, { status: 500 });
  }
}
