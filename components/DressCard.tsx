"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dress } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Calendar, Palette, Ruler } from "lucide-react";

interface DressCardProps {
  dress: Dress;
}

export default function DressCard({ dress }: DressCardProps) {
  const imageList = dress.images && dress.images.length > 0 ? dress.images : [dress.image];
  const [imageSrc, setImageSrc] = useState(imageList[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setImageSrc(imageList[0]);
  }, [dress.id, dress.image, dress.images]);

  return (
    <div className="group bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100">
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="block h-full w-full"
          aria-label={`View ${dress.name} photos`}
        >
          <Image
            src={imageSrc}
            alt={dress.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageSrc("https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop")}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </button>
        {imageList.length > 1 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white">
            {imageList.length} photos
          </div>
        )}
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
              {formatPrice(dress.price)}
            </div>
            <div className="text-xs text-secondary-400">3-day rent fee</div>
            <div className="text-[11px] text-secondary-500">+ {formatPrice(dress.additionalDayPrice ?? 0)} / add'l day</div>
          </div>
          <Link
            href={`/booking?dress=${dress.id}`}
            className="px-4 py-2 bg-secondary-900 text-white rounded-lg text-sm font-medium hover:bg-secondary-800 transition-colors"
          >
            Rent Now
          </Link>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-11 right-0 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Close
            </button>

            <div className="relative overflow-hidden rounded-xl bg-secondary-100">
              <img
                src={imageList[0]}
                alt={dress.name}
                className="max-h-[72vh] w-full object-contain"
              />
            </div>

            {imageList.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {imageList.map((photo, index) => (
                  <button
                    key={`${dress.id}-${index}`}
                    type="button"
                    onClick={() => {
                      setImageSrc(photo);
                      setIsPreviewOpen(true);
                    }}
                    className={`overflow-hidden rounded-lg border-2 ${imageSrc === photo ? "border-primary-500" : "border-transparent"}`}
                  >
                    <img src={photo} alt={`${dress.name} photo ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
