import { Search, Calendar, CreditCard, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Select",
    description: "Explore our curated collection of designer dresses. Filter by size, color, occasion, and price to find your perfect match.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Calendar,
    title: "Choose Your Dates",
    description: "Select your rental period using our easy booking calendar. Rent for a day, weekend, or full week.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CreditCard,
    title: "Upload Payment Receipt",
    description: "After making your payment, upload a screenshot or photo of the receipt so we can confirm your booking quickly.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "We deliver the dress to your door, professionally cleaned and ready to wear. Return using the prepaid packaging.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Sparkles,
    title: "Return & Repeat",
    description: "After your event, simply pack the dress and schedule a pickup. No dry cleaning needed - we handle everything!",
    color: "bg-pink-50 text-pink-600",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-16 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-wine-soft">The ritual</p>
        <h1 className="text-5xl italic text-ink mb-4">How It Works</h1>
        <p className="text-lg text-stone">
          Renting your dream dress is simple and hassle-free
        </p>
      </div>

      <div className="relative space-y-0 border-l border-wine/25 ml-5 md:ml-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative flex gap-6 pb-14 pl-10 md:pl-14"
          >
            <span className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-wine text-sm font-semibold text-paper ring-8 ring-paper">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3 text-wine-soft"><step.icon className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">Step {index + 1}</span></div>
              <h3 className="text-3xl italic text-ink">{step.title}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-stone">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "What if the dress doesn't fit?",
              a: "We offer free size exchanges within 24 hours of delivery. Contact our support team immediately.",
            },
            {
              q: "Is dry cleaning included?",
              a: "Yes! We handle all cleaning. Just return the dress in the provided packaging.",
            },
            {
              q: "Can I extend my rental?",
              a: "Absolutely. Contact us before your return date and we'll extend for an additional daily rate.",
            },
            {
              q: "What about damages?",
              a: "Minor wear is covered. For significant damage, a repair fee may apply up to the dress value.",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl border border-secondary-200 p-6">
              <h4 className="font-semibold text-secondary-900 mb-2">{faq.q}</h4>
              <p className="text-sm text-secondary-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
