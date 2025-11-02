/**
 * Bulk import TikTok Shop products into Firestore
 * Run with: npx tsx scripts/bulk-import.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { TikTokScraper } from '../lib/services/tiktok-scraper';
import { FirestoreService } from '../lib/services/firestore-service';
import { TrendCalculator } from '../lib/services/trend-calculator';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    }),
  });
}

/**
 * Add your TikTok Shop product URLs here
 * Find products on: https://www.tiktok.com (Shop section)
 */
const PRODUCT_URLS: string[] = [
  // Format: 'https://www.tiktok.com/view/product/[PRODUCT_ID]',
  // Example URLs (replace with real ones):
  // 'https://www.tiktok.com/view/product/1729762527861968902',
  // 'https://www.tiktok.com/view/product/1731692301508841983',
];

async function bulkImport() {
  console.log('🚀 TokSpotter Bulk Import');
  console.log('═'.repeat(60));

  if (PRODUCT_URLS.length === 0) {
    console.log('\n⚠️  No product URLs provided!');
    console.log('\n📝 To get started:');
    console.log('1. Visit https://www.tiktok.com');
    console.log('2. Browse TikTok Shop products');
    console.log('3. Copy product URLs (format: https://www.tiktok.com/view/product/[ID])');
    console.log('4. Add URLs to PRODUCT_URLS array in this file');
    console.log('5. Run: npx tsx scripts/bulk-import.ts\n');
    return;
  }

  const scraper = new TikTokScraper();
  const db = new FirestoreService();

  await scraper.initialize();

  const results = {
    success: 0,
    failed: 0,
    products: [] as any[],
  };

  try {
    console.log(`\n📦 Importing ${PRODUCT_URLS.length} products...\n`);

    for (let i = 0; i < PRODUCT_URLS.length; i++) {
      const url = PRODUCT_URLS[i];
      console.log(`[${i + 1}/${PRODUCT_URLS.length}] ${url}`);

      try {
        const product = await scraper.scrapeProduct(url);

        if (product) {
          // Calculate TrendScore
          const trendScore = TrendCalculator.calculateTrendScore(
            product.orders_3d_delta || 0,
            product.acceleration || 0,
            product.price_discount_rate || 0,
            product.reviews_3d_delta || 0,
            1.0,
            {
              orders_3d: { mean: 100, std: 50 },
              acceleration: { mean: 1.0, std: 0.5 },
              discount: { mean: 0.15, std: 0.1 },
              reviews_3d: { mean: 10, std: 5 },
              stock: { mean: 1.0, std: 0.2 },
            }
          );

          product.trend_score = trendScore;

          // Save to Firestore
          await db.saveProduct(product);

          // Save snapshot
          await db.saveSnapshot(product.id, {
            timestamp: new Date().toISOString(),
            price: product.current_price,
            sold_count: product.sold_count,
            review_count: product.review_count,
            rating: product.rating,
            in_stock: product.in_stock,
          });

          results.success++;
          results.products.push({
            id: product.id,
            title: product.title,
            price: product.current_price,
            trend_score: trendScore,
          });

          console.log(`  ✅ ${product.title.substring(0, 50)}... ($${product.current_price})`);
        } else {
          results.failed++;
          console.log('  ❌ Failed to scrape');
        }
      } catch (error) {
        results.failed++;
        console.log(`  ❌ Error: ${error}`);
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  } finally {
    await scraper.close();
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Import Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📦 Total: ${PRODUCT_URLS.length}\n`);

  if (results.products.length > 0) {
    console.log('🎯 Imported Products:');
    results.products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title.substring(0, 40)}... - $${p.price} (Score: ${p.trend_score.toFixed(1)})`);
    });
    console.log('\n✨ Products are now live at https://tokspotter.vercel.app\n');
  }
}

bulkImport().catch(console.error);
