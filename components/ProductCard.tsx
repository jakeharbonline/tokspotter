"use client";

import { Product } from "@/types/product";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return "bg-gray-100 text-gray-700";
    const letter = grade[0];
    switch (letter) {
      case "A":
        return "bg-green-100 text-green-700";
      case "B":
        return "bg-blue-100 text-blue-700";
      case "C":
        return "bg-yellow-100 text-yellow-700";
      case "D":
      case "E":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrendBadge = () => {
    switch (product.trend_category) {
      case "breakout":
        return { icon: "🧨", label: "Breakout", color: "bg-red-500" };
      case "sustained":
        return { icon: "🔥", label: "Sustained", color: "bg-orange-500" };
      case "discount_driven":
        return { icon: "💸", label: "Discount", color: "bg-purple-500" };
      default:
        return null;
    }
  };

  const trendBadge = getTrendBadge();

  const getOpportunityColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-700 border-gray-300";
    if (score >= 80) return "bg-green-50 text-green-700 border-green-300";
    if (score >= 60) return "bg-yellow-50 text-yellow-700 border-yellow-300";
    return "bg-gray-50 text-gray-700 border-gray-300";
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Trend Badge */}
          {trendBadge && (
            <div className={`absolute top-2 left-2 ${trendBadge.color} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
              {trendBadge.icon} {trendBadge.label}
            </div>
          )}

          {/* Opportunity Score Badge */}
          {product.opportunity_score !== undefined && (
            <div className={`absolute bottom-2 left-2 ${getOpportunityColor(product.opportunity_score)} text-xs px-3 py-1.5 rounded-lg font-bold border-2 backdrop-blur-sm`}>
              🎯 {product.opportunity_score}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all hover:scale-110 shadow-md"
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
              className="w-5 h-5 transition-colors"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-14 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Viability Grade */}
          {product.viability_grade && (
            <div className={`absolute bottom-2 right-2 ${getGradeColor(product.viability_grade)} text-sm px-3 py-1 rounded-full font-bold`}>
              {product.viability_grade}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-tiktok-primary transition-colors">
            {product.title}
          </h3>

          {/* Shop */}
          <p className="text-xs text-gray-500 mb-3">{product.shop_name}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.current_price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.current_price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
            <div>
              <span className="font-semibold">{product.sold_count.toLocaleString()}</span> sold
            </div>
            <div>
              ⭐ <span className="font-semibold">{product.rating.toFixed(1)}</span>
              {product.review_count > 0 && ` (${product.review_count})`}
            </div>
          </div>

          {/* Opportunity Score */}
          {product.opportunity_score !== undefined && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Opportunity Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                  <span className={`text-sm font-bold ${
                    product.opportunity_score >= 80
                      ? 'text-green-600'
                      : product.opportunity_score >= 60
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}>
                    {product.opportunity_score}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Trend Score */}
          <div className={`${product.opportunity_score !== undefined ? 'pt-2' : 'pt-3 border-t border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Trend Score</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-tiktok-primary to-tiktok-secondary"
                    style={{ width: `${product.trend_score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(product.trend_score)}
                </span>
              </div>
            </div>

            {/* Growth Indicator */}
            {product.orders_3d_delta > 0 && (
              <div className="mt-2 text-xs text-green-600 font-medium">
                📈 +{product.orders_3d_delta.toLocaleString()} orders (3d)
              </div>
            )}
          </div>

          {/* Affiliate Badge */}
          {product.has_affiliate_program && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">💰 Affiliate Available</span>
                {product.commission_rate && (
                  <span className="font-semibold text-green-600">
                    {(product.commission_rate * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
