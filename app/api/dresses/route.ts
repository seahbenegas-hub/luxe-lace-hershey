import { NextResponse } from "next/server";
import { dresses } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (supabase) {
    const { data, error } = await supabase.from("dresses").select("*").order("created_at", { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

  return NextResponse.json(dresses);
}
