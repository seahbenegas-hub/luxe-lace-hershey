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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Dress Catalog</h1>
        <p className="text-secondary-500 mt-1">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dress) => (
            <DressCard key={dress.id} dress={dress} />
          ))}
        </div>
      )}
    </div>
  );
}
