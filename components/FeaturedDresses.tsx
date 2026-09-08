"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Dress } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

interface FeaturedDressesProps {
  variant?: "carousel" | "grid";
}

export default function FeaturedDresses({ variant = "carousel" }: FeaturedDressesProps) {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/dresses", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data: Dress[]) => {
        const featured = data.filter((dress) => dress.featured && dress.available);
        setDresses(featured.length ? featured : data.filter((dress) => dress.available).slice(0, 4));
      })
      .catch(() => setDresses([]));
  }, []);

  useEffect(() => {
    if (variant !== "carousel" || dresses.length < 2 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % dresses.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [dresses.length, isPaused, variant]);

  if (variant === "grid") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dresses.map((dress) => (
          <Link key={dress.id} href={`/booking?dress=${dress.id}`} className="group bg-white rounded-2xl border border-secondary-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src={dress.image} alt={dress.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">{dress.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-secondary-900">{dress.name}</h3>
              <p className="text-primary-600 font-bold mt-1">{formatPrice(dress.price)}</p>
              <p className="text-xs text-secondary-500">3-day rent fee + {formatPrice(dress.additionalDayPrice ?? 0)} / add&apos;l day</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (!dresses.length) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-secondary-900 px-6 py-16 text-white sm:px-12">
        <p className="text-primary-300">New looks are arriving soon.</p>
        <h2 className="mt-3 max-w-xl text-4xl font-bold">Find a dress made for your moment.</h2>
        <Link href="/catalog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold hover:bg-primary-700">Browse the collection <ArrowRight className="h-4 w-4" /></Link>
      </section>
    );
  }

  const activeDress = dresses[activeIndex % dresses.length];
  const showNext = () => setActiveIndex((index) => (index + 1) % dresses.length);
  const showPrevious = () => setActiveIndex((index) => (index - 1 + dresses.length) % dresses.length);

  return (
    <section
      className="relative isolate min-h-[560px] overflow-hidden rounded-3xl bg-secondary-900 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Image key={activeDress.id} src={activeDress.image} alt={activeDress.name} fill priority sizes="100vw" className="object-cover object-center transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.92)_0%,rgba(15,23,42,.7)_42%,rgba(15,23,42,.12)_100%)]" />
      <div className="relative flex min-h-[560px] max-w-7xl flex-col justify-between p-7 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-primary-500/20 px-3 py-1 text-sm font-medium text-primary-100"><Sparkles className="h-4 w-4" /> Featured look</span>
          <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Resume automatic featured changes" : "Pause automatic featured changes"} className="rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20">
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
        <div className="max-w-xl py-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary-200">{activeDress.category}</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{activeDress.name}</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-secondary-200">{activeDress.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href={`/booking?dress=${activeDress.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold transition hover:bg-primary-500">Rent this look <ArrowRight className="h-4 w-4" /></Link>
            <span className="text-lg font-semibold text-primary-200">{formatPrice(activeDress.price)} <span className="text-sm font-normal text-secondary-300">/ 3 days</span></span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label="Featured dresses">
            {dresses.map((dress, index) => <button key={dress.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show ${dress.name}`} className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-10 bg-primary-400" : "w-2 bg-white/50 hover:bg-white"}`} />)}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={showPrevious} aria-label="Previous featured dress" className="rounded-full border border-white/30 bg-white/10 p-3 backdrop-blur transition hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={showNext} aria-label="Next featured dress" className="rounded-full border border-white/30 bg-white/10 p-3 backdrop-blur transition hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
