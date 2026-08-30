import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body?.amount ?? 0);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({
        success: true,
        transactionId: `demo_${Math.random().toString(36).slice(2, 12)}`,
        status: "paid",
        amount,
        mode: "demo",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: body.currency || "php",
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: body.bookingId || "demo-booking",
        userEmail: body.userEmail || "guest@example.com",
      },
    });

    return NextResponse.json({
      success: true,
      transactionId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      amount,
      mode: "stripe",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
