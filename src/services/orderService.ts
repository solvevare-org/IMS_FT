// Order Service - Manages purchase orders (to suppliers) + sales orders (from clients)
import { unifiedCatalogService } from './unifiedCatalog';
import { inventoryService } from './inventoryService';

export interface Order {
  id: string;
  type: 'purchase' | 'sales';
  supplierId?: string;
  customerId?: string;
  supplierName?: string;
  customerName?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  totalValue: number;
  items: OrderItem[];
  notes?: string;
  createdBy: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId?: string; // For purchase orders
}

class OrderService {
  private static instance: OrderService;
  private orders: Map<string, Order> = new Map();

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  // Create purchase order (to suppliers)
  createPurchaseOrder(orderData: {
    supplierId: string;
    supplierName: string;
    items: Omit<OrderItem, 'id' | 'totalPrice'>[];
    notes?: string;
  }): Order {
    const items: OrderItem[] = orderData.items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalPrice: item.quantity * item.unitPrice,
      supplierId: orderData.supplierId
    }));

    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const order: Order = {
      id: `PO-${String(this.orders.size + 1).padStart(3, '0')}`,
      type: 'purchase',
      supplierId: orderData.supplierId,
      supplierName: orderData.supplierName,
      status: 'pending',
      date: new Date().toISOString(),
      totalValue,
      items,
      notes: orderData.notes,
      createdBy: 'current-user',
      updatedAt: new Date().toISOString()
    };

    this.orders.set(order.id, order);
    return order;
  }

  // Create sales order (from clients)
  createSalesOrder(orderData: {
    customerId: string;
    customerName: string;
    items: Omit<OrderItem, 'id' | 'totalPrice' | 'supplierId'>[];
    notes?: string;
  }): Order {
    const items: OrderItem[] = orderData.items.map(item => {
      // Get best supplier for this item
      const product = unifiedCatalogService.getProductBySku(item.sku);
      const bestSupplier = product?.suppliers.find(s => s.isPreferred) || product?.suppliers[0];

      return {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        totalPrice: item.quantity * item.unitPrice,
        supplierId: bestSupplier?.supplierId
      };
    });

    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const order: Order = {
      id: `SO-${String(this.orders.size + 1).padStart(3, '0')}`,
      type: 'sales',
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      status: 'pending',
      date: new Date().toISOString(),
      totalValue,
      items,
      notes: orderData.notes,
      createdBy: 'current-user',
      updatedAt: new Date().toISOString()
    };

    this.orders.set(order.id, order);

    // Reserve inventory for sales orders
    this.reserveInventory(order);

    return order;
  }

  private reserveInventory(order: Order): void {
    if (order.type !== 'sales') return;

    for (const item of order.items) {
      const inventoryItem = inventoryService.getItemBySku(item.sku);
      if (inventoryItem) {
        inventoryItem.allocated += item.quantity;
        inventoryItem.available -= item.quantity;
      }
    }
  }

  // Update order status
  updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Handle inventory updates based on status changes
    if (order.type === 'purchase' && status === 'completed') {
      // Add received inventory
      this.processReceivedInventory(order);
    } else if (order.type === 'sales' && status === 'completed') {
      // Remove allocated inventory
      this.processShippedInventory(order);
    } else if (order.type === 'sales' && status === 'cancelled' && previousStatus !== 'cancelled') {
      // Release reserved inventory
      this.releaseReservedInventory(order);
    }
  }

  private processReceivedInventory(order: Order): void {
    for (const item of order.items) {
      inventoryService.adjustStock({
        itemId: inventoryService.getItemBySku(item.sku)?.id || '',
        quantity: item.quantity,
        reason: `Purchase order ${order.id} received`,
        type: 'increase'
      });
    }
  }

  private processShippedInventory(order: Order): void {
    for (const item of order.items) {
      const inventoryItem = inventoryService.getItemBySku(item.sku);
      if (inventoryItem) {
        // Remove from allocated (already reserved)
        inventoryItem.allocated -= item.quantity;
        inventoryItem.stockQuantity -= item.quantity;
      }
    }
  }

  private releaseReservedInventory(order: Order): void {
    for (const item of order.items) {
      const inventoryItem = inventoryService.getItemBySku(item.sku);
      if (inventoryItem) {
        inventoryItem.allocated -= item.quantity;
        inventoryItem.available += item.quantity;
      }
    }
  }

  // Get orders
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrdersByType(type: 'purchase' | 'sales'): Order[] {
    return this.getAllOrders().filter(order => order.type === type);
  }

  getOrderById(id: string): Order | null {
    return this.orders.get(id) || null;
  }

  // Analytics support
  getOrderAnalytics(): any {
    const orders = this.getAllOrders();
    const purchaseOrders = orders.filter(o => o.type === 'purchase');
    const salesOrders = orders.filter(o => o.type === 'sales');

    return {
      totalOrders: orders.length,
      purchaseOrders: purchaseOrders.length,
      salesOrders: salesOrders.length,
      totalPurchaseValue: purchaseOrders.reduce((sum, o) => sum + o.totalValue, 0),
      totalSalesValue: salesOrders.reduce((sum, o) => sum + o.totalValue, 0),
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    };
  }
}

export const orderService = OrderService.getInstance();