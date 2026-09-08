export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="max-w-2xl border-b border-ink/15 pb-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-wine-soft">The fine print</p>
        <h1 className="text-5xl italic text-ink">Terms of Service</h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">A clear guide to booking, caring for, and returning your Luxe &amp; Lace rental.</p>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[150px_1fr]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Please note</p>
        <p className="max-w-2xl text-lg leading-8 text-ink">By booking a dress through Luxe &amp; Lace, you agree to provide accurate contact details and return the rental according to the confirmed booking dates.</p>
      </div>

      <div className="mt-14 divide-y divide-ink/15 border-t border-ink/15">
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]">
          <h2 className="text-2xl italic text-wine">01</h2>
          <div>
            <h2 className="text-2xl text-ink">Bookings and payments</h2>
            <p className="mt-3 max-w-2xl leading-8 text-stone">A booking is confirmed after the required payment information and receipt have been submitted. Availability is subject to the inventory shown at the time of booking.</p>
          </div>
        </section>
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]">
          <h2 className="text-2xl italic text-wine">02</h2>
          <div>
            <h2 className="text-2xl text-ink">Care and returns</h2>
            <p className="mt-3 max-w-2xl leading-8 text-stone">Please return each dress using the agreed return method and report damage or delivery issues promptly.</p>
          </div>
        </section>
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]">
          <h2 className="text-2xl italic text-wine">03</h2>
          <div>
            <h2 className="text-2xl text-ink">Questions</h2>
            <p className="mt-3 max-w-2xl leading-8 text-stone">Contact Support if you need help before or during a rental.</p>
          </div>
        </section>
      </div>
    </article>
  );
}
