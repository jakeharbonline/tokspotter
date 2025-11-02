"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/")}
          className="text-tiktok-primary hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
      </div>
    </div>
  );
}
