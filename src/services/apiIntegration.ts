// API Integration Module - Handles supplier API connections and data fetching
export interface SupplierAPI {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  category: string;
  status: 'active' | 'error' | 'pending';
  lastSync: string;
}

export interface RawSupplierProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  images?: string[];
  supplierId: string;
}

export interface NormalizedProduct {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  supplierId: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
  images?: string[];
  lastUpdated: string;
  rawData: any; // Original supplier data
}

class APIIntegrationService {
  private suppliers: Map<string, SupplierAPI> = new Map();

  // Admin enters supplier API credentials
  async addSupplier(supplier: Omit<SupplierAPI, 'id' | 'status' | 'lastSync'>): Promise<SupplierAPI> {
    const newSupplier: SupplierAPI = {
      ...supplier,
      id: Date.now().toString(),
      status: 'pending',
      lastSync: 'Never'
    };

    // Test API connection
    try {
      await this.testConnection(newSupplier);
      newSupplier.status = 'active';
    } catch (error) {
      newSupplier.status = 'error';
    }

    this.suppliers.set(newSupplier.id, newSupplier);
    return newSupplier;
  }

  // System fetches product, stock, pricing data
  async fetchSupplierData(supplierId: string): Promise<RawSupplierProduct[]> {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) throw new Error('Supplier not found');

    try {
      const response = await fetch(`${supplier.baseUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${supplier.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update last sync time
      supplier.lastSync = new Date().toISOString();
      supplier.status = 'active';
      
      return data.products || data;
    } catch (error) {
      supplier.status = 'error';
      throw error;
    }
  }

  // Data normalized into a standard schema
  normalizeProductData(rawProducts: RawSupplierProduct[], supplier: SupplierAPI): NormalizedProduct[] {
    return rawProducts.map(product => ({
      id: `${supplier.id}-${product.id}`,
      sku: product.sku,
      name: product.name,
      supplier: supplier.name,
      supplierId: supplier.id,
      category: product.category || supplier.category,
      price: product.price,
      stock: product.stock,
      status: product.stock > 0 ? 'active' : 'inactive',
      description: product.description,
      images: product.images,
      lastUpdated: new Date().toISOString(),
      rawData: product
    }));
  }

  private async testConnection(supplier: SupplierAPI): Promise<boolean> {
    const response = await fetch(`${supplier.baseUrl}/health`, {
      headers: {
        'Authorization': `Bearer ${supplier.apiKey}`
      }
    });
    return response.ok;
  }

  async syncAllSuppliers(): Promise<void> {
    const syncPromises = Array.from(this.suppliers.values()).map(async (supplier) => {
      try {
        const rawData = await this.fetchSupplierData(supplier.id);
        const normalizedData = this.normalizeProductData(rawData, supplier);
        
        // Send to unified catalog
        await UnifiedCatalogService.getInstance().updateSupplierProducts(supplier.id, normalizedData);
      } catch (error) {
        console.error(`Failed to sync supplier ${supplier.name}:`, error);
      }
    });

    await Promise.all(syncPromises);
  }
}

export const apiIntegrationService = new APIIntegrationService();