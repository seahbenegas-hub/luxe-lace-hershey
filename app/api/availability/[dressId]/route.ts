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
  const activeStatuses = new Set(["pending", "confirmed", "inprogress"]);

  if (database) {
    const { data, error } = await database
      .from("bookings")
      .select("dress_id, start_date, end_date, status")
      .eq("dress_id", dressId)
      ;

    if (!error && data) {
      const activeBookings = data.filter((booking) => activeStatuses.has(String(booking.status || "").toLowerCase().replace(/\s+/g, "")));
      console.info(`Availability loaded for dress ${dressId}: ${activeBookings.length} active booking(s)`);
      return NextResponse.json(
        activeBookings.map((booking) => ({ startDate: booking.start_date, endDate: booking.end_date })),
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (error) {
      console.error("Supabase availability query error:", error);
      if (supabaseAdmin) {
        return NextResponse.json({ error: "Unable to load dress availability" }, { status: 500 });
      }
    }
  }

  const occupiedRanges = bookings
    .filter((booking) => booking.dressId === dressId && ["pending", "confirmed", "inprogress"].includes(booking.status))
    .map((booking) => ({ startDate: booking.startDate, endDate: booking.endDate }));

  return NextResponse.json(occupiedRanges, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
