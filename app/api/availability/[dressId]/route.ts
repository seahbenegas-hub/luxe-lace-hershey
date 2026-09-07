import { NextResponse } from "next/server";
import { bookings } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { dressId: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const dressId = String(params.dressId || "").trim();

  if (!dressId) {
    return NextResponse.json({ error: "Dress id is required" }, { status: 400 });
  }

  const database = supabaseAdmin || supabase;

  if (database) {
    const { data, error } = await database
      .from("bookings")
      .select("start_date, end_date")
      .eq("dress_id", dressId)
      .in("status", ["pending", "confirmed", "inprogress"]);

    if (!error && data) {
      return NextResponse.json(
        data.map((booking) => ({ startDate: booking.start_date, endDate: booking.end_date })),
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (error) {
      console.error("Supabase availability query error:", error);
    }
  }

  const occupiedRanges = bookings
    .filter((booking) => booking.dressId === dressId && ["pending", "confirmed", "inprogress"].includes(booking.status))
    .map((booking) => ({ startDate: booking.startDate, endDate: booking.endDate }));

  return NextResponse.json(occupiedRanges, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
