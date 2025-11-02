export enum TrendCategory {
  BREAKOUT = "breakout",
  SUSTAINED = "sustained",
  DISCOUNT_DRIVEN = "discount_driven",
}

export enum ViabilityGrade {
  A_PLUS = "A+",
  A = "A",
  A_MINUS = "A-",
  B_PLUS = "B+",
  B = "B",
  B_MINUS = "B-",
  C_PLUS = "C+",
  C = "C",
  C_MINUS = "C-",
  D = "D",
  E = "E",
}

export interface ProductSnapshot {
  timestamp: string;
  price: number;
  original_price?: number;
  sold_count: number;
  rating: number;
  review_count: number;
  in_stock: boolean;
}

export interface Product {
  id: string;
  title: string;
  image_url: string;
  category: string;
  shop_id: string;
  shop_name: string;
  country?: string; // Product origin/target market (US, UK, CA, etc.)

  // Current data
  current_price: number;
  original_price?: number;
  sold_count: number;
  rating: number;
  review_count: number;
  in_stock: boolean;

  // URLs
  product_url: string;
  shop_url: string;

  // Trend metrics
  trend_score: number;
  orders_3d_delta: number;
  orders_7d_delta: number;
  price_discount_rate: number;
  reviews_3d_delta: number;
  velocity_3d: number;
  acceleration: number;

  // Classification
  trend_category?: TrendCategory;
  viability_grade?: ViabilityGrade;
  viability_summary?: string;
  confidence_score: number;

  // PVS Components
  pv_demand_momentum?: number;
  pv_sustained_interest?: number;
  pv_price_stability?: number;
  pv_saturation?: number;
  pv_sentiment?: number;

  // Commission
  commission_rate?: number;
  has_affiliate_program: boolean;

  // Metadata
  first_seen: string;
  last_updated: string;
  snapshot_count: number;
}

export interface ProductDetail extends Product {
  snapshots: ProductSnapshot[];
  price_history: Array<{ date: string; price: number }>;
  sales_history: Array<{ date: string; sold_count: number }>;
}

export interface Shop {
  id: string;
  name: string;
  url: string;
  rating: number;
  total_products: number;
  followers?: number;
  badges: string[];
  response_rate?: number;
  ship_on_time_rate?: number;
  top_products: string[];
  first_seen: string;
  last_updated: string;
}
