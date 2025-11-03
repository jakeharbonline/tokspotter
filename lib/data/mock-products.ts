/**
 * Realistic Mock TikTok Shop Products
 * Based on actual trending products from TikTok Shop
 * Used for development and demo purposes
 */

import { Product, TrendCategory } from '@/types/product';

export const MOCK_PRODUCTS: Omit<Product, 'first_seen' | 'last_updated'>[] = [
  // Beauty & Personal Care
  {
    id: 'mock-1729229272609899879',
    title: 'CeraVe Hydrating Facial Cleanser - Normal to Dry Skin',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    current_price: 14.99,
    original_price: 19.99,
    sold_count: 45230,
    rating: 4.8,
    review_count: 8934,
    category: 'Beauty & Personal Care',
    shop_name: 'CeraVe Official',
    shop_id: 'cerave_official',
    shop_url: 'https://www.tiktok.com/@cerave_official',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899879',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 2340,
    orders_7d_delta: 5670,
    price_discount_rate: 0.25,
    reviews_3d_delta: 234,
    velocity_3d: 780,
    acceleration: 1.8,
    trend_score: 87.5,
    trend_category: TrendCategory.SUSTAINED,
    confidence_score: 0.95,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899880',
    title: 'The Ordinary Niacinamide 10% + Zinc 1% Serum',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    current_price: 5.99,
    original_price: 5.99,
    sold_count: 128450,
    rating: 4.6,
    review_count: 24567,
    category: 'Beauty & Personal Care',
    shop_name: 'The Ordinary',
    shop_id: 'theordinary',
    shop_url: 'https://www.tiktok.com/@theordinary',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899880',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 4560,
    orders_7d_delta: 11200,
    price_discount_rate: 0,
    reviews_3d_delta: 456,
    velocity_3d: 1520,
    acceleration: 2.3,
    trend_score: 92.1,
    trend_category: TrendCategory.BREAKOUT,
    confidence_score: 0.98,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899881',
    title: 'Maybelline Sky High Mascara - Blackest Black',
    image_url: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400',
    current_price: 10.99,
    original_price: 12.99,
    sold_count: 89340,
    rating: 4.7,
    review_count: 15678,
    category: 'Beauty & Personal Care',
    shop_name: 'Maybelline NY',
    shop_id: 'maybelline',
    shop_url: 'https://www.tiktok.com/@maybelline',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899881',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 3120,
    orders_7d_delta: 7890,
    price_discount_rate: 0.15,
    reviews_3d_delta: 312,
    velocity_3d: 1040,
    acceleration: 1.9,
    trend_score: 88.7,
    trend_category: TrendCategory.SUSTAINED,
    confidence_score: 0.96,
    has_affiliate_program: true,
    snapshot_count: 0,
  },

  // Fashion & Accessories
  {
    id: 'mock-1729229272609899882',
    title: 'Oversized Y2K Vintage Graphic Tee - Streetwear',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    current_price: 24.99,
    original_price: 34.99,
    sold_count: 67890,
    rating: 4.5,
    review_count: 12345,
    category: 'Fashion & Accessories',
    shop_name: 'Urban Threads',
    shop_id: 'urban_threads',
    shop_url: 'https://www.tiktok.com/@urban_threads',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899882',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 2890,
    orders_7d_delta: 6780,
    price_discount_rate: 0.29,
    reviews_3d_delta: 289,
    velocity_3d: 963,
    acceleration: 2.1,
    trend_score: 89.3,
    trend_category: TrendCategory.BREAKOUT,
    confidence_score: 0.94,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899883',
    title: 'Mini Shoulder Bag Crossbody - Vegan Leather',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    current_price: 29.99,
    original_price: 49.99,
    sold_count: 54321,
    rating: 4.6,
    review_count: 9876,
    category: 'Fashion & Accessories',
    shop_name: 'ChicBags Co',
    shop_id: 'chicbags',
    shop_url: 'https://www.tiktok.com/@chicbags',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899883',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 1980,
    orders_7d_delta: 4560,
    price_discount_rate: 0.40,
    reviews_3d_delta: 198,
    velocity_3d: 660,
    acceleration: 1.7,
    trend_score: 85.4,
    confidence_score: 0.92,
    has_affiliate_program: true,
    snapshot_count: 0,
  },

  // Home & Garden
  {
    id: 'mock-1729229272609899884',
    title: 'LED Strip Lights 50ft - RGB Color Changing with Remote',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    current_price: 19.99,
    original_price: 39.99,
    sold_count: 143210,
    rating: 4.4,
    review_count: 28901,
    category: 'Home & Garden',
    shop_name: 'LightUp Home',
    shop_id: 'lightup_home',
    shop_url: 'https://www.tiktok.com/@lightup_home',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899884',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 5670,
    orders_7d_delta: 14230,
    price_discount_rate: 0.50,
    reviews_3d_delta: 567,
    velocity_3d: 1890,
    acceleration: 2.5,
    trend_score: 94.2,
    confidence_score: 0.97,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899885',
    title: 'Sunset Lamp Projector - Rainbow Atmosphere Light',
    image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
    current_price: 24.99,
    original_price: 44.99,
    sold_count: 98765,
    rating: 4.7,
    review_count: 19234,
    category: 'Home & Garden',
    shop_name: 'Cozy Vibes',
    shop_id: 'cozy_vibes',
    shop_url: 'https://www.tiktok.com/@cozy_vibes',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899885',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 4320,
    orders_7d_delta: 10890,
    price_discount_rate: 0.44,
    reviews_3d_delta: 432,
    velocity_3d: 1440,
    acceleration: 2.2,
    trend_score: 91.8,
    confidence_score: 0.96,
    has_affiliate_program: true,
    snapshot_count: 0,
  },

  // Electronics
  {
    id: 'mock-1729229272609899886',
    title: 'Wireless Earbuds Bluetooth 5.3 - 40H Playtime',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    current_price: 29.99,
    original_price: 79.99,
    sold_count: 176543,
    rating: 4.5,
    review_count: 34567,
    category: 'Electronics',
    shop_name: 'SoundWave Tech',
    shop_id: 'soundwave_tech',
    shop_url: 'https://www.tiktok.com/@soundwave_tech',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899886',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 6780,
    orders_7d_delta: 17890,
    price_discount_rate: 0.63,
    reviews_3d_delta: 678,
    velocity_3d: 2260,
    acceleration: 2.6,
    trend_score: 95.7,
    confidence_score: 0.98,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899887',
    title: 'Portable Charger 30000mAh Power Bank - Fast Charging',
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    current_price: 34.99,
    original_price: 59.99,
    sold_count: 87654,
    rating: 4.6,
    review_count: 16789,
    category: 'Electronics',
    shop_name: 'PowerGear',
    shop_id: 'powergear',
    shop_url: 'https://www.tiktok.com/@powergear',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899887',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 3450,
    orders_7d_delta: 8760,
    price_discount_rate: 0.42,
    reviews_3d_delta: 345,
    velocity_3d: 1150,
    acceleration: 2.0,
    trend_score: 89.9,
    confidence_score: 0.95,
    has_affiliate_program: true,
    snapshot_count: 0,
  },

  // Health & Fitness
  {
    id: 'mock-1729229272609899888',
    title: 'Resistance Bands Set - 5 Levels Workout Bands',
    image_url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
    current_price: 12.99,
    original_price: 24.99,
    sold_count: 65432,
    rating: 4.5,
    review_count: 12456,
    category: 'Health & Fitness',
    shop_name: 'FitLife Pro',
    shop_id: 'fitlife_pro',
    shop_url: 'https://www.tiktok.com/@fitlife_pro',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899888',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 2340,
    orders_7d_delta: 5890,
    price_discount_rate: 0.48,
    reviews_3d_delta: 234,
    velocity_3d: 780,
    acceleration: 1.8,
    trend_score: 86.3,
    confidence_score: 0.93,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
  {
    id: 'mock-1729229272609899889',
    title: 'Smart Water Bottle with Time Marker - Motivational',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    current_price: 18.99,
    original_price: 29.99,
    sold_count: 54321,
    rating: 4.7,
    review_count: 10234,
    category: 'Health & Fitness',
    shop_name: 'Hydrate Daily',
    shop_id: 'hydrate_daily',
    shop_url: 'https://www.tiktok.com/@hydrate_daily',
    product_url: 'https://www.tiktok.com/view/product/mock-1729229272609899889',
    in_stock: true,
    country: 'US',
    orders_3d_delta: 1890,
    orders_7d_delta: 4560,
    price_discount_rate: 0.37,
    reviews_3d_delta: 189,
    velocity_3d: 630,
    acceleration: 1.6,
    trend_score: 84.1,
    confidence_score: 0.91,
    has_affiliate_program: true,
    snapshot_count: 0,
  },
];

/**
 * Generate additional mock products with variations
 */
export function generateMockProducts(count: number = 50): Product[] {
  const categories = [
    'Beauty & Personal Care',
    'Fashion & Accessories',
    'Home & Garden',
    'Electronics',
    'Health & Fitness',
    'Toys & Hobbies',
    'Sports & Outdoors',
    'Baby & Kids',
    'Food & Beverages',
    'Pets',
  ];

  const productTemplates = [
    { name: 'Trending', priceRange: [10, 50], salesRange: [20000, 100000] },
    { name: 'Viral', priceRange: [15, 60], salesRange: [50000, 200000] },
    { name: 'Hot Item', priceRange: [20, 80], salesRange: [30000, 150000] },
    { name: 'Best Seller', priceRange: [12, 45], salesRange: [40000, 180000] },
  ];

  const now = new Date().toISOString();
  const products: Product[] = [...MOCK_PRODUCTS.map(p => ({ ...p, first_seen: now, last_updated: now }))];

  for (let i = 0; i < count - MOCK_PRODUCTS.length; i++) {
    const template = productTemplates[i % productTemplates.length];
    const category = categories[i % categories.length];
    const price = Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0];
    const originalPrice = price * (1 + Math.random() * 0.5);
    const sales = Math.floor(Math.random() * (template.salesRange[1] - template.salesRange[0]) + template.salesRange[0]);
    const reviews = Math.floor(sales * (0.05 + Math.random() * 0.15));
    const orders3d = Math.floor(sales * (0.05 + Math.random() * 0.1));
    const orders7d = Math.floor(orders3d * (1.5 + Math.random()));
    const reviews3d = Math.floor(reviews * (0.02 + Math.random() * 0.05));
    const acceleration = 1.2 + Math.random() * 1.5;
    const discountRate = (originalPrice - price) / originalPrice;

    // Assign trend category based on characteristics
    let trendCategory: TrendCategory;
    if (discountRate > 0.35) {
      trendCategory = TrendCategory.DISCOUNT_DRIVEN;
    } else if (acceleration > 2.2) {
      trendCategory = TrendCategory.BREAKOUT;
    } else {
      trendCategory = TrendCategory.SUSTAINED;
    }

    products.push({
      id: `mock-${Date.now()}-${i}`,
      title: `${template.name} ${category} Product ${i + 1}`,
      image_url: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&sig=${i}`,
      current_price: Math.round(price * 100) / 100,
      original_price: Math.round(originalPrice * 100) / 100,
      sold_count: sales,
      rating: 4.3 + Math.random() * 0.6,
      review_count: reviews,
      category,
      shop_name: `Shop ${i % 20}`,
      shop_id: `shop_${i % 20}`,
      shop_url: `https://www.tiktok.com/@shop_${i % 20}`,
      product_url: `https://www.tiktok.com/view/product/mock-${Date.now()}-${i}`,
      in_stock: Math.random() > 0.1,
      country: 'US',
      orders_3d_delta: orders3d,
      orders_7d_delta: orders7d,
      price_discount_rate: discountRate,
      reviews_3d_delta: reviews3d,
      velocity_3d: Math.floor(orders3d / 3),
      acceleration,
      trend_score: 70 + Math.random() * 25,
      trend_category: trendCategory,
      confidence_score: 0.85 + Math.random() * 0.1,
      has_affiliate_program: true,
      commission_rate: 0.08 + Math.random() * 0.12, // 8-20% commission

      // Calculate Opportunity Score (0-100)
      // Factors: trend score, commission rate, acceleration, low saturation, good rating
      opportunity_score: calculateOpportunityScore({
        trendScore: 70 + Math.random() * 25,
        commissionRate: 0.08 + Math.random() * 0.12, // 8-20% commission
        acceleration,
        rating: 4.3 + Math.random() * 0.6,
        soldCount: sales,
        discountRate,
        velocity: Math.floor(orders3d / 3),
      }),

      first_seen: now,
      last_updated: now,
      snapshot_count: 0,
    });
  }

  return products;
}

// Calculate Opportunity Score: How good is this product to start selling NOW
function calculateOpportunityScore(params: {
  trendScore: number;
  commissionRate: number;
  acceleration: number;
  rating: number;
  soldCount: number;
  discountRate: number;
  velocity: number;
}): number {
  const {
    trendScore,
    commissionRate,
    acceleration,
    rating,
    soldCount,
    discountRate,
    velocity,
  } = params;

  // Trending momentum (0-30 points)
  const trendingPoints = Math.min(30, (trendScore / 100) * 30);

  // Commission attractiveness (0-20 points)
  const commissionPoints = Math.min(20, commissionRate * 100 * 2);

  // Growth potential - High acceleration is good (0-20 points)
  const growthPoints = Math.min(20, (acceleration / 3) * 20);

  // Product quality - Good rating matters (0-15 points)
  const qualityPoints = (rating / 5) * 15;

  // Market opportunity - Not too saturated (0-10 points)
  // Lower sold count = higher opportunity (less competition)
  const saturationPoints = soldCount < 10000 ? 10 : soldCount < 50000 ? 7 : soldCount < 100000 ? 4 : 2;

  // Discount attractiveness (0-5 points)
  const discountPoints = Math.min(5, discountRate * 10);

  const totalScore =
    trendingPoints +
    commissionPoints +
    growthPoints +
    qualityPoints +
    saturationPoints +
    discountPoints;

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}
