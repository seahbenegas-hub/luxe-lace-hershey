import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  sendOverdueReminder,
  sendReturnReminder,
  sendReviewRequest,
  sendRentalThankYou,
} from "@/lib/automation";
import type { Booking } from "@/types";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  return Boolean(secret && authorization === `Bearer ${secret}`);
}

function normalizeBooking(row: any): Booking {
  return {
    id: row.id,
    dressId: row.dress_id,
    dressName: row.dress_name,
    userEmail: row.user_email,
    userName: row.user_name || "Guest",
    startDate: row.start_date,
    endDate: row.end_date,
    totalPrice: Number(row.total_price || 0),
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase service role key is not configured" }, { status: 503 });
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStart = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate()));
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setUTCDate(tomorrowEnd.getUTCDate() + 1);
  const unpaidCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data: unpaid, error: unpaidError } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("status", "pending")
    .eq("payment_status", "pending")
    .lte("created_at", unpaidCutoff);

  if (unpaidError) {
    return NextResponse.json({ error: unpaidError.message }, { status: 500 });
  }

  const expiredIds = (unpaid || []).map((booking) => booking.id);
  if (expiredIds.length > 0) {
    await supabaseAdmin.from("bookings").update({ status: "cancelled" }).in("id", expiredIds);
  }

  const { data: dueSoon, error: dueSoonError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .in("status", ["confirmed", "inprogress"])
    .gte("end_date", tomorrowStart.toISOString())
    .lt("end_date", tomorrowEnd.toISOString())
    .is("return_reminder_sent_at", null);

  if (dueSoonError) {
    return NextResponse.json({ error: dueSoonError.message }, { status: 500 });
  }

  let returnRemindersSent = 0;
  for (const row of dueSoon || []) {
    const booking = normalizeBooking(row);
    if (await sendReturnReminder(booking)) {
      await supabaseAdmin
        .from("bookings")
        .update({ return_reminder_sent_at: now.toISOString() })
        .eq("id", booking.id);
      returnRemindersSent += 1;
    }
  }

  const { data: overdue, error: overdueError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .in("status", ["confirmed", "inprogress"])
    .lt("end_date", now.toISOString())
    .is("overdue_reminder_sent_at", null);

  if (overdueError) {
    return NextResponse.json({ error: overdueError.message }, { status: 500 });
  }

  let overdueRemindersSent = 0;
  for (const row of overdue || []) {
    const booking = normalizeBooking(row);
    if (await sendOverdueReminder(booking)) {
      await supabaseAdmin
        .from("bookings")
        .update({ overdue_reminder_sent_at: now.toISOString() })
        .eq("id", booking.id);
      overdueRemindersSent += 1;
    }
  }

  const { data: completed, error: completedError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("status", "confirmed")
    .lt("end_date", now.toISOString());

  if (completedError) {
    return NextResponse.json({ error: completedError.message }, { status: 500 });
  }

  const completedIds = (completed || []).map((booking) => booking.id);
  if (completedIds.length > 0) {
    await supabaseAdmin.from("bookings").update({ status: "completed" }).in("id", completedIds);
  }

  const { data: thankYouDue, error: thankYouError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("status", "completed")
    .is("completed_email_sent_at", null);

  if (thankYouError) {
    return NextResponse.json({ error: thankYouError.message }, { status: 500 });
  }

  let thankYouEmailsSent = 0;
  for (const row of thankYouDue || []) {
    const booking = normalizeBooking(row);
    if (await sendRentalThankYou(booking)) {
      await supabaseAdmin
        .from("bookings")
        .update({ completed_email_sent_at: now.toISOString() })
        .eq("id", booking.id);
      thankYouEmailsSent += 1;
    }
  }

  const { data: reviewDue, error: reviewError } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("status", "completed")
    .is("review_email_sent_at", null);

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  let reviewEmailsSent = 0;
  for (const row of reviewDue || []) {
    const booking = normalizeBooking(row);
    if (await sendReviewRequest(booking)) {
      await supabaseAdmin
        .from("bookings")
        .update({ review_email_sent_at: now.toISOString() })
        .eq("id", booking.id);
      reviewEmailsSent += 1;
    }
  }

  return NextResponse.json({
    expiredUnpaidBookings: expiredIds.length,
    returnRemindersSent,
    overdueRemindersSent,
    completedBookings: completedIds.length,
    thankYouEmailsSent,
    reviewEmailsSent,
  });
}
