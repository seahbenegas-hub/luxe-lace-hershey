import { NextResponse } from "next/server";
import { bookings, addBooking, updateBooking } from "@/lib/db";
import type { Booking } from "@/types";

const validStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
const validPaymentStatuses = ["pending", "paid", "refunded"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

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
      dressId: body.dressId,
      dressName: body.dressName,
      userEmail: body.userEmail,
      userName: body.userName || "Guest",
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: Number(body.totalPrice || 0),
      status: validStatuses.includes(body.status) ? body.status : "pending",
      paymentStatus: body.paymentStatus || "pending",
      createdAt: new Date().toISOString(),
      qrCode: body.qrCode,
    };

    addBooking(booking);
    return NextResponse.json(booking, { status: 201 });
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

    const updates: Partial<Booking> = {};

    if (body.status && validStatuses.includes(body.status)) {
      updates.status = body.status;
    }

    if (body.paymentStatus && validPaymentStatuses.includes(body.paymentStatus)) {
      updates.paymentStatus = body.paymentStatus;
    }

    updateBooking(body.id, updates);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }
}
