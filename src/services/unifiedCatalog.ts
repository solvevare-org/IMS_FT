// Unified Catalog - Merges supplier data into master catalog
import { NormalizedProduct } from './apiIntegration';

export interface MasterProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  images?: string[];
  suppliers: SupplierVariant[];
  primarySupplier: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierVariant {
  supplierId: string;
  supplierName: string;
  price: number;
  stock: number;
  lastUpdated: string;
  isPreferred: boolean;
}

class UnifiedCatalogService {
  private static instance: UnifiedCatalogService;
  private masterCatalog: Map<string, MasterProduct> = new Map();
  private skuIndex: Map<string, string> = new Map(); // SKU -> Master Product ID

  static getInstance(): UnifiedCatalogService {
    if (!UnifiedCatalogService.instance) {
      UnifiedCatalogService.instance = new UnifiedCatalogService();
    }
    return UnifiedCatalogService.instance;
  }

  // Supplier data merged into a master catalog
  async updateSupplierProducts(supplierId: string, products: NormalizedProduct[]): Promise<void> {
    for (const product of products) {
      await this.mergeProduct(product);
    }
  }

  // Duplicate SKUs matched and consolidated
  private async mergeProduct(product: NormalizedProduct): Promise<void> {
    const existingProductId = this.skuIndex.get(product.sku);
    
    if (existingProductId) {
      // Update existing product with new supplier variant
      const masterProduct = this.masterCatalog.get(existingProductId);
      if (masterProduct) {
        this.updateSupplierVariant(masterProduct, product);
      }
    } else {
      // Create new master product
      const masterProduct: MasterProduct = {
        id: `master-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        images: product.images,
        suppliers: [{
          supplierId: product.supplierId,
          supplierName: product.supplier,
          price: product.price,
          stock: product.stock,
          lastUpdated: product.lastUpdated,
          isPreferred: true // First supplier is preferred by default
        }],
        primarySupplier: product.supplierId,
        status: product.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.masterCatalog.set(masterProduct.id, masterProduct);
      this.skuIndex.set(product.sku, masterProduct.id);
    }
  }

  private updateSupplierVariant(masterProduct: MasterProduct, product: NormalizedProduct): void {
    const existingVariantIndex = masterProduct.suppliers.findIndex(
      s => s.supplierId === product.supplierId
    );

    const newVariant: SupplierVariant = {
      supplierId: product.supplierId,
      supplierName: product.supplier,
      price: product.price,
      stock: product.stock,
      lastUpdated: product.lastUpdated,
      isPreferred: false
    };

    if (existingVariantIndex >= 0) {
      // Update existing variant
      masterProduct.suppliers[existingVariantIndex] = {
        ...masterProduct.suppliers[existingVariantIndex],
        ...newVariant
      };
    } else {
      // Add new variant
      masterProduct.suppliers.push(newVariant);
    }

    masterProduct.updatedAt = new Date().toISOString();
  }

  // Get unified catalog for inventory and orders
  getAllProducts(): MasterProduct[] {
    return Array.from(this.masterCatalog.values());
  }

  getProductBySku(sku: string): MasterProduct | null {
    const productId = this.skuIndex.get(sku);
    return productId ? this.masterCatalog.get(productId) || null : null;
  }

  getProductById(id: string): MasterProduct | null {
    return this.masterCatalog.get(id) || null;
  }

  // Get products for pricing engine
  getProductsForPricing(): MasterProduct[] {
    return this.getAllProducts().filter(p => p.status === 'active');
  }
}

export const unifiedCatalogService = UnifiedCatalogService.getInstance();