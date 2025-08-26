// Unified API Layer - Provides a single endpoint for clients
import { unifiedCatalogService } from './unifiedCatalog';
import { inventoryService } from './inventoryService';
import { orderService } from './orderService';
import { pricingEngine } from './pricingEngine';
import { analyticsService } from './analyticsService';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  createdDate: string;
  lastUsed: string;
}

class UnifiedAPIService {
  private static instance: UnifiedAPIService;
  private apiKeys: Map<string, APIKey> = new Map();

  static getInstance(): UnifiedAPIService {
    if (!UnifiedAPIService.instance) {
      UnifiedAPIService.instance = new UnifiedAPIService();
    }
    return UnifiedAPIService.instance;
  }

  // API Key management
  generateAPIKey(name: string, permissions: string[]): APIKey {
    const apiKey: APIKey = {
      id: Date.now().toString(),
      name,
      key: `sk_live_${this.generateRandomKey()}`,
      permissions,
      isActive: true,
      createdDate: new Date().toISOString(),
      lastUsed: 'Never'
    };

    this.apiKeys.set(apiKey.key, apiKey);
    return apiKey;
  }

  private generateRandomKey(): string {
    return Array.from({ length: 32 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('');
  }

  validateAPIKey(key: string): APIKey | null {
    const apiKey = this.apiKeys.get(key);
    if (apiKey && apiKey.isActive) {
      apiKey.lastUsed = new Date().toISOString();
      return apiKey;
    }
    return null;
  }

  // Unified API Endpoints - Returns normalized data (products, stock, prices)

  // GET /api/v1/products
  async getProducts(params: {
    limit?: number;
    offset?: number;
    supplier?: string;
    category?: string;
    apiKey: string;
  }): Promise<APIResponse<any[]>> {
    const apiKey = this.validateAPIKey(params.apiKey);
    if (!apiKey || !apiKey.permissions.includes('products:read')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      let products = unifiedCatalogService.getAllProducts();
      
      // Apply filters
      if (params.supplier) {
        products = products.filter(p => 
          p.suppliers.some(s => s.supplierName.toLowerCase().includes(params.supplier!.toLowerCase()))
        );
      }
      
      if (params.category) {
        products = products.filter(p => p.category === params.category);
      }

      // Apply pagination
      const limit = params.limit || 50;
      const offset = params.offset || 0;
      const paginatedProducts = products.slice(offset, offset + limit);

      // Get pricing for products
      const pricedProducts = pricingEngine.calculatePrices();
      
      // Combine product data with pricing and inventory
      const enrichedProducts = paginatedProducts.map(product => {
        const pricing = pricedProducts.find(p => p.masterProductId === product.id);
        const inventory = inventoryService.getItemBySku(product.sku);
        
        return {
          id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          description: product.description,
          images: product.images,
          price: pricing?.finalPrice || 0,
          basePrice: pricing?.basePrice || 0,
          margin: pricing?.marginPercentage || 0,
          stock: inventory?.available || 0,
          totalStock: inventory?.stockQuantity || 0,
          allocated: inventory?.allocated || 0,
          reorderLevel: inventory?.reorderLevel || 0,
          suppliers: product.suppliers.map(s => ({
            id: s.supplierId,
            name: s.supplierName,
            price: s.price,
            stock: s.stock,
            isPreferred: s.isPreferred
          })),
          status: product.status,
          lastUpdated: product.updatedAt
        };
      });

      return {
        success: true,
        data: enrichedProducts,
        pagination: {
          total: products.length,
          limit,
          offset
        }
      };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // GET /api/v1/products/{id}
  async getProduct(id: string, apiKey: string): Promise<APIResponse<any>> {
    const key = this.validateAPIKey(apiKey);
    if (!key || !key.permissions.includes('products:read')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const product = unifiedCatalogService.getProductById(id) || unifiedCatalogService.getProductBySku(id);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const pricing = pricingEngine.calculateProductPrice(product);
      const inventory = inventoryService.getItemBySku(product.sku);

      const enrichedProduct = {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        images: product.images,
        price: pricing.finalPrice,
        basePrice: pricing.basePrice,
        margin: pricing.marginPercentage,
        appliedPricingRules: pricing.appliedRules,
        stock: inventory?.available || 0,
        totalStock: inventory?.stockQuantity || 0,
        allocated: inventory?.allocated || 0,
        reorderLevel: inventory?.reorderLevel || 0,
        warehouse: inventory?.warehouse,
        daysInStock: inventory?.daysInStock || 0,
        suppliers: product.suppliers.map(s => ({
          id: s.supplierId,
          name: s.supplierName,
          price: s.price,
          stock: s.stock,
          isPreferred: s.isPreferred,
          lastUpdated: s.lastUpdated
        })),
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };

      return { success: true, data: enrichedProduct };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // GET /api/v1/inventory
  async getInventory(params: {
    warehouse?: string;
    lowStock?: boolean;
    apiKey: string;
  }): Promise<APIResponse<any[]>> {
    const apiKey = this.validateAPIKey(params.apiKey);
    if (!apiKey || !apiKey.permissions.includes('inventory:read')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      let inventory = inventoryService.getAllItems();
      
      if (params.warehouse) {
        inventory = inventoryService.getStockByWarehouse(params.warehouse);
      }
      
      if (params.lowStock) {
        inventory = inventoryService.getLowStockItems();
      }

      const inventoryData = inventory.map(item => ({
        sku: item.sku,
        productName: item.productName,
        stockQuantity: item.stockQuantity,
        allocated: item.allocated,
        available: item.available,
        reorderLevel: item.reorderLevel,
        warehouse: item.warehouse,
        category: item.category,
        daysInStock: item.daysInStock,
        supplierBreakdown: item.supplierBreakdown,
        lastUpdated: item.lastUpdated
      }));

      return { success: true, data: inventoryData };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // PUT /api/v1/inventory/{sku}
  async updateInventory(sku: string, updates: {
    quantity?: number;
    reason?: string;
    type?: 'increase' | 'decrease';
  }, apiKey: string): Promise<APIResponse<any>> {
    const key = this.validateAPIKey(apiKey);
    if (!key || !key.permissions.includes('inventory:write')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const item = inventoryService.getItemBySku(sku);
      if (!item) {
        return { success: false, error: 'Inventory item not found' };
      }

      if (updates.quantity !== undefined) {
        const adjustmentQuantity = updates.type === 'decrease' ? -Math.abs(updates.quantity) : Math.abs(updates.quantity);
        
        inventoryService.adjustStock({
          itemId: item.id,
          quantity: adjustmentQuantity,
          reason: updates.reason || 'API adjustment',
          type: updates.type || 'increase'
        });
      }

      const updatedItem = inventoryService.getItemBySku(sku);
      
      return {
        success: true,
        data: {
          sku: updatedItem!.sku,
          previousStock: item.stockQuantity,
          newStock: updatedItem!.stockQuantity,
          adjustment: updates.quantity,
          updatedAt: updatedItem!.lastUpdated
        }
      };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // GET /api/v1/orders
  async getOrders(params: {
    type?: 'purchase' | 'sales';
    status?: string;
    apiKey: string;
  }): Promise<APIResponse<any[]>> {
    const apiKey = this.validateAPIKey(params.apiKey);
    if (!apiKey || !apiKey.permissions.includes('orders:read')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      let orders = orderService.getAllOrders();
      
      if (params.type) {
        orders = orderService.getOrdersByType(params.type);
      }
      
      if (params.status) {
        orders = orders.filter(o => o.status === params.status);
      }

      const orderData = orders.map(order => ({
        id: order.id,
        type: order.type,
        supplier: order.supplierName,
        customer: order.customerName,
        status: order.status,
        date: order.date,
        totalValue: order.totalValue,
        itemCount: order.items.length,
        items: order.items.map(item => ({
          sku: item.sku,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        notes: order.notes,
        createdBy: order.createdBy,
        updatedAt: order.updatedAt
      }));

      return { success: true, data: orderData };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // POST /api/v1/orders
  async createOrder(orderData: any, apiKey: string): Promise<APIResponse<any>> {
    const key = this.validateAPIKey(apiKey);
    if (!key || !key.permissions.includes('orders:write')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      let order;
      
      if (orderData.type === 'purchase') {
        order = orderService.createPurchaseOrder({
          supplierId: orderData.supplierId,
          supplierName: orderData.supplierName,
          items: orderData.items,
          notes: orderData.notes
        });
      } else if (orderData.type === 'sales') {
        order = orderService.createSalesOrder({
          customerId: orderData.customerId,
          customerName: orderData.customerName,
          items: orderData.items,
          notes: orderData.notes
        });
      } else {
        return { success: false, error: 'Invalid order type' };
      }

      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // GET /api/v1/analytics
  async getAnalytics(apiKey: string): Promise<APIResponse<any>> {
    const key = this.validateAPIKey(apiKey);
    if (!key || !key.permissions.includes('analytics:read')) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const analytics = analyticsService.generateAnalytics();
      return { success: true, data: analytics };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  // Get all API keys (for admin)
  getAllAPIKeys(): APIKey[] {
    return Array.from(this.apiKeys.values());
  }

  revokeAPIKey(keyId: string): void {
    const apiKey = Array.from(this.apiKeys.values()).find(k => k.id === keyId);
    if (apiKey) {
      apiKey.isActive = false;
    }
  }
}

export const unifiedAPIService = UnifiedAPIService.getInstance();