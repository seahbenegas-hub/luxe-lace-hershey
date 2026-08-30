import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary-900">Support</h1>
      <p className="mt-2 text-secondary-500">We are here to help with sizing, bookings, delivery, and returns.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="mailto:support@luxeandlace.com" className="bg-white border border-secondary-200 rounded-2xl p-6 hover:border-primary-300 transition-colors">
          <Mail className="w-6 h-6 text-primary-600" />
          <h2 className="mt-4 font-semibold text-secondary-900">Email support</h2>
          <p className="mt-1 text-sm text-secondary-500">support@luxeandlace.com</p>
        </a>
        <a href="https://wa.me/17175550123" className="bg-white border border-secondary-200 rounded-2xl p-6 hover:border-primary-300 transition-colors">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <h2 className="mt-4 font-semibold text-secondary-900">WhatsApp</h2>
          <p className="mt-1 text-sm text-secondary-500">Message our rental team</p>
        </a>
      </div>
      <p className="mt-8 text-sm text-secondary-500">Please include your booking number when contacting us about an existing rental.</p>
      <Link href="/catalog" className="inline-flex mt-6 text-primary-600 font-medium hover:underline">Browse the collection</Link>
    </div>
  );
}
