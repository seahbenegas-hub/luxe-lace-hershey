import { Resend } from "resend";
import type { Booking } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const from = process.env.EMAIL_FROM || "Luxe Lace <onboarding@resend.dev>";
const adminEmail = process.env.ADMIN_EMAIL;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

async function sendEmail(to: string | undefined, subject: string, text: string) {
  if (!to) return false;
  if (!resend) {
    console.warn(`Email skipped because RESEND_API_KEY is not configured: ${subject}`);
    return false;
  }

  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) {
    console.error("Email delivery failed:", error);
    return false;
  }

  return true;
}

export async function sendBookingConfirmation(booking: Booking) {
  return sendEmail(
    booking.userEmail,
    `Booking confirmed: ${booking.dressName}`,
    `Hi ${booking.userName},\n\nYour Luxe Lace rental is confirmed.\n\nDress: ${booking.dressName}\nRental dates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal: $${booking.totalPrice.toFixed(2)}\n\nBooking ID: ${booking.id}\n\nThank you for choosing Luxe Lace.`
  );
}

export async function sendAdminBookingNotification(booking: Booking) {
  return sendEmail(
    adminEmail,
    `New dress booking: ${booking.dressName}`,
    `A new booking was created.\n\nCustomer: ${booking.userName} (${booking.userEmail})\nDress: ${booking.dressName}\nRental dates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal: $${booking.totalPrice.toFixed(2)}\nBooking ID: ${booking.id}`
  );
}

export async function sendReturnReminder(booking: Booking) {
  return sendEmail(
    booking.userEmail,
    `Return reminder: ${booking.dressName}`,
    `Hi ${booking.userName},\n\nThis is a reminder that your Luxe Lace rental is due back on ${formatDate(booking.endDate)}.\n\nDress: ${booking.dressName}\nBooking ID: ${booking.id}\n\nPlease contact us if you need help.`
  );
}

export async function sendOverdueReminder(booking: Booking) {
  return sendEmail(
    booking.userEmail,
    `Rental return overdue: ${booking.dressName}`,
    `Hi ${booking.userName},\n\nOur records show that your Luxe Lace rental was due back on ${formatDate(booking.endDate)}. Please arrange its return as soon as possible.\n\nDress: ${booking.dressName}\nBooking ID: ${booking.id}\n\nPlease contact us if the dress has already been returned.`
  );
}
