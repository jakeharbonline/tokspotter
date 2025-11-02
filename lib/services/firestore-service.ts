import { getDb } from '@/lib/server/firebase-admin';
import { Product, Shop, ProductSnapshot, TrendCategory } from '@/types/product';

export class FirestoreService {
  private db;

  constructor() {
    this.db = getDb();
  }

  // Product operations
  async saveProduct(product: Product): Promise<boolean> {
    try {
      await this.db.collection('products').doc(product.id).set(
        {
          ...product,
          last_updated: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error(`Error saving product ${product.id}:`, error);
      return false;
    }
  }

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const doc = await this.db.collection('products').doc(productId).get();
      if (doc.exists) {
        return doc.data() as Product;
      }
      return null;
    } catch (error) {
      console.error(`Error getting product ${productId}:`, error);
      return null;
    }
  }

  async getTrendingProducts(params: {
    limit?: number;
    category?: string;
    trend_category?: TrendCategory;
    min_score?: number;
  }): Promise<Product[]> {
    try {
      let query: any = this.db.collection('products');

      if (params.category) {
        query = query.where('category', '==', params.category);
      }
      if (params.trend_category) {
        query = query.where('trend_category', '==', params.trend_category);
      }
      if (params.min_score && params.min_score > 0) {
        query = query.where('trend_score', '>=', params.min_score);
      }

      query = query.orderBy('trend_score', 'desc').limit(params.limit || 50);

      const snapshot = await query.get();
      const products: Product[] = [];

      snapshot.forEach((doc: any) => {
        products.push(doc.data() as Product);
      });

      return products;
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }

  async searchProducts(searchTerm: string, limit: number = 20): Promise<Product[]> {
    try {
      // Firestore doesn't support full-text search
      // For MVP, we'll get products and filter in memory
      // For production, use Algolia or Elasticsearch
      const snapshot = await this.db.collection('products').limit(100).get();

      const products: Product[] = [];
      const searchLower = searchTerm.toLowerCase();

      snapshot.forEach((doc: any) => {
        const product = doc.data() as Product;
        if (product.title.toLowerCase().includes(searchLower)) {
          products.push(product);
        }
      });

      return products.slice(0, limit);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Snapshot operations
  async saveSnapshot(productId: string, snapshot: ProductSnapshot): Promise<boolean> {
    try {
      await this.db
        .collection('products')
        .doc(productId)
        .collection('snapshots')
        .add({
          ...snapshot,
          timestamp: new Date(snapshot.timestamp).toISOString(),
        });
      return true;
    } catch (error) {
      console.error(`Error saving snapshot for ${productId}:`, error);
      return false;
    }
  }

  async getSnapshots(productId: string, days: number = 7): Promise<ProductSnapshot[]> {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      const snapshot = await this.db
        .collection('products')
        .doc(productId)
        .collection('snapshots')
        .where('timestamp', '>=', cutoff.toISOString())
        .orderBy('timestamp', 'desc')
        .get();

      const snapshots: ProductSnapshot[] = [];
      snapshot.forEach((doc: any) => {
        snapshots.push(doc.data() as ProductSnapshot);
      });

      return snapshots;
    } catch (error) {
      console.error(`Error getting snapshots for ${productId}:`, error);
      return [];
    }
  }

  // Shop operations
  async saveShop(shop: Shop): Promise<boolean> {
    try {
      await this.db.collection('shops').doc(shop.id).set(
        {
          ...shop,
          last_updated: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error(`Error saving shop ${shop.id}:`, error);
      return false;
    }
  }

  async getShop(shopId: string): Promise<Shop | null> {
    try {
      const doc = await this.db.collection('shops').doc(shopId).get();
      if (doc.exists) {
        return doc.data() as Shop;
      }
      return null;
    } catch (error) {
      console.error(`Error getting shop ${shopId}:`, error);
      return null;
    }
  }

  // Statistics for trend calculation
  async getProductStatistics(): Promise<{
    orders_3d: { mean: number; std: number };
    acceleration: { mean: number; std: number };
    discount: { mean: number; std: number };
    reviews_3d: { mean: number; std: number };
    stock: { mean: number; std: number };
  }> {
    try {
      const snapshot = await this.db.collection('products').limit(1000).get();

      const orders3d: number[] = [];
      const accelerations: number[] = [];
      const discounts: number[] = [];
      const reviews3d: number[] = [];
      const stockStabilities: number[] = [];

      snapshot.forEach((doc: any) => {
        const data = doc.data();
        orders3d.push(data.orders_3d_delta || 0);
        accelerations.push(data.acceleration || 0);
        discounts.push(data.price_discount_rate || 0);
        reviews3d.push(data.reviews_3d_delta || 0);
        const snapCount = data.snapshot_count || 1;
        stockStabilities.push(1.0 - 1.0 / Math.max(snapCount, 1));
      });

      const calcStats = (arr: number[]) => {
        if (arr.length === 0) return { mean: 0, std: 1 };
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance =
          arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        const std = Math.sqrt(variance) || 1;
        return { mean, std };
      };

      return {
        orders_3d: calcStats(orders3d),
        acceleration: calcStats(accelerations),
        discount: calcStats(discounts),
        reviews_3d: calcStats(reviews3d),
        stock: calcStats(stockStabilities),
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        orders_3d: { mean: 0, std: 1 },
        acceleration: { mean: 0, std: 1 },
        discount: { mean: 0, std: 1 },
        reviews_3d: { mean: 0, std: 1 },
        stock: { mean: 0, std: 1 },
      };
    }
  }
}
