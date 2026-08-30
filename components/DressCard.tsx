"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dress } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Calendar, Palette, Ruler } from "lucide-react";

interface DressCardProps {
  dress: Dress;
}

export default function DressCard({ dress }: DressCardProps) {
  const [imageSrc, setImageSrc] = useState(dress.image);

  return (
    <div className="group bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100">
                <Image
          src={imageSrc}
          alt={dress.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageSrc("https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop")}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-secondary-800">
            {dress.category}
          </span>
        </div>
        {!dress.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-semibold text-secondary-900">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-secondary-900 mb-1 line-clamp-1">
          {dress.name}
        </h3>
        <p className="text-sm text-secondary-500 mb-3 line-clamp-2">
          {dress.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 rounded-md text-xs text-secondary-600">
            <Palette className="w-3 h-3" />
            {dress.color}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 rounded-md text-xs text-secondary-600">
            <Ruler className="w-3 h-3" />
            {dress.size.join(", ")}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 rounded-md text-xs text-secondary-600">
            <Calendar className="w-3 h-3" />
            {dress.occasion}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-primary-600">
              {formatPrice(dress.price * 3)}
            </div>
            <div className="text-xs text-secondary-400">3-day rent fee</div>
            <div className="text-[11px] text-secondary-500">+ {formatPrice(dress.price)} / add'l day</div>
          </div>
          <Link
            href={`/booking?dress=${dress.id}`}
            className="px-4 py-2 bg-secondary-900 text-white rounded-lg text-sm font-medium hover:bg-secondary-800 transition-colors"
          >
            Rent Now
          </Link>
        </div>
      </div>
    </div>
  );
}
