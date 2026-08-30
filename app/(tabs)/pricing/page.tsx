import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Occasional",
    description: "Perfect for one-time events",
    price: "Pay per dress",
    features: [
      "Access to full catalog",
      "Standard delivery (2-3 days)",
      "Basic damage coverage",
      "Email support",
      "No membership fees",
    ],
    cta: "Browse Dresses",
    href: "/catalog",
    highlighted: false,
  },
  {
    name: "Frequent Renter",
    description: "For the social butterfly",
    price: "₱999/mo",
    features: [
      "Everything in Occasional",
      "Priority delivery (next day)",
      "Full damage protection",
      "10% off all rentals",
      "Free size exchanges",
      "WhatsApp support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlighted: true,
  },
  {
    name: "VIP Unlimited",
    description: "Unlimited style swaps",
    price: "₱2,499/mo",
    features: [
      "Everything in Frequent",
      "Unlimited rentals",
      "Same-day delivery",
      "20% off all rentals",
      "Exclusive designer access",
      "Personal stylist consultation",
      "24/7 priority support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Choose the plan that fits your lifestyle. All plans include professional cleaning and delivery.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-primary-500 bg-primary-50/50 shadow-xl shadow-primary-100"
                : "border-secondary-200 bg-white"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">{plan.name}</h3>
              <p className="text-sm text-secondary-500 mt-1">{plan.description}</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-secondary-900">{plan.price}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-secondary-600">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="mt-20 bg-white rounded-2xl border border-secondary-200 p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Rental Price Breakdown</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-3">What's Included</h3>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li className="flex items-center gap-2">✓ Professional dry cleaning</li>
              <li className="flex items-center gap-2">✓ Delivery & pickup</li>
              <li className="flex items-center gap-2">✓ Minor alterations if needed</li>
              <li className="flex items-center gap-2">✓ Insurance for minor damages</li>
              <li className="flex items-center gap-2">✓ Garment bag for storage</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900 mb-3">Additional Fees</h3>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li className="flex items-center gap-2">• Late return: ₱500/day</li>
              <li className="flex items-center gap-2">• Major damage: Up to dress value</li>
              <li className="flex items-center gap-2">• Lost dress: Full replacement cost</li>
              <li className="flex items-center gap-2">• Rush delivery: ₱300 surcharge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
