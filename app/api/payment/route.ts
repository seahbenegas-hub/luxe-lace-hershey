import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clientKey, rateLimit } from "@/lib/security";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST(request: Request) {
  try {
    if (!rateLimit(`payment:${clientKey(request)}`, 20)) {
      return NextResponse.json({ error: "Too many payment attempts" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const amount = Number(body?.amount ?? 0);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
    }

    if (body.currency && !["php", "usd"].includes(String(body.currency).toLowerCase())) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
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
