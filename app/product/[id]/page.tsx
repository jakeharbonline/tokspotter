"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types/product";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import { useFavorites } from "@/lib/favorites-context";
import SimpleLineChart from "@/components/SimpleLineChart";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product.id);
    }
  };

  // Generate mock historical data for visualization
  const historicalData = useMemo(() => {
    if (!product) return { prices: [], sales: [], ratings: [] };

    const days = 30;
    const now = new Date();
    const prices = [];
    const sales = [];
    const ratings = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Mock price history with some variation
      const priceVariation = product.original_price
        ? (product.original_price - product.current_price) * (i / days)
        : 0;
      prices.push({
        date: dateStr,
        price: product.current_price + priceVariation,
      });

      // Mock cumulative sales with growth
      const growthFactor = Math.pow(1 - (i / days), 2);
      sales.push({
        date: dateStr,
        sold: Math.floor(product.sold_count * growthFactor),
      });

      // Mock rating history (slight fluctuation around current rating)
      const ratingVariation = (Math.random() - 0.5) * 0.3;
      ratings.push({
        date: dateStr,
        rating: Math.max(1, Math.min(5, product.rating + ratingVariation)),
      });
    }

    return { prices, sales, ratings };
  }, [product]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiClient.getProductDetail(params.id as string);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tiktok-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push("/")}
            className="text-tiktok-primary hover:underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const favorited = product ? isFavorite(product.id) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-tiktok-primary hover:underline flex items-center gap-2"
          >
            ← Back to Products
          </button>
          <button
            onClick={handleFavoriteClick}
            className="bg-white rounded-full p-3 hover:bg-gray-50 transition-all hover:scale-110 shadow-md border border-gray-200"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={favorited ? "#ef4444" : "none"}
              stroke={favorited ? "#ef4444" : "#6b7280"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 transition-colors"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-tiktok-primary">
                  ${product.current_price}
                </span>
                {product.original_price && product.original_price > product.current_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500">
                    ({product.review_count.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="text-lg">
                  <span className="font-semibold">{product.sold_count.toLocaleString()}</span>
                  <span className="text-gray-600"> sold</span>
                </div>

                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                  TrendScore: {product.trend_score.toFixed(1)}
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Shop:</span>
                  <span className="ml-2 font-medium">{product.shop_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 font-medium">
                    {product.in_stock ? "✅ In Stock" : "❌ Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Opportunity Score */}
              {product.opportunity_score !== undefined && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Opportunity Score:</span>
                    <span className={`text-2xl font-bold ${
                      product.opportunity_score >= 80
                        ? 'text-green-600'
                        : product.opportunity_score >= 60
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}>
                      {product.opportunity_score}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        product.opportunity_score >= 80
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : product.opportunity_score >= 60
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-600'
                      }`}
                      style={{ width: `${product.opportunity_score}%` }}
                    />
                  </div>
                </div>
              )}

              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full bg-tiktok-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-tiktok-primary/90 transition"
              >
                View on TikTok Shop →
              </a>
            </div>
          </div>
        </div>

        {/* Historical Data Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historical Data</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Price History */}
            <SimpleLineChart
              data={historicalData.prices.map(p => ({ date: p.date, value: p.price }))}
              color="#10b981"
              label="Price History"
              valueFormatter={(v) => `$${v.toFixed(2)}`}
            />

            {/* Sales History */}
            <SimpleLineChart
              data={historicalData.sales.map(s => ({ date: s.date, value: s.sold }))}
              color="#3b82f6"
              label="Cumulative Sales"
              valueFormatter={(v) => v.toLocaleString()}
            />

            {/* Rating History */}
            <SimpleLineChart
              data={historicalData.ratings.map(r => ({ date: r.date, value: r.rating }))}
              color="#f59e0b"
              label="Rating History"
              valueFormatter={(v) => v.toFixed(1) + " ⭐"}
            />

            {/* Key Metrics Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">30-Day Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500">Price Change</div>
                  <div className={`text-lg font-bold ${
                    historicalData.prices[0].price > product.current_price
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {historicalData.prices[0].price > product.current_price ? '↓' : '↑'} $
                    {Math.abs(historicalData.prices[0].price - product.current_price).toFixed(2)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Sales Growth</div>
                  <div className="text-lg font-bold text-blue-600">
                    {product.sold_count.toLocaleString()} total sales
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">3-Day Order Delta</div>
                  <div className="text-lg font-bold text-green-600">
                    +{product.orders_3d_delta.toLocaleString()} orders
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">7-Day Order Delta</div>
                  <div className="text-lg font-bold text-blue-600">
                    +{product.orders_7d_delta.toLocaleString()} orders
                  </div>
                </div>

                {product.acceleration > 0 && (
                  <div>
                    <div className="text-xs text-gray-500">Acceleration</div>
                    <div className="text-lg font-bold text-purple-600">
                      {product.acceleration.toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        {product.viability_summary && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Viability Analysis</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.viability_summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
