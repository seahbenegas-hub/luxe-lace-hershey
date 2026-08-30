import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, Shield, Clock } from "lucide-react";
import FeaturedDresses from "@/components/FeaturedDresses";

export default function HomePage() {

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1920&auto=format&fit=crop"
            alt="Hero background"
            fill
            sizes="100vw"
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Premium Dress Rental
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Look Stunning for{" "}
              <span className="text-primary-400">Every Occasion</span>
            </h1>
            <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
              Rent designer dresses at a fraction of the cost. From elegant gowns to 
              cocktail dresses, find your perfect look without breaking the bank.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: "Designer Collection",
              description: "Curated selection of premium dresses from top designers and brands.",
            },
            {
              icon: Truck,
              title: "Free Delivery",
              description: "Complimentary delivery and pickup for all rentals within the city.",
            },
            {
              icon: Shield,
              title: "Damage Protection",
              description: "Minor wear and tear is covered. Rent with complete peace of mind.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 border border-secondary-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Dresses Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900">Featured Dresses</h2>
            <p className="text-secondary-500 mt-1">Handpicked styles for this season</p>
          </div>
          <Link
            href="/catalog"
            className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <FeaturedDresses />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-600 rounded-3xl p-8 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Dress?
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of happy customers who rent with us. 
            New styles added weekly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Start Browsing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
