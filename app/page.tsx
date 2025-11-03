"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, TrendCategory } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import FilterBar, { Filters } from "@/components/FilterBar";
import { apiClient } from "@/lib/api-client";
import { useFavorites } from "@/lib/favorites-context";

export default function Home() {
  const { favorites } = useFavorites();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TrendCategory | "all" | "favorites">("all");
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

  const loadProducts = useCallback(async () => {
    // Skip loading when on favorites tab
    if (activeTab === "favorites") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.getTrendingProducts({
        limit: 200,
        trend_category: activeTab !== "all" ? activeTab : undefined,
      });
      setAllProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Apply filters and sorting
  useEffect(() => {
    // If on favorites tab, filter to only show favorited products
    let result = activeTab === "favorites"
      ? allProducts.filter(p => favorites.has(p.id))
      : [...allProducts];

    // Apply category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Apply country filter
    if (filters.country) {
      result = result.filter(p => p.country === filters.country);
    }

    // Apply price filters
    if (filters.minPrice !== null) {
      result = result.filter(p => p.current_price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      result = result.filter(p => p.current_price <= filters.maxPrice!);
    }

    // Apply commission filter
    if (filters.minCommission !== null) {
      result = result.filter(p => (p.commission_rate || 0) * 100 >= filters.minCommission!);
    }

    // Apply sales filter
    if (filters.minSales !== null) {
      result = result.filter(p => p.sold_count >= filters.minSales!);
    }

    // Apply rating filter
    if (filters.minRating !== null) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }

    // Apply discount filter
    if (filters.minDiscount !== null) {
      result = result.filter(p => {
        const discount = p.original_price ? ((p.original_price - p.current_price) / p.original_price) * 100 : 0;
        return discount >= filters.minDiscount!;
      });
    }

    // Apply in-stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.in_stock);
    }

    // Apply affiliate filter
    if (filters.hasAffiliate) {
      result = result.filter(p => p.has_affiliate_program && p.commission_rate && p.commission_rate > 0);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'opportunity':
        result.sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0));
        break;
      case 'commission':
        result.sort((a, b) => (b.commission_rate || 0) - (a.commission_rate || 0));
        break;
      case 'sales':
        result.sort((a, b) => b.sold_count - a.sold_count);
        break;
      case 'trending':
        result.sort((a, b) => b.trend_score - a.trend_score);
        break;
      case 'price_low':
        result.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'price_high':
        result.sort((a, b) => b.current_price - a.current_price);
        break;
    }

    setFilteredProducts(result);
  }, [allProducts, filters, activeTab, favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 TokSpotter
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                The Radar for TikTok Shop Trends
              </p>
            </div>
            <button className="bg-tiktok-primary text-white px-4 py-2 rounded-lg hover:bg-tiktok-primary/90 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Trend Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "all", label: "All Trends", icon: "📊" },
              { id: TrendCategory.BREAKOUT, label: "Breakouts", icon: "🧨" },
              { id: TrendCategory.SUSTAINED, label: "Sustained Winners", icon: "🔥" },
              { id: TrendCategory.DISCOUNT_DRIVEN, label: "Discount-Driven", icon: "💸" },
              { id: "favorites", label: `Favorites${favorites.size > 0 ? ` (${favorites.size})` : ''}`, icon: "❤️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-tiktok-primary text-tiktok-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar onFiltersChange={setFilters} />
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === "favorites" ? "No favorites yet" : "No products found"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {activeTab === "favorites"
                ? "Click the heart icon on any product to add it to your favorites"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {allProducts.length} products
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a
                href="/legal/terms"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Terms of Service
              </a>
              <a
                href="/legal/privacy"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Privacy Policy
              </a>
            </div>
            <p className="text-center text-gray-400 text-sm">
              © 2025 TokSpotter. Made with ❤️ for TikTok sellers and creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
