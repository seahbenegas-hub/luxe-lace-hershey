import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    transactionId: Math.random().toString(36).substring(2, 15),
    status: "paid",
    amount: body.amount,
  });
}
