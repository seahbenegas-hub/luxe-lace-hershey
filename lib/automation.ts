import { Resend } from "resend";
import type { Booking } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const brevoApiKey = process.env.BREVO_API_KEY;
const from = process.env.EMAIL_FROM || "Luxe Lace <onboarding@resend.dev>";

function senderDetails() {
  const match = from.match(/^(.*?)\s*<([^>]+)>$/);
  return match ? { name: match[1].trim(), email: match[2].trim() } : { email: from.trim() };
}

const adminEmail = process.env.ADMIN_EMAIL || senderDetails().email;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

function luxeLaceTemplate(title: string, greeting: string, content: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8f5f1;color:#332d2b;font-family:Georgia,'Times New Roman',serif;">
    <div style="padding:36px 16px;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded7;">
        <div style="padding:28px 32px;background:#6f3045;color:#ffffff;text-align:center;">
          <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;">Luxe &amp; Lace</div>
          <div style="margin-top:8px;font-size:28px;">${escapeHtml(title)}</div>
        </div>
        <div style="padding:32px;line-height:1.6;font-size:16px;">
          <p style="margin-top:0;">${escapeHtml(greeting)}</p>
          ${content}
          <p style="margin-bottom:0;">With care,<br /><strong>Luxe &amp; Lace</strong></p>
        </div>
        <div style="padding:18px 32px;background:#f4eee9;color:#756b66;text-align:center;font:12px Arial,sans-serif;">
          Designer dress rental in Hershey
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function bookingDetails(booking: Booking) {
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;font:14px Arial,sans-serif;">
    <tr><td style="padding:10px 0;color:#756b66;">Dress</td><td style="padding:10px 0;text-align:right;font-weight:bold;">${escapeHtml(booking.dressName)}</td></tr>
    <tr><td style="padding:10px 0;color:#756b66;border-top:1px solid #eee6e0;">Rental dates</td><td style="padding:10px 0;text-align:right;border-top:1px solid #eee6e0;">${escapeHtml(formatDate(booking.startDate))} - ${escapeHtml(formatDate(booking.endDate))}</td></tr>
    <tr><td style="padding:10px 0;color:#756b66;border-top:1px solid #eee6e0;">Total</td><td style="padding:10px 0;text-align:right;border-top:1px solid #eee6e0;font-weight:bold;">₱${booking.totalPrice.toFixed(2)}</td></tr>
    <tr><td style="padding:10px 0;color:#756b66;border-top:1px solid #eee6e0;">Booking ID</td><td style="padding:10px 0;text-align:right;border-top:1px solid #eee6e0;word-break:break-all;">${escapeHtml(booking.id)}</td></tr>
  </table>`;
}

async function sendEmail(to: string | undefined, subject: string, text: string, html: string) {
  if (!to) {
    console.error(`Email skipped because recipient is missing: ${subject}`);
    return false;
  }

  try {
    if (brevoApiKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: senderDetails(),
          to: [{ email: to }],
          subject,
          textContent: text,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        console.error("Brevo email delivery failed:", response.status, await response.text());
        return false;
      }

      console.info(`Brevo email sent: ${subject} -> ${to}`);
      return true;
    }

    if (!resend) {
      console.error(`Email skipped because RESEND_API_KEY and BREVO_API_KEY are not configured: ${subject}`);
      return false;
    }

    const { error } = await resend.emails.send({ from, to, subject, text, html });
    if (error) {
      console.error("Resend email delivery failed:", error);
      return false;
    }

    console.info(`Resend email sent: ${subject} -> ${to}`);
    return true;
  } catch (error) {
    console.error("Email provider request failed:", error);
    return false;
  }
}

export async function sendBookingConfirmation(booking: Booking) {
  const greeting = `Hi ${booking.userName},`;
  const text = `${greeting}\n\nYour Luxe Lace rental is confirmed.\n\nDress: ${booking.dressName}\nRental dates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal: ₱${booking.totalPrice.toFixed(2)}\n\nBooking ID: ${booking.id}\n\nThank you for choosing Luxe Lace.`;
  return sendEmail(
    booking.userEmail,
    `Booking confirmed: ${booking.dressName}`,
    text,
    luxeLaceTemplate("Your booking is confirmed", greeting, `<p>Your Luxe Lace rental is confirmed. We are looking forward to helping you feel wonderful for your special occasion.</p>${bookingDetails(booking)}`)
  );
}

export async function sendAdminBookingNotification(booking: Booking) {
  const text = `A new booking was created.\n\nCustomer: ${booking.userName} (${booking.userEmail})\nDress: ${booking.dressName}\nRental dates: ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}\nTotal: ₱${booking.totalPrice.toFixed(2)}\nBooking ID: ${booking.id}`;
  return sendEmail(
    adminEmail,
    `New dress booking: ${booking.dressName}`,
    text,
    luxeLaceTemplate("New booking received", "Hello Luxe & Lace team,", `<p>A new booking was created.</p>${bookingDetails(booking)}<p style="font-family:Arial,sans-serif;font-size:14px;"><strong>Customer:</strong> ${escapeHtml(booking.userName)} (${escapeHtml(booking.userEmail)})</p>`)
  );
}

export async function sendReturnReminder(booking: Booking) {
  const greeting = `Hi ${booking.userName},`;
  return sendEmail(
    booking.userEmail,
    `Return reminder: ${booking.dressName}`,
    `${greeting}\n\nThis is a reminder that your Luxe Lace rental is due back on ${formatDate(booking.endDate)}.\n\nDress: ${booking.dressName}\nBooking ID: ${booking.id}\n\nPlease contact us if you need help.`,
    luxeLaceTemplate("A gentle return reminder", greeting, `<p>Your rental is due back on <strong>${escapeHtml(formatDate(booking.endDate))}</strong>. Please make arrangements for its return.</p>${bookingDetails(booking)}<p>Please contact us if you need help.</p>`)
  );
}

export async function sendOverdueReminder(booking: Booking) {
  const greeting = `Hi ${booking.userName},`;
  return sendEmail(
    booking.userEmail,
    `Rental return overdue: ${booking.dressName}`,
    `${greeting}\n\nOur records show that your Luxe Lace rental was due back on ${formatDate(booking.endDate)}. Please arrange its return as soon as possible.\n\nDress: ${booking.dressName}\nBooking ID: ${booking.id}\n\nPlease contact us if the dress has already been returned.`,
    luxeLaceTemplate("Your rental needs attention", greeting, `<p>Our records show that your rental was due back on <strong>${escapeHtml(formatDate(booking.endDate))}</strong>. Please arrange its return as soon as possible.</p>${bookingDetails(booking)}<p>Please contact us if the dress has already been returned.</p>`)
  );
}
