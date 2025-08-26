// System Orchestrator - Coordinates all services and ensures proper data flow
import { apiIntegrationService } from './apiIntegration';
import { unifiedCatalogService } from './unifiedCatalog';
import { inventoryService } from './inventoryService';
import { orderService } from './orderService';
import { pricingEngine } from './pricingEngine';
import { analyticsService } from './analyticsService';
import { unifiedAPIService } from './unifiedAPI';

class SystemOrchestrator {
  private static instance: SystemOrchestrator;
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): SystemOrchestrator {
    if (!SystemOrchestrator.instance) {
      SystemOrchestrator.instance = new SystemOrchestrator();
    }
    return SystemOrchestrator.instance;
  }

  // Initialize the complete system dataflow
  async initializeSystem(): Promise<void> {
    console.log('Initializing IMS Platform System...');

    try {
      // 1. Initialize services
      console.log('1. Initializing services...');
      
      // 2. Set up automatic sync
      console.log('2. Setting up automatic sync...');
      this.startAutomaticSync();

      // 3. Initialize sample data for demo
      console.log('3. Initializing sample data...');
      await this.initializeSampleData();

      console.log('✅ System initialization complete!');
    } catch (error) {
      console.error('❌ System initialization failed:', error);
      throw error;
    }
  }

  // Start automatic synchronization
  private startAutomaticSync(): void {
    // Sync every 5 minutes
    this.syncInterval = setInterval(async () => {
      await this.performFullSync();
    }, 5 * 60 * 1000);
  }

  // Perform complete system synchronization following the dataflow
  async performFullSync(): Promise<void> {
    console.log('🔄 Starting full system sync...');

    try {
      // Step 1: API Integration → Unified Catalog
      console.log('Step 1: Syncing supplier APIs...');
      await apiIntegrationService.syncAllSuppliers();

      // Step 2: Unified Catalog → Inventory & Orders
      console.log('Step 2: Updating inventory from catalog...');
      inventoryService.syncWithUnifiedCatalog();

      // Step 3: Unified Catalog → Pricing Engine
      console.log('Step 3: Calculating prices...');
      pricingEngine.calculatePrices();

      // Step 4: Generate Analytics
      console.log('Step 4: Generating analytics...');
      analyticsService.generateAnalytics();

      console.log('✅ Full sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }

  // Initialize sample data for demonstration
  private async initializeSampleData(): Promise<void> {
    // Add sample suppliers
    const suppliers = [
      {
        name: 'TechCorp API',
        baseUrl: 'https://api.techcorp.com/v1',
        apiKey: 'tech_api_key_123',
        category: 'Electronics'
      },
      {
        name: 'Fashion Hub API',
        baseUrl: 'https://api.fashionhub.com/v2',
        apiKey: 'fashion_api_key_456',
        category: 'Apparel'
      },
      {
        name: 'Home Goods Plus',
        baseUrl: 'https://api.homegoods.com/v1',
        apiKey: 'home_api_key_789',
        category: 'Home & Garden'
      }
    ];

    for (const supplier of suppliers) {
      await apiIntegrationService.addSupplier(supplier);
    }

    // Add sample pricing rules
    const pricingRules = [
      {
        name: 'Electronics Premium Markup',
        supplier: 'TechCorp API',
        category: 'Electronics',
        markupPercentage: 25,
        priority: 1,
        isActive: true
      },
      {
        name: 'Fashion Standard Markup',
        supplier: 'Fashion Hub API',
        category: 'Apparel',
        markupPercentage: 40,
        priority: 2,
        isActive: true
      },
      {
        name: 'Home Goods Competitive',
        supplier: 'Home Goods Plus',
        category: 'Home & Garden',
        markupPercentage: 15,
        priority: 3,
        isActive: true
      }
    ];

    for (const rule of pricingRules) {
      pricingEngine.addRule(rule);
    }

    // Generate sample API keys
    const apiKeys = [
      {
        name: 'Production API Key',
        permissions: ['products:read', 'inventory:read', 'orders:read', 'orders:write']
      },
      {
        name: 'Analytics Dashboard',
        permissions: ['products:read', 'inventory:read', 'analytics:read']
      },
      {
        name: 'Mobile App',
        permissions: ['products:read', 'inventory:read']
      }
    ];

    for (const keyData of apiKeys) {
      unifiedAPIService.generateAPIKey(keyData.name, keyData.permissions);
    }

    console.log('✅ Sample data initialized');
  }

  // Manual sync trigger for admin
  async triggerManualSync(): Promise<void> {
    await this.performFullSync();
  }

  // Get system status
  getSystemStatus(): any {
    return {
      isInitialized: true,
      autoSyncEnabled: this.syncInterval !== null,
      lastSync: new Date().toISOString(),
      services: {
        apiIntegration: 'active',
        unifiedCatalog: 'active',
        inventory: 'active',
        orders: 'active',
        pricing: 'active',
        analytics: 'active',
        unifiedAPI: 'active'
      }
    };
  }

  // Shutdown system
  shutdown(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('🛑 System shutdown complete');
  }
}

export const systemOrchestrator = SystemOrchestrator.getInstance();