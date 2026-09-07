alter table public.bookings
  add column if not exists return_reminder_sent_at timestamptz,
  add column if not exists overdue_reminder_sent_at timestamptz,
  add column if not exists completed_email_sent_at timestamptz;
