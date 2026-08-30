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
    title: "Free Delivery",
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">How It Works</h1>
        <p className="text-lg text-secondary-500">
          Renting your dream dress is simple and hassle-free
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl border border-secondary-200 p-8 hover:shadow-lg transition-shadow"
          >
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center`}>
                <step.icon className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
              </div>
              <p className="text-secondary-500 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-white rounded-2xl border border-secondary-200 p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Rental Price Breakdown</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Base rental",
              value: "$55–$250",
              detail: "Based on dress style and designer label.",
            },
            {
              title: "Rental period",
              value: "3–7 days",
              detail: "Choose the dates that match your event schedule.",
            },
            {
              title: "Included",
              value: "Everything",
              detail: "Cleaning, delivery, and return packaging are included.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-secondary-50 border border-secondary-200 p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-secondary-500 mb-2">{item.title}</p>
              <p className="text-2xl font-bold text-secondary-900 mb-2">{item.value}</p>
              <p className="text-sm text-secondary-500">{item.detail}</p>
            </div>
          ))}
        </div>
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
