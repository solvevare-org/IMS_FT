// Analytics Service - Insights: stock turnover, stock aging, supplier reliability, profitability
import { inventoryService } from './inventoryService';
import { orderService } from './orderService';
import { pricingEngine } from './pricingEngine';
import { unifiedCatalogService } from './unifiedCatalog';

export interface AnalyticsData {
  stockTurnover: StockTurnoverMetrics;
  stockAging: StockAgingMetrics;
  supplierReliability: SupplierReliabilityMetrics;
  profitability: ProfitabilityMetrics;
  overview: OverviewMetrics;
}

export interface StockTurnoverMetrics {
  averageTurnover: number;
  turnoverByCategory: CategoryTurnover[];
  slowMovingItems: SlowMovingItem[];
  fastMovingItems: FastMovingItem[];
}

export interface StockAgingMetrics {
  ageDistribution: AgeDistribution[];
  averageAge: number;
  oldestItems: AgingItem[];
}

export interface SupplierReliabilityMetrics {
  supplierScores: SupplierScore[];
  averageFillRate: number;
  topPerformers: string[];
  underPerformers: string[];
}

export interface ProfitabilityMetrics {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  profitMargin: number;
  profitByCategory: CategoryProfit[];
  profitBySupplier: SupplierProfit[];
}

export interface OverviewMetrics {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  totalOrders: number;
  activeSuppliers: number;
}

interface CategoryTurnover {
  category: string;
  turnoverRate: number;
  totalValue: number;
}

interface SlowMovingItem {
  sku: string;
  name: string;
  daysInStock: number;
  stockValue: number;
}

interface FastMovingItem {
  sku: string;
  name: string;
  turnoverRate: number;
  stockValue: number;
}

interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
}

interface AgingItem {
  sku: string;
  name: string;
  daysInStock: number;
  stockQuantity: number;
}

interface SupplierScore {
  supplierId: string;
  supplierName: string;
  fillRate: number;
  averageDeliveryTime: number;
  qualityScore: number;
  overallScore: number;
}

interface CategoryProfit {
  category: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

interface SupplierProfit {
  supplierId: string;
  supplierName: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Generate comprehensive analytics
  generateAnalytics(): AnalyticsData {
    return {
      stockTurnover: this.calculateStockTurnover(),
      stockAging: this.calculateStockAging(),
      supplierReliability: this.calculateSupplierReliability(),
      profitability: this.calculateProfitability(),
      overview: this.calculateOverview()
    };
  }

  // Stock turnover analysis
  private calculateStockTurnover(): StockTurnoverMetrics {
    const inventoryItems = inventoryService.getAllItems();
    const turnoverData = inventoryService.getStockTurnoverData();

    const averageTurnover = turnoverData.reduce((sum, item) => sum + item.turnoverRate, 0) / turnoverData.length;

    // Group by category
    const categoryMap = new Map<string, { totalTurnover: number; count: number; totalValue: number }>();
    turnoverData.forEach(item => {
      const existing = categoryMap.get(item.category) || { totalTurnover: 0, count: 0, totalValue: 0 };
      existing.totalTurnover += item.turnoverRate;
      existing.count += 1;
      existing.totalValue += item.currentStock * 25; // Assuming average price of $25
      categoryMap.set(item.category, existing);
    });

    const turnoverByCategory: CategoryTurnover[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      turnoverRate: data.totalTurnover / data.count,
      totalValue: data.totalValue
    }));

    // Identify slow and fast moving items
    const sortedByTurnover = turnoverData.sort((a, b) => a.turnoverRate - b.turnoverRate);
    
    const slowMovingItems: SlowMovingItem[] = sortedByTurnover.slice(0, 10).map(item => ({
      sku: item.sku,
      name: item.productName,
      daysInStock: item.daysInStock,
      stockValue: item.currentStock * 25
    }));

    const fastMovingItems: FastMovingItem[] = sortedByTurnover.slice(-10).reverse().map(item => ({
      sku: item.sku,
      name: item.productName,
      turnoverRate: item.turnoverRate,
      stockValue: item.currentStock * 25
    }));

    return {
      averageTurnover,
      turnoverByCategory,
      slowMovingItems,
      fastMovingItems
    };
  }

  // Stock aging analysis
  private calculateStockAging(): StockAgingMetrics {
    const inventoryItems = inventoryService.getAllItems();
    
    const totalAge = inventoryItems.reduce((sum, item) => sum + item.daysInStock, 0);
    const averageAge = totalAge / inventoryItems.length;

    // Age distribution
    const ageRanges = [
      { min: 0, max: 7, label: '0-7 days' },
      { min: 8, max: 30, label: '8-30 days' },
      { min: 31, max: 60, label: '31-60 days' },
      { min: 61, max: 90, label: '61-90 days' },
      { min: 91, max: Infinity, label: '90+ days' }
    ];

    const ageDistribution: AgeDistribution[] = ageRanges.map(range => {
      const count = inventoryItems.filter(item => 
        item.daysInStock >= range.min && item.daysInStock <= range.max
      ).length;
      
      return {
        ageRange: range.label,
        count,
        percentage: (count / inventoryItems.length) * 100
      };
    });

    // Oldest items
    const oldestItems: AgingItem[] = inventoryItems
      .sort((a, b) => b.daysInStock - a.daysInStock)
      .slice(0, 10)
      .map(item => ({
        sku: item.sku,
        name: item.productName,
        daysInStock: item.daysInStock,
        stockQuantity: item.stockQuantity
      }));

    return {
      ageDistribution,
      averageAge,
      oldestItems
    };
  }

  // Supplier reliability analysis
  private calculateSupplierReliability(): SupplierReliabilityMetrics {
    const masterProducts = unifiedCatalogService.getAllProducts();
    const orders = orderService.getAllOrders();
    
    // Calculate supplier scores
    const supplierMap = new Map<string, {
      totalOrders: number;
      completedOrders: number;
      totalDeliveryTime: number;
      qualityIssues: number;
    }>();

    // Analyze orders for supplier performance
    orders.filter(o => o.type === 'purchase').forEach(order => {
      if (!order.supplierId) return;
      
      const existing = supplierMap.get(order.supplierId) || {
        totalOrders: 0,
        completedOrders: 0,
        totalDeliveryTime: 0,
        qualityIssues: 0
      };
      
      existing.totalOrders += 1;
      if (order.status === 'completed') {
        existing.completedOrders += 1;
        existing.totalDeliveryTime += Math.random() * 10 + 2; // Mock delivery time
      }
      
      supplierMap.set(order.supplierId, existing);
    });

    const supplierScores: SupplierScore[] = Array.from(supplierMap.entries()).map(([supplierId, data]) => {
      const supplier = masterProducts.find(p => p.suppliers.some(s => s.supplierId === supplierId))?.suppliers.find(s => s.supplierId === supplierId);
      const fillRate = data.totalOrders > 0 ? (data.completedOrders / data.totalOrders) * 100 : 0;
      const averageDeliveryTime = data.completedOrders > 0 ? data.totalDeliveryTime / data.completedOrders : 0;
      const qualityScore = Math.max(0, 100 - (data.qualityIssues * 10));
      const overallScore = (fillRate + qualityScore + Math.max(0, 100 - averageDeliveryTime * 5)) / 3;

      return {
        supplierId,
        supplierName: supplier?.supplierName || 'Unknown',
        fillRate,
        averageDeliveryTime,
        qualityScore,
        overallScore
      };
    });

    const averageFillRate = supplierScores.reduce((sum, s) => sum + s.fillRate, 0) / supplierScores.length;
    const topPerformers = supplierScores.filter(s => s.overallScore >= 85).map(s => s.supplierName);
    const underPerformers = supplierScores.filter(s => s.overallScore < 70).map(s => s.supplierName);

    return {
      supplierScores,
      averageFillRate,
      topPerformers,
      underPerformers
    };
  }

  // Profitability analysis
  private calculateProfitability(): ProfitabilityMetrics {
    const pricedProducts = pricingEngine.calculatePrices();
    const orders = orderService.getAllOrders();
    const inventoryItems = inventoryService.getAllItems();

    // Calculate totals from sales orders
    const salesOrders = orders.filter(o => o.type === 'sales' && o.status === 'completed');
    const purchaseOrders = orders.filter(o => o.type === 'purchase' && o.status === 'completed');

    const totalRevenue = salesOrders.reduce((sum, order) => sum + order.totalValue, 0);
    const totalCosts = purchaseOrders.reduce((sum, order) => sum + order.totalValue, 0);
    const totalProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Profit by category
    const categoryMap = new Map<string, { revenue: number; costs: number }>();
    
    salesOrders.forEach(order => {
      order.items.forEach(item => {
        const product = pricedProducts.find(p => p.sku === item.sku);
        if (product) {
          const existing = categoryMap.get(product.name) || { revenue: 0, costs: 0 };
          existing.revenue += item.totalPrice;
          existing.costs += product.basePrice * item.quantity;
          categoryMap.set(product.name, existing);
        }
      });
    });

    const profitByCategory: CategoryProfit[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      costs: data.costs,
      profit: data.revenue - data.costs,
      margin: data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0
    }));

    // Profit by supplier (simplified)
    const profitBySupplier: SupplierProfit[] = [];

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      profitMargin,
      profitByCategory,
      profitBySupplier
    };
  }

  // Overview metrics
  private calculateOverview(): OverviewMetrics {
    const inventoryItems = inventoryService.getAllItems();
    const orders = orderService.getAllOrders();
    const masterProducts = unifiedCatalogService.getAllProducts();

    const totalProducts = masterProducts.length;
    const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.stockQuantity * 25), 0); // Assuming avg price
    const lowStockItems = inventoryService.getLowStockItems().length;
    const totalOrders = orders.length;
    const activeSuppliers = new Set(masterProducts.flatMap(p => p.suppliers.map(s => s.supplierId))).size;

    return {
      totalProducts,
      totalInventoryValue,
      lowStockItems,
      totalOrders,
      activeSuppliers
    };
  }

  // Export analytics data
  exportAnalytics(format: 'csv' | 'pdf' | 'json'): string {
    const analytics = this.generateAnalytics();
    
    switch (format) {
      case 'json':
        return JSON.stringify(analytics, null, 2);
      case 'csv':
        return this.convertToCSV(analytics);
      case 'pdf':
        return this.generatePDFReport(analytics);
      default:
        throw new Error('Unsupported export format');
    }
  }

  private convertToCSV(analytics: AnalyticsData): string {
    // Simplified CSV export - in real implementation, would be more comprehensive
    let csv = 'Metric,Value\n';
    csv += `Total Products,${analytics.overview.totalProducts}\n`;
    csv += `Total Inventory Value,${analytics.overview.totalInventoryValue}\n`;
    csv += `Low Stock Items,${analytics.overview.lowStockItems}\n`;
    csv += `Average Stock Age,${analytics.stockAging.averageAge}\n`;
    csv += `Average Fill Rate,${analytics.supplierReliability.averageFillRate}\n`;
    csv += `Total Revenue,${analytics.profitability.totalRevenue}\n`;
    csv += `Total Profit,${analytics.profitability.totalProfit}\n`;
    csv += `Profit Margin,${analytics.profitability.profitMargin}%\n`;
    
    return csv;
  }

  private generatePDFReport(analytics: AnalyticsData): string {
    // In real implementation, would generate actual PDF
    return `PDF Report Generated - Analytics Summary:
    Total Products: ${analytics.overview.totalProducts}
    Inventory Value: $${analytics.overview.totalInventoryValue.toLocaleString()}
    Profit Margin: ${analytics.profitability.profitMargin.toFixed(2)}%`;
  }
}

export const analyticsService = AnalyticsService.getInstance();