import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/services/firestore-service';
import { TrendCalculator } from '@/lib/services/trend-calculator';
import { Product } from '@/types/product';

/**
 * QUICK populate - 10 viral products instantly
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = new FirestoreService();

  // Top 10 viral TikTok Shop products
  const viral = [
    { title: 'CeraVe Moisturizing Cream - Viral Skincare', category: 'Beauty & Personal Care', price: 19.99, discount: 0.15, sold: 452000 },
    { title: 'e.l.f. Power Grip Primer - TikTok Famous', category: 'Beauty & Personal Care', price: 10, discount: 0.2, sold: 1250000 },
    { title: 'LED Strip Lights 50ft - Room Glow Up', category: 'Home & Garden', price: 23.99, discount: 0.5, sold: 678000 },
    { title: 'Ninja AF101 Air Fryer - Healthy Cooking', category: 'Kitchen & Dining', price: 89.99, discount: 0.33, sold: 456000 },
    { title: 'Crocs Classic Clog - Comfort Icon', category: 'Shoes', price: 49.99, discount: 0.2, sold: 2340000 },
    { title: 'Apple AirTag 4 Pack - Never Lose Anything', category: 'Electronics', price: 99, discount: 0.05, sold: 1560000 },
    { title: 'Anker Portable Charger - Power On Go', category: 'Electronics', price: 49.99, discount: 0.3, sold: 894000 },
    { title: 'Liquid I.V. Hydration - Electrolyte Hit', category: 'Health & Fitness', price: 24.99, discount: 0.2, sold: 1890000 },
    { title: 'Squishmallows 16-Inch - Plush Craze', category: 'Toys & Hobbies', price: 39.99, discount: 0.25, sold: 892000 },
    { title: 'The Ordinary Niacinamide - Skincare Hero', category: 'Beauty & Personal Care', price: 6.90, discount: 0, sold: 1560000 },
  ];

  let added = 0;

  for (let i = 0; i < viral.length; i++) {
    const v = viral[i];
    const current = v.price * (1 - v.discount);
    const orders3d = Math.floor(v.sold * 0.05);
    const orders7d = Math.floor(v.sold * 0.12);

    const product: Product = {
      id: `viral-${Date.now()}-${i}`,
      title: v.title,
      image_url: `https://via.placeholder.com/400x400?text=${encodeURIComponent(v.title.split(' ')[0])}`,
      current_price: Number(current.toFixed(2)),
      original_price: v.price,
      sold_count: v.sold,
      rating: 4.7 + (Math.random() * 0.3),
      review_count: Math.floor(v.sold * 0.15),
      category: v.category,
      shop_name: `${v.category.split(' ')[0]} Store`,
      shop_id: `shop_${i}`,
      shop_url: `https://www.tiktok.com/@shop${i}`,
      product_url: `https://www.tiktok.com/product/${i}`,
      in_stock: true,
      country: 'US',
      orders_3d_delta: orders3d,
      orders_7d_delta: orders7d,
      price_discount_rate: v.discount,
      reviews_3d_delta: Math.floor(orders3d * 0.15),
      velocity_3d: orders3d / 3,
      acceleration: orders7d > 0 ? orders3d / (orders7d / 7) : 1.0,
      trend_score: 0,
      confidence_score: 0.85,
      has_affiliate_program: true,
      commission_rate: 0.10,
      first_seen: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date().toISOString(),
      snapshot_count: 15,
    };

    product.trend_score = TrendCalculator.calculateTrendScore(
      product.orders_3d_delta,
      product.acceleration,
      product.price_discount_rate,
      product.reviews_3d_delta,
      1.0,
      {
        orders_3d: { mean: 5000, std: 2500 },
        acceleration: { mean: 1.2, std: 0.5 },
        discount: { mean: 0.2, std: 0.1 },
        reviews_3d: { mean: 500, std: 250 },
        stock: { mean: 1.0, std: 0.2 },
      }
    );

    await db.saveProduct(product);
    await db.saveSnapshot(product.id, {
      timestamp: product.last_updated,
      price: product.current_price,
      sold_count: product.sold_count,
      review_count: product.review_count,
      rating: product.rating,
      in_stock: product.in_stock,
    });

    added++;
  }

  return NextResponse.json({
    success: true,
    message: `Added ${added} viral products`,
    products: added,
  });
}
