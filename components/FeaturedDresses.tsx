"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Dress } from "@/types";

export default function FeaturedDresses() {
  const [dresses, setDresses] = useState<Dress[]>([]);

  useEffect(() => {
    fetch("/api/dresses", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data: Dress[]) => setDresses(data.filter((dress) => dress.featured && dress.available).slice(0, 4)))
      .catch(() => setDresses([]));
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dresses.map((dress) => (
        <div key={dress.id} className="group bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-xl transition-all">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={dress.image}
              alt={dress.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
              {dress.category}
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-secondary-900">{dress.name}</h3>
            <p className="text-primary-600 font-bold mt-1">₱{dress.price}<span className="text-sm text-secondary-400 font-normal">/day</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}
