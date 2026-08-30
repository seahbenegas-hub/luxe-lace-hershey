import { NextResponse } from "next/server";
import { dresses } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (supabase) {
    const { data, error } = await supabase.from("dresses").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase dress query error:", error);
      return NextResponse.json({ error: "Unable to load dresses from Supabase" }, { status: 500 });
    }

    if (data) {
      return NextResponse.json(data);
    }
  }

  return NextResponse.json(dresses);
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const draftDress = {
      id: body.id || crypto.randomUUID(),
      name: body.name || "New Dress",
      description: body.description || "",
      price: Number(body.price || 0),
      size: Array.isArray(body.size) ? body.size : ["S", "M", "L"],
      color: body.color || "Neutral",
      occasion: body.occasion || "General",
      image: body.image || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop",
      available: body.available !== false,
      category: body.category || "New",
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
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
    }

    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "Missing dress id or updates" }, { status: 400 });
    }

    const normalizedUpdates = {
      ...updates,
      ...(updates.size !== undefined && Array.isArray(updates.size)
        ? { size: updates.size }
        : {}),
    };

    const { data, error } = await supabaseAdmin
      .from("dresses")
      .update(normalizedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json(data);
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
