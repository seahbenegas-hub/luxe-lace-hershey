"use client";

import { FilterOptions } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Navy Blue", "Red", "Blush Pink", "Emerald", "Ivory", "Dusty Rose", "Charcoal", "Terracotta", "Floral"];
const occasions = ["Formal", "Party", "Casual", "Wedding", "Business"];
const categories = ["Gowns", "Cocktail", "Maxi", "Lace", "Casual", "Wedding", "Business"];

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    if (value === undefined || value === "") delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search dresses..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-100 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {Object.keys(filters).length > 0 && (
            <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
              {Object.keys(filters).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-secondary-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-secondary-700 mb-2">Category</label>
            <select
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value || undefined)}
              className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs font-semibold text-secondary-700 mb-2">Size</label>
            <select
              value={filters.size || ""}
              onChange={(e) => updateFilter("size", e.target.value || undefined)}
              className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Sizes</option>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-secondary-700 mb-2">Color</label>
            <select
              value={filters.color || ""}
              onChange={(e) => updateFilter("color", e.target.value || undefined)}
              className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Colors</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-xs font-semibold text-secondary-700 mb-2">Occasion</label>
            <select
              value={filters.occasion || ""}
              onChange={(e) => updateFilter("occasion", e.target.value || undefined)}
              className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Occasions</option>
              {occasions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-semibold text-secondary-700 mb-2">Price Range</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-secondary-500 hover:text-secondary-900 underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
