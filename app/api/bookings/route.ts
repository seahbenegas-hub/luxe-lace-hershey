import { NextResponse } from "next/server";
import { bookings, addBooking, updateBooking } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (email) {
    return NextResponse.json(bookings.filter((b) => b.userEmail === email));
  }
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const booking = {
    ...body,
    createdAt: new Date().toISOString(),
  };
  addBooking(booking);
  return NextResponse.json(booking);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  updateBooking(body.id, { status: body.status });
  return NextResponse.json({ success: true });
}
