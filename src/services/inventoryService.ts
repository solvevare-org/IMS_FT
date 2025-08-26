// Inventory Service - Tracks stock across suppliers & warehouses
import { unifiedCatalogService, MasterProduct } from './unifiedCatalog';

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  masterProductId: string;
  stockQuantity: number;
  allocated: number;
  available: number;
  reorderLevel: number;
  warehouse: string;
  category: string;
  lastUpdated: string;
  daysInStock: number;
  supplierBreakdown: SupplierStock[];
}

export interface SupplierStock {
  supplierId: string;
  supplierName: string;
  stock: number;
  price: number;
  lastSync: string;
}

export interface StockAdjustment {
  itemId: string;
  quantity: number;
  reason: string;
  type: 'increase' | 'decrease';
  timestamp: string;
  userId: string;
}

class InventoryService {
  private static instance: InventoryService;
  private inventory: Map<string, InventoryItem> = new Map();
  private adjustmentHistory: StockAdjustment[] = [];

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  // Inventory tracks stock across suppliers & warehouses
  syncWithUnifiedCatalog(): void {
    const masterProducts = unifiedCatalogService.getAllProducts();
    
    for (const product of masterProducts) {
      this.updateInventoryFromMasterProduct(product);
    }
  }

  private updateInventoryFromMasterProduct(product: MasterProduct): void {
    const existingItem = this.getItemBySku(product.sku);
    
    // Calculate total stock across all suppliers
    const totalStock = product.suppliers.reduce((sum, supplier) => sum + supplier.stock, 0);
    
    // Create supplier breakdown
    const supplierBreakdown: SupplierStock[] = product.suppliers.map(supplier => ({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      stock: supplier.stock,
      price: supplier.price,
      lastSync: supplier.lastUpdated
    }));

    if (existingItem) {
      // Update existing inventory item
      existingItem.stockQuantity = totalStock;
      existingItem.available = totalStock - existingItem.allocated;
      existingItem.supplierBreakdown = supplierBreakdown;
      existingItem.lastUpdated = new Date().toISOString();
    } else {
      // Create new inventory item
      const newItem: InventoryItem = {
        id: `inv-${product.id}`,
        sku: product.sku,
        productName: product.name,
        masterProductId: product.id,
        stockQuantity: totalStock,
        allocated: 0,
        available: totalStock,
        reorderLevel: Math.max(10, Math.floor(totalStock * 0.2)), // 20% of current stock or minimum 10
        warehouse: 'Main Warehouse', // Default warehouse
        category: product.category,
        lastUpdated: new Date().toISOString(),
        daysInStock: 0, // Will be calculated based on creation date
        supplierBreakdown
      };

      this.inventory.set(newItem.id, newItem);
    }
  }

  // Stock adjustment functionality
  adjustStock(adjustment: Omit<StockAdjustment, 'timestamp' | 'userId'>): void {
    const item = this.inventory.get(adjustment.itemId);
    if (!item) throw new Error('Inventory item not found');

    const fullAdjustment: StockAdjustment = {
      ...adjustment,
      timestamp: new Date().toISOString(),
      userId: 'current-user' // In real app, get from auth context
    };

    // Apply adjustment
    item.stockQuantity += adjustment.quantity;
    item.available += adjustment.quantity;
    item.lastUpdated = new Date().toISOString();

    // Record adjustment
    this.adjustmentHistory.push(fullAdjustment);
  }

  // Get inventory data
  getAllItems(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  getItemBySku(sku: string): InventoryItem | null {
    return Array.from(this.inventory.values()).find(item => item.sku === sku) || null;
  }

  getLowStockItems(): InventoryItem[] {
    return this.getAllItems().filter(item => item.available <= item.reorderLevel);
  }

  getStockByWarehouse(warehouse: string): InventoryItem[] {
    return this.getAllItems().filter(item => item.warehouse === warehouse);
  }

  // Analytics support
  getStockTurnoverData(): any[] {
    // Calculate stock turnover metrics for analytics
    return this.getAllItems().map(item => ({
      sku: item.sku,
      productName: item.productName,
      category: item.category,
      currentStock: item.stockQuantity,
      daysInStock: item.daysInStock,
      turnoverRate: item.daysInStock > 0 ? 365 / item.daysInStock : 0
    }));
  }
}

export const inventoryService = InventoryService.getInstance();