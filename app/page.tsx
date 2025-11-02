"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, TrendCategory } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TrendCategory | "all">("all");
  const [category, setCategory] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTrendingProducts({
        limit: 50,
        trend_category: activeTab !== "all" ? activeTab : undefined,
        category: category || undefined,
        country: country || undefined,
      });
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, category, country]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
        <FilterBar onCategoryChange={setCategory} onCountryChange={setCountry} />
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 TokSpotter. Made with ❤️ for TikTok sellers and creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
