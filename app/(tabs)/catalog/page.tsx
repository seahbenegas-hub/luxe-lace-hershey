"use client";

import { useState, useEffect } from "react";
import DressCard from "@/components/DressCard";
import FilterBar from "@/components/FilterBar";
import { Dress, FilterOptions } from "@/types";
import { Loader2 } from "lucide-react";

export default function CatalogPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [filtered, setFiltered] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dresses", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setDresses(data);
        setFiltered(data);
        setLoading(false);
      });
  }, []);

  const handleFilter = (filters: FilterOptions) => {
    let result = [...dresses];

    if (filters.category) {
      result = result.filter((d) => d.category === filters.category);
    }
    if (filters.size) {
      result = result.filter((d) => d.size.includes(filters.size!));
    }
    if (filters.color) {
      result = result.filter((d) => d.color === filters.color);
    }
    if (filters.occasion) {
      result = result.filter((d) => d.occasion === filters.occasion);
    }
    if (filters.minPrice) {
      result = result.filter((d) => d.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter((d) => d.price <= filters.maxPrice!);
    }

    setFiltered(result);
  };

  return (
    <div>
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-wine-soft">The collection</p>
        <h1 className="text-5xl italic text-ink">Dress Catalog</h1>
        <p className="mt-3 text-stone">
          Browse our collection of {dresses.length} premium dresses
        </p>
      </div>

      <FilterBar onFilterChange={handleFilter} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-secondary-500">No dresses match your filters.</p>
          <button
            onClick={() => { setFiltered(dresses); }}
            className="mt-4 text-primary-600 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((dress, index) => (
            <div key={dress.id} className={`mb-6 break-inside-avoid ${index % 3 === 1 ? "lg:pt-12" : index % 3 === 2 ? "lg:pt-6" : ""}`}>
              <DressCard dress={dress} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
