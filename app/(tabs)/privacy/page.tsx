export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="max-w-2xl border-b border-ink/15 pb-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-wine-soft">Your information</p>
        <h1 className="text-5xl italic text-ink">Privacy Policy</h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">A straightforward account of what we collect, why we use it, and the choices available to you.</p>
      </header>
      <div className="mt-12 grid gap-12 md:grid-cols-[150px_1fr]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">Our promise</p>
        <p className="max-w-2xl text-lg leading-8 text-ink">We collect the information needed to process dress rentals, communicate about bookings, and provide customer support.</p>
      </div>
      <div className="mt-14 divide-y divide-ink/15 border-t border-ink/15">
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]"><h2 className="text-2xl italic text-wine">01</h2><div><h2 className="text-2xl text-ink">Information we use</h2><p className="mt-3 max-w-2xl leading-8 text-stone">This may include your name, email address, rental dates, selected size, payment receipt, and booking details.</p></div></section>
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]"><h2 className="text-2xl italic text-wine">02</h2><div><h2 className="text-2xl text-ink">How we protect it</h2><p className="mt-3 max-w-2xl leading-8 text-stone">Booking and receipt data is stored with our service providers and is accessed only for operating the rental service and supporting customers.</p></div></section>
        <section className="grid gap-6 py-9 md:grid-cols-[150px_1fr]"><h2 className="text-2xl italic text-wine">03</h2><div><h2 className="text-2xl text-ink">Your choices</h2><p className="mt-3 max-w-2xl leading-8 text-stone">Contact us through the Support page to request access, correction, or deletion of your personal information, subject to legal and operational requirements.</p></div></section>
      </div>
    </article>
  );
}
