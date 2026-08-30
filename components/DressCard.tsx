"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dress } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Calendar, Palette, Ruler, X } from "lucide-react";

interface DressCardProps {
  dress: Dress;
}

export default function DressCard({ dress }: DressCardProps) {
  const imageList = dress.images && dress.images.length > 0 ? dress.images : [dress.image];
  const [imageSrc, setImageSrc] = useState(imageList[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const selectedPreviewImage = imageList[selectedIndex] || imageList[0];

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const updatePreviewImage = (nextIndex: number) => {
    const index = clamp(nextIndex, 0, imageList.length - 1);
    setSelectedIndex(index);
    setImageSrc(imageList[index]);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const goToNext = () => {
    if (imageList.length <= 1) return;
    updatePreviewImage(selectedIndex + 1);
  };

  const goToPrevious = () => {
    if (imageList.length <= 1) return;
    updatePreviewImage(selectedIndex - 1);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || zoom <= 1) return;

    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    setPan({
      x: clamp(dragRef.current.originX + dx, -180, 180),
      y: clamp(dragRef.current.originY + dy, -180, 180),
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    const nextIndex = 0;
    setSelectedIndex(nextIndex);
    setImageSrc(imageList[nextIndex]);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [dress.id, dress.image, dress.images]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };

    if (isPreviewOpen) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [isPreviewOpen]);

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
          <div className="relative w-full max-w-5xl rounded-2xl bg-white p-3 shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-2 right-2 z-10 rounded-full bg-white border-2 border-secondary-200 p-2 text-secondary-800 hover:bg-secondary-100 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative overflow-hidden rounded-xl bg-secondary-100">
              <div className="flex items-center justify-center gap-2 border-b border-secondary-200 bg-white/80 px-2 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((value) => Number(Math.max(1, Number((value - 0.25).toFixed(2)))))}
                    className="rounded-full bg-white/80 px-2 py-1 text-sm font-semibold text-secondary-800 hover:bg-white"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((value) => Number(Math.min(2.5, Number((value + 0.25).toFixed(2)))))}
                    className="rounded-full bg-white/80 px-2 py-1 text-sm font-semibold text-secondary-800 hover:bg-white"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-secondary-800 hover:bg-white"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div
                className="relative flex max-h-[72vh] cursor-grab touch-pan-y items-center justify-center overflow-hidden bg-secondary-100 p-2"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ cursor: zoom > 1 ? "grab" : "default" }}
              >
                <img
                  src={selectedPreviewImage}
                  alt={dress.name}
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: zoom > 1 ? "none" : "transform 0.2s ease",
                  }}
                  className="max-h-[68vh] w-full object-contain select-none"
                />
              </div>
            </div>

            {imageList.length > 1 && (
              <div className="sticky bottom-0 mt-3 rounded-xl border border-secondary-200 bg-white/90 p-2 backdrop-blur-sm">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {imageList.map((photo, index) => (
                    <button
                      key={`${dress.id}-${index}`}
                      type="button"
                      onClick={() => updatePreviewImage(index)}
                      className={`overflow-hidden rounded-lg border-2 ${selectedIndex === index ? "border-primary-500" : "border-transparent"}`}
                    >
                      <img src={photo} alt={`${dress.name} photo ${index + 1}`} className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
