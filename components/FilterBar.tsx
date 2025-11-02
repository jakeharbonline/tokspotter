"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

interface FilterBarProps {
  onCategoryChange: (category: string | null) => void;
  onCountryChange: (country: string | null) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

export default function FilterBar({ onCategoryChange, onCountryChange }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country);
    onCountryChange(country);
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    onCategoryChange(null);
    onCountryChange(null);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Country Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Country:</label>
        <select
          value={selectedCountry || ""}
          onChange={(e) => handleCountryChange(e.target.value || null)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Category:</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => handleCategoryChange(e.target.value || null)}
          className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedCountry) && (
        <button
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
