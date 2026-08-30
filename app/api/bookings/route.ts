import { NextResponse } from "next/server";
import { bookings, addBooking, updateBooking } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import type { Booking } from "@/types";

const validStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
const validPaymentStatuses = ["pending", "paid", "refunded"] as const;

function normalizeBooking(row: any): Booking {
  return {
    id: row.id,
    dressId: row.dress_id || row.dressId,
    dressName: row.dress_name || row.dressName,
    userEmail: row.user_email || row.userEmail,
    userName: row.user_name || row.userName || "Guest",
    startDate: row.start_date || row.startDate,
    endDate: row.end_date || row.endDate,
    totalPrice: Number(row.total_price ?? row.totalPrice ?? 0),
    status: validStatuses.includes(row.status) ? row.status : "pending",
    paymentStatus: validPaymentStatuses.includes(row.payment_status)
      ? row.payment_status
      : "pending",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    qrCode: row.qr_code || row.qrCode,
    paymentReceipt: row.payment_receipt || row.paymentReceipt || undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  // Always try Supabase first
  if (supabase) {
    let query = supabase.from("bookings").select("*");

    if (email) {
      query = query.eq("user_email", email);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    // If we got a successful response from Supabase (even if empty), return it
    if (!error) {
      const normalized = data ? data.map(normalizeBooking) : [];
      return NextResponse.json(normalized);
    }

    // If there was an error, fall back to local
    console.error("Supabase booking fetch error:", error);
  }

  // Fallback to local bookings only if Supabase failed
  if (email) {
    return NextResponse.json(bookings.filter((b) => b.userEmail === email));
  }

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.dressId || !body?.userEmail || !body?.dressName || !body?.startDate || !body?.endDate) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const booking = {
      id: body.id || crypto.randomUUID(),
      dress_id: body.dressId,
      dress_name: body.dressName,
      user_email: body.userEmail,
      user_name: body.userName || "Guest",
      start_date: body.startDate,
      end_date: body.endDate,
      total_price: Number(body.totalPrice || 0),
      status: validStatuses.includes(body.status) ? body.status : "pending",
      payment_status: validPaymentStatuses.includes(body.paymentStatus) ? body.paymentStatus : "pending",
      created_at: new Date().toISOString(),
      qr_code: body.qrCode,
      payment_receipt: body.paymentReceipt || null,
    };

    if (supabaseAdmin) {
      console.log("📝 Attempting Supabase insert with booking:", JSON.stringify(booking, null, 2));
      const { data, error } = await supabaseAdmin.from("bookings").insert([booking]).select().single();

      if (error) {
        console.error("❌ Supabase insert failed:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          booking: booking
        });
        // Return error to client for debugging
        return NextResponse.json({ 
          error: "Failed to save booking",
          details: error.message 
        }, { status: 400 });
      }

      if (data) {
        console.log("✅ Booking saved to Supabase:", data);
        return NextResponse.json(normalizeBooking(data), { status: 201 });
      }
    } else {
      console.error("❌ supabaseAdmin client not initialized");
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const legacyBooking: Booking = {
      id: booking.id,
      dressId: booking.dress_id,
      dressName: booking.dress_name,
      userEmail: booking.user_email,
      userName: booking.user_name,
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalPrice: Number(booking.total_price || 0),
      status: validStatuses.includes(booking.status) ? booking.status : "pending",
      paymentStatus: validPaymentStatuses.includes(booking.payment_status) ? booking.payment_status : "pending",
      createdAt: booking.created_at,
      qrCode: booking.qr_code,
      paymentReceipt: booking.payment_receipt || undefined,
    };

    addBooking(legacyBooking);
    return NextResponse.json(legacyBooking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid booking payload" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body?.id) {
      return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
    }

    const updates: Partial<{ status: string; payment_status: string }> = {};

    if (body.status && validStatuses.includes(body.status)) {
      updates.status = body.status;
    }

    if (body.paymentStatus && validPaymentStatuses.includes(body.paymentStatus)) {
      updates.payment_status = body.paymentStatus;
    }

    if (supabaseAdmin && Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin
        .from("bookings")
        .update(updates)
        .eq("id", body.id);

      if (!error) {
        return NextResponse.json({ success: true });
      }
    }

    const legacyUpdates: Partial<Booking> = {};

    if (body.status && validStatuses.includes(body.status)) {
      legacyUpdates.status = body.status;
    }

    if (body.paymentStatus && validPaymentStatuses.includes(body.paymentStatus)) {
      legacyUpdates.paymentStatus = body.paymentStatus;
    }

    updateBooking(body.id, legacyUpdates);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
    }

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("bookings").delete().eq("id", id);

      if (!error) {
        return NextResponse.json({ success: true });
      }

      console.error("Supabase booking delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Invalid delete payload" }, { status: 400 });
  }
}
