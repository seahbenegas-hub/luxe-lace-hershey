import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export default function SupportPage() {
  const whatsappNumber = "+63 961 808 9219";
  const whatsappUrl = "https://wa.me/639618089219";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(whatsappUrl)}`;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-wine-soft">We are here for you</p>
        <h1 className="text-5xl italic text-ink">Support</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">We are here to help with sizing, bookings, delivery, and returns.</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-6">
          <a href="mailto:seahbenegas@gmail.com" className="block border-t-2 border-wine bg-paper-deep/40 p-7 transition-colors hover:bg-paper-deep/70">
            <Mail className="h-6 w-6 text-wine" />
            <h2 className="mt-5 text-2xl italic text-ink">Email support</h2>
            <p className="mt-2 text-stone">seahbenegas@gmail.com</p>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block border-t-2 border-brass bg-paper-deep/40 p-7 transition-colors hover:bg-paper-deep/70">
            <MessageCircle className="h-6 w-6 text-brass" />
            <h2 className="mt-5 text-2xl italic text-ink">WhatsApp</h2>
            <p className="mt-2 text-stone">{whatsappNumber}</p>
            <p className="mt-1 text-sm text-wine-soft">Message our rental team</p>
          </a>
          <p className="text-sm leading-relaxed text-stone">Please include your booking number when contacting us about an existing rental.</p>
          <Link href="/catalog" className="inline-flex text-wine font-semibold hover:text-wine-soft">Browse the collection <span aria-hidden="true" className="ml-2">-&gt;</span></Link>
        </div>

        <div className="flex flex-col items-center justify-center bg-ink p-8 text-center text-paper sm:p-12">
          <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass"><MessageCircle className="h-4 w-4" /> Scan to chat</div>
          <div className="bg-white p-4 sm:p-6">
            <img src={qrUrl} alt={`QR code to contact Luxe & Lace on WhatsApp at ${whatsappNumber}`} width="320" height="320" className="h-auto w-56 sm:w-72" />
          </div>
          <h2 className="mt-7 text-3xl italic">Chat with Luxe &amp; Lace</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper-deep">Scan this code with your phone camera to open WhatsApp and message us directly.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 border border-paper/40 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-paper/10">Open WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
