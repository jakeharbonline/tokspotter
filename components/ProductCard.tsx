import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
    : 0;

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

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
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

          {/* Trend Score */}
          <div className="pt-3 border-t border-gray-100">
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
