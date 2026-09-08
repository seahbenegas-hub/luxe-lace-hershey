import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Shield } from "lucide-react";
import FeaturedDresses from "@/components/FeaturedDresses";

export default function HomePage() {

  return (
    <div className="space-y-20 pb-20">
      {/* Featured look carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <FeaturedDresses />
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
              title: "Delivery",
              description: "Convenient delivery and pickup options are available for rentals within the city.",
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
        <FeaturedDresses variant="grid" />
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
