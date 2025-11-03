"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface Filters {
  category: string | null;
  country: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minCommission: number | null;
  minSales: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  hasAffiliate: boolean;
  minDiscount: number | null;
  sortBy: 'opportunity' | 'commission' | 'sales' | 'price_low' | 'price_high' | 'trending' | null;
}

interface FilterBarProps {
  onFiltersChange: (filters: Filters) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const SORT_OPTIONS = [
  { value: 'opportunity', label: '🎯 Best Opportunity' },
  { value: 'commission', label: '💰 Highest Commission' },
  { value: 'sales', label: '📈 Most Sales' },
  { value: 'trending', label: '🔥 Trending' },
  { value: 'price_low', label: '💵 Price: Low to High' },
  { value: 'price_high', label: '💵 Price: High to Low' },
];

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    category: null,
    country: null,
    minPrice: null,
    maxPrice: null,
    minCommission: null,
    minSales: null,
    minRating: null,
    inStockOnly: false,
    hasAffiliate: false,
    minDiscount: null,
    sortBy: 'opportunity',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setFilters({
      category: null,
      country: null,
      minPrice: null,
      maxPrice: null,
      minCommission: null,
      minSales: null,
      minRating: null,
      inStockOnly: false,
      hasAffiliate: false,
      minDiscount: null,
      sortBy: 'opportunity',
    });
  };

  const hasActiveFilters = filters.category || filters.country || filters.minPrice || filters.maxPrice ||
    filters.minCommission || filters.minSales || filters.minRating || filters.inStockOnly ||
    filters.hasAffiliate || filters.minDiscount;

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort:</label>
          <select
            value={filters.sortBy || ""}
            onChange={(e) => updateFilter('sortBy', e.target.value || null)}
            className="block w-56 rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Country:</label>
          <select
            value={filters.country || ""}
            onChange={(e) => updateFilter('country', e.target.value || null)}
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
            value={filters.category || ""}
            onChange={(e) => updateFilter('category', e.target.value || null)}
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

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-tiktok-primary hover:text-tiktok-primary/80 font-medium flex items-center gap-1"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Filters
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-2 py-1 border"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-2 py-1 border"
                />
              </div>
            </div>

            {/* Min Commission */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Min Commission %</label>
              <input
                type="number"
                placeholder="e.g. 10"
                min="0"
                max="100"
                value={filters.minCommission || ''}
                onChange={(e) => updateFilter('minCommission', e.target.value ? parseFloat(e.target.value) : null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* Min Sales */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Min Sales Volume</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={filters.minSales || ''}
                onChange={(e) => updateFilter('minSales', e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* Min Rating */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Min Rating</label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => updateFilter('minRating', e.target.value ? parseFloat(e.target.value) : null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Min Discount */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Min Discount %</label>
              <input
                type="number"
                placeholder="e.g. 20"
                min="0"
                max="100"
                value={filters.minDiscount || ''}
                onChange={(e) => updateFilter('minDiscount', e.target.value ? parseFloat(e.target.value) : null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-tiktok-primary focus:ring-tiktok-primary sm:text-sm px-3 py-2 border"
              />
            </div>

            {/* In Stock Only */}
            <div className="flex items-center h-full pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
                  className="rounded border-gray-300 text-tiktok-primary focus:ring-tiktok-primary"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            {/* Has Affiliate */}
            <div className="flex items-center h-full pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasAffiliate}
                  onChange={(e) => updateFilter('hasAffiliate', e.target.checked)}
                  className="rounded border-gray-300 text-tiktok-primary focus:ring-tiktok-primary"
                />
                <span className="text-sm text-gray-700">Affiliate Available</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
