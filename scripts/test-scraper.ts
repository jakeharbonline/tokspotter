/**
 * Test script to verify TikTok Shop scraper works with real URLs
 * Run with: npx tsx scripts/test-scraper.ts
 */

import { TikTokScraper } from '../lib/services/tiktok-scraper';

const TEST_URLS = [
  // Add real TikTok Shop product URLs here
  // Format: https://www.tiktok.com/view/product/[PRODUCT_ID]
  // Example: 'https://www.tiktok.com/view/product/1729762527861968902',
];

async function testScraper() {
  console.log('🔍 Testing TikTok Shop Scraper\n');

  if (TEST_URLS.length === 0) {
    console.log('⚠️  No test URLs provided!');
    console.log('📝 Add real TikTok Shop URLs to TEST_URLS array in this file.');
    console.log('   Format: https://www.tiktok.com/view/product/[PRODUCT_ID]\n');
    console.log('💡 To find products:');
    console.log('   1. Visit https://www.tiktok.com or open TikTok app');
    console.log('   2. Look for "Shop" or shopping bag icon');
    console.log('   3. Browse products and copy URLs');
    console.log('   4. URLs should look like: https://www.tiktok.com/view/product/1234567890\n');
    return;
  }

  const scraper = new TikTokScraper();
  await scraper.initialize();

  try {
    for (const url of TEST_URLS) {
      console.log(`\n📦 Scraping: ${url}`);
      console.log('─'.repeat(60));

      const product = await scraper.scrapeProduct(url);

      if (product) {
        console.log('✅ Success!');
        console.log('Title:', product.title);
        console.log('Price:', `$${product.current_price}`);
        console.log('Original Price:', product.original_price ? `$${product.original_price}` : 'N/A');
        console.log('Sold:', product.sold_count);
        console.log('Rating:', product.rating);
        console.log('Reviews:', product.review_count);
        console.log('Category:', product.category);
        console.log('Shop:', product.shop_name);
        console.log('In Stock:', product.in_stock ? 'Yes' : 'No');
      } else {
        console.log('❌ Failed to scrape product');
        console.log('⚠️  This could mean:');
        console.log('   - Selectors need updating');
        console.log('   - URL format is incorrect');
        console.log('   - TikTok blocked the scraper');
        console.log('   - Page structure changed\n');
        console.log('💡 Debug steps:');
        console.log('   1. Visit the URL in a browser');
        console.log('   2. Right-click → Inspect Element');
        console.log('   3. Find actual selectors for title, price, etc.');
        console.log('   4. Update lib/services/tiktok-scraper.ts with real selectors');
      }
    }
  } finally {
    await scraper.close();
    console.log('\n✨ Test complete!\n');
  }
}

// Run if called directly
if (require.main === module) {
  testScraper().catch(console.error);
}

export { testScraper };
