"""
TikTok Shop web scraper using Playwright.
Extracts product data from public TikTok Shop pages.
"""
import asyncio
import random
from typing import List, Optional, Dict
from datetime import datetime
from playwright.async_api import async_playwright, Browser, Page
from bs4 import BeautifulSoup
import re

from ..core.config import settings
from ..models.product import Product, Shop, ProductSnapshot


class TikTokScraper:
    """Scraper for TikTok Shop product and shop data."""

    def __init__(self):
        self.browser: Optional[Browser] = None
        self.user_agent = settings.SCRAPER_USER_AGENT

    async def __aenter__(self):
        """Async context manager entry."""
        await self.initialize()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()

    async def initialize(self):
        """Initialize Playwright browser."""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        print("✅ Scraper initialized")

    async def close(self):
        """Close browser and playwright."""
        if self.browser:
            await self.browser.close()
        if hasattr(self, 'playwright'):
            await self.playwright.stop()
        print("✅ Scraper closed")

    async def _random_delay(self):
        """Add random delay to avoid detection."""
        delay = random.uniform(settings.SCRAPER_DELAY_MIN, settings.SCRAPER_DELAY_MAX)
        await asyncio.sleep(delay)

    async def _create_page(self) -> Page:
        """Create a new browser page with proper headers."""
        page = await self.browser.new_page(
            user_agent=self.user_agent,
            viewport={'width': 1920, 'height': 1080}
        )
        return page

    async def scrape_product(self, product_url: str) -> Optional[Product]:
        """
        Scrape a single product page.

        Example URL: https://www.tiktok.com/@shop/product/1234567890
        """
        page = await self._create_page()

        try:
            await page.goto(product_url, wait_until='networkidle', timeout=30000)
            await self._random_delay()

            # Get page content
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')

            # Extract product ID from URL
            product_id = self._extract_product_id(product_url)

            # Extract data (selectors may need adjustment based on actual TikTok HTML)
            # Note: These are placeholder selectors - need real TikTok Shop structure
            product_data = {
                'id': product_id,
                'title': await self._extract_text(page, 'h1[data-e2e="product-title"]'),
                'image_url': await self._extract_image(page, 'img[data-e2e="product-image"]'),
                'current_price': await self._extract_price(page, 'span[data-e2e="product-price"]'),
                'original_price': await self._extract_price(page, 'span[data-e2e="original-price"]'),
                'sold_count': await self._extract_sold_count(page),
                'rating': await self._extract_rating(page),
                'review_count': await self._extract_review_count(page),
                'category': await self._extract_text(page, 'a[data-e2e="product-category"]'),
                'shop_name': await self._extract_text(page, 'a[data-e2e="shop-name"]'),
                'shop_id': await self._extract_shop_id(page),
                'product_url': product_url,
                'shop_url': await self._extract_shop_url(page),
                'in_stock': await self._check_in_stock(page),
            }

            if not product_data['title']:
                print(f"⚠️  Could not extract product data from {product_url}")
                return None

            # Create Product model
            product = Product(**product_data)
            print(f"✅ Scraped: {product.title[:50]}...")
            return product

        except Exception as e:
            print(f"❌ Error scraping {product_url}: {e}")
            return None

        finally:
            await page.close()

    async def scrape_category(self, category_url: str, limit: int = 50) -> List[str]:
        """
        Scrape product URLs from a category/bestseller page.

        Returns: List of product URLs
        """
        page = await self._create_page()
        product_urls = []

        try:
            await page.goto(category_url, wait_until='networkidle', timeout=30000)
            await self._random_delay()

            # Scroll to load more products
            for _ in range(3):
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                await asyncio.sleep(2)

            # Extract product links
            links = await page.query_selector_all('a[href*="/product/"]')

            for link in links[:limit]:
                href = await link.get_attribute('href')
                if href and '/product/' in href:
                    full_url = href if href.startswith('http') else f'https://www.tiktok.com{href}'
                    product_urls.append(full_url)

            print(f"✅ Found {len(product_urls)} products in category")
            return list(set(product_urls))  # Remove duplicates

        except Exception as e:
            print(f"❌ Error scraping category {category_url}: {e}")
            return []

        finally:
            await page.close()

    async def scrape_shop(self, shop_url: str) -> Optional[Shop]:
        """Scrape shop/seller information."""
        page = await self._create_page()

        try:
            await page.goto(shop_url, wait_until='networkidle', timeout=30000)
            await self._random_delay()

            shop_id = self._extract_shop_id_from_url(shop_url)

            shop_data = {
                'id': shop_id,
                'name': await self._extract_text(page, 'h1[data-e2e="shop-name"]'),
                'url': shop_url,
                'rating': await self._extract_rating(page),
                'total_products': await self._extract_number(page, 'span[data-e2e="product-count"]'),
                'followers': await self._extract_number(page, 'span[data-e2e="follower-count"]'),
            }

            shop = Shop(**shop_data)
            print(f"✅ Scraped shop: {shop.name}")
            return shop

        except Exception as e:
            print(f"❌ Error scraping shop {shop_url}: {e}")
            return None

        finally:
            await page.close()

    # Helper extraction methods
    def _extract_product_id(self, url: str) -> str:
        """Extract product ID from URL."""
        match = re.search(r'/product/(\d+)', url)
        return match.group(1) if match else ''

    def _extract_shop_id_from_url(self, url: str) -> str:
        """Extract shop ID from URL."""
        match = re.search(r'/@([^/]+)', url)
        return match.group(1) if match else ''

    async def _extract_text(self, page: Page, selector: str) -> str:
        """Extract text from element."""
        try:
            element = await page.query_selector(selector)
            return await element.inner_text() if element else ''
        except:
            return ''

    async def _extract_image(self, page: Page, selector: str) -> str:
        """Extract image URL."""
        try:
            element = await page.query_selector(selector)
            return await element.get_attribute('src') if element else ''
        except:
            return ''

    async def _extract_price(self, page: Page, selector: str) -> float:
        """Extract price from element."""
        try:
            text = await self._extract_text(page, selector)
            # Remove currency symbols and convert to float
            price_str = re.sub(r'[^\d.]', '', text)
            return float(price_str) if price_str else 0.0
        except:
            return 0.0

    async def _extract_sold_count(self, page: Page) -> int:
        """Extract 'X sold' count."""
        try:
            text = await self._extract_text(page, 'span[data-e2e="sold-count"]')
            # Extract number from "15.4K sold" or "1.2M sold"
            match = re.search(r'([\d.]+)\s*([KMB])?', text, re.IGNORECASE)
            if match:
                num = float(match.group(1))
                multiplier = match.group(2)
                if multiplier:
                    multipliers = {'K': 1000, 'M': 1000000, 'B': 1000000000}
                    num *= multipliers.get(multiplier.upper(), 1)
                return int(num)
            return 0
        except:
            return 0

    async def _extract_rating(self, page: Page) -> float:
        """Extract rating (0-5)."""
        try:
            text = await self._extract_text(page, 'span[data-e2e="rating"]')
            rating_str = re.sub(r'[^\d.]', '', text)
            return float(rating_str) if rating_str else 0.0
        except:
            return 0.0

    async def _extract_review_count(self, page: Page) -> int:
        """Extract review count."""
        try:
            text = await self._extract_text(page, 'span[data-e2e="review-count"]')
            return await self._parse_count(text)
        except:
            return 0

    async def _extract_number(self, page: Page, selector: str) -> int:
        """Extract generic number."""
        try:
            text = await self._extract_text(page, selector)
            return await self._parse_count(text)
        except:
            return 0

    async def _parse_count(self, text: str) -> int:
        """Parse count with K/M/B suffixes."""
        match = re.search(r'([\d.]+)\s*([KMB])?', text, re.IGNORECASE)
        if match:
            num = float(match.group(1))
            multiplier = match.group(2)
            if multiplier:
                multipliers = {'K': 1000, 'M': 1000000, 'B': 1000000000}
                num *= multipliers.get(multiplier.upper(), 1)
            return int(num)
        return 0

    async def _extract_shop_url(self, page: Page) -> str:
        """Extract shop URL from product page."""
        try:
            element = await page.query_selector('a[data-e2e="shop-link"]')
            href = await element.get_attribute('href') if element else ''
            return href if href.startswith('http') else f'https://www.tiktok.com{href}'
        except:
            return ''

    async def _extract_shop_id(self, page: Page) -> str:
        """Extract shop ID from product page."""
        shop_url = await self._extract_shop_url(page)
        return self._extract_shop_id_from_url(shop_url)

    async def _check_in_stock(self, page: Page) -> bool:
        """Check if product is in stock."""
        try:
            # Look for out-of-stock indicators
            out_of_stock = await page.query_selector('button[data-e2e="out-of-stock"]')
            return out_of_stock is None
        except:
            return True
