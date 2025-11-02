import { Product, ProductDetail, TrendCategory, ViabilityGrade } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface GetTrendingProductsParams {
  limit?: number;
  category?: string;
  trend_category?: TrendCategory;
  min_score?: number;
  viability_grade?: ViabilityGrade;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getTrendingProducts(params: GetTrendingProductsParams = {}): Promise<Product[]> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.category) queryParams.set("category", params.category);
    if (params.trend_category) queryParams.set("trend_category", params.trend_category);
    if (params.min_score) queryParams.set("min_score", params.min_score.toString());
    if (params.viability_grade) queryParams.set("viability_grade", params.viability_grade);

    const query = queryParams.toString();
    const endpoint = `/api/products/trending${query ? `?${query}` : ""}`;

    return this.fetch<Product[]>(endpoint);
  }

  async getProductDetail(productId: string): Promise<ProductDetail> {
    return this.fetch<ProductDetail>(`/api/products/${productId}`);
  }

  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    return this.fetch<Product[]>(`/api/products/search?${params.toString()}`);
  }

  async getCategories(): Promise<string[]> {
    return this.fetch<string[]>("/api/products/categories");
  }
}

export const apiClient = new ApiClient(API_URL);
