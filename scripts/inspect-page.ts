/**
 * Interactive page inspector to help find real TikTok Shop selectors
 * Run with: npx tsx scripts/inspect-page.ts <PRODUCT_URL>
 */

import { chromium } from 'playwright';

async function inspectPage(url: string) {
  console.log(`🔍 Inspecting: ${url}\n`);

  const browser = await chromium.launch({
    headless: false, // Opens visible browser
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });

  try {
    console.log('📄 Loading page...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    console.log('\n✅ Page loaded successfully!');
    console.log('\n📋 Instructions:');
    console.log('1. The browser window is now open');
    console.log('2. Right-click on product title → Inspect');
    console.log('3. Find the HTML element and note its selector');
    console.log('4. Repeat for: price, sold count, rating, reviews, etc.');
    console.log('\n🎯 Elements to find selectors for:');
    console.log('   - Product title (h1 or h2)');
    console.log('   - Current price (span with dollar amount)');
    console.log('   - Original price (crossed out price)');
    console.log('   - Sold count (e.g., "10K sold")');
    console.log('   - Rating (star rating)');
    console.log('   - Review count (number of reviews)');
    console.log('   - Category/breadcrumb');
    console.log('   - Shop name');
    console.log('   - Product image');
    console.log('   - In stock indicator\n');

    // Try to extract some basic info
    console.log('🤖 Attempting automatic extraction...\n');

    // Get page title
    const pageTitle = await page.title();
    console.log('Page Title:', pageTitle);

    // Try common selectors
    const commonSelectors = {
      title: ['h1', '[data-testid="product-title"]', '.product-title', '[class*="title"]'].slice(0,1),
      price: ['[data-testid="price"]', '.price', '[class*="price"]', 'span[class*="current"]'].slice(0,1),
      image: ['[data-testid="product-image"]', 'img[alt*="product"]', '.product-image img'].slice(0,1),
    };

    for (const [field, selectors] of Object.entries(commonSelectors)) {
      for (const selector of selectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            const text = await element.innerText().catch(() => null);
            const src = await element.getAttribute('src').catch(() => null);
            console.log(`\nFound ${field} using "${selector}":`);
            if (text) console.log('  Text:', text.substring(0, 100));
            if (src) console.log('  Src:', src.substring(0, 100));
          }
        } catch (e) {
          // Silent fail, try next selector
        }
      }
    }

    console.log('\n\n⏸️  Browser will stay open for inspection.');
    console.log('💡 Press Ctrl+C when done to close.\n');

    // Keep browser open
    await page.waitForTimeout(300000); // 5 minutes
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Get URL from command line
const url = process.argv[2];

if (!url) {
  console.log('❌ Please provide a TikTok Shop product URL');
  console.log('\nUsage: npx tsx scripts/inspect-page.ts <URL>');
  console.log('Example: npx tsx scripts/inspect-page.ts https://www.tiktok.com/view/product/1234567890\n');
  process.exit(1);
}

inspectPage(url).catch(console.error);
