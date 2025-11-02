import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implement dynamic category extraction from database
  // For now, return common TikTok Shop categories
  const categories = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home & Living',
    'Sports & Outdoors',
    'Toys & Games',
    'Books & Media',
    'Food & Beverage',
    'Health & Wellness',
    'Automotive',
    'Pet Supplies',
    'Baby & Kids',
    'Office Supplies',
    'Garden & Outdoor',
    'Arts & Crafts',
  ];

  return NextResponse.json(categories);
}
