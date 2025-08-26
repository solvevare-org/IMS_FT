// Pricing Engine - Applies pricing rules: markup, supplier preference, overrides
import { unifiedCatalogService, MasterProduct } from './unifiedCatalog';

export interface PricingRule {
  id: string;
  name: string;
  supplier: string;
  category: string;
  productSku?: string;
  markupPercentage: number;
  priority: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export interface PricedProduct {
  masterProductId: string;
  sku: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  appliedRules: AppliedRule[];
  preferredSupplier: string;
  margin: number;
  marginPercentage: number;
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  markupPercentage: number;
  priority: number;
}

class PricingEngine {
  private static instance: PricingEngine;
  private rules: Map<string, PricingRule> = new Map();

  static getInstance(): PricingEngine {
    if (!PricingEngine.instance) {
      PricingEngine.instance = new PricingEngine();
    }
    return PricingEngine.instance;
  }

  // Pricing rules applied: markup, supplier preference, overrides
  addRule(rule: Omit<PricingRule, 'id' | 'createdDate' | 'lastModified'>): PricingRule {
    const newRule: PricingRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    this.rules.set(newRule.id, newRule);
    return newRule;
  }

  updateRule(ruleId: string, updates: Partial<PricingRule>): void {
    const rule = this.rules.get(ruleId);
    if (!rule) throw new Error('Pricing rule not found');

    Object.assign(rule, updates, {
      lastModified: new Date().toISOString()
    });
  }

  deleteRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  // Calculate prices for all products
  calculatePrices(): PricedProduct[] {
    const masterProducts = unifiedCatalogService.getProductsForPricing();
    return masterProducts.map(product => this.calculateProductPrice(product));
  }

  calculateProductPrice(product: MasterProduct): PricedProduct {
    // Find preferred supplier or use first available
    const preferredSupplier = product.suppliers.find(s => s.isPreferred) || product.suppliers[0];
    if (!preferredSupplier) {
      throw new Error(`No suppliers available for product ${product.sku}`);
    }

    const basePrice = preferredSupplier.price;
    
    // Find applicable rules
    const applicableRules = this.findApplicableRules(product, preferredSupplier.supplierName);
    
    // Apply rules in priority order
    let finalPrice = basePrice;
    const appliedRules: AppliedRule[] = [];

    for (const rule of applicableRules) {
      const markup = (finalPrice * rule.markupPercentage) / 100;
      finalPrice += markup;
      
      appliedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        markupPercentage: rule.markupPercentage,
        priority: rule.priority
      });
    }

    const margin = finalPrice - basePrice;
    const marginPercentage = basePrice > 0 ? (margin / basePrice) * 100 : 0;

    return {
      masterProductId: product.id,
      sku: product.sku,
      name: product.name,
      basePrice,
      finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      appliedRules,
      preferredSupplier: preferredSupplier.supplierName,
      margin,
      marginPercentage
    };
  }

  private findApplicableRules(product: MasterProduct, supplierName: string): PricingRule[] {
    const rules = Array.from(this.rules.values())
      .filter(rule => rule.isActive)
      .filter(rule => {
        // Check supplier match
        if (rule.supplier !== supplierName) return false;
        
        // Check category match
        if (rule.category !== product.category) return false;
        
        // Check specific SKU match (if specified)
        if (rule.productSku && rule.productSku !== product.sku) return false;
        
        return true;
      })
      .sort((a, b) => a.priority - b.priority); // Sort by priority (lower number = higher priority)

    return rules;
  }

  // Get pricing rules
  getAllRules(): PricingRule[] {
    return Array.from(this.rules.values());
  }

  getRuleById(id: string): PricingRule | null {
    return this.rules.get(id) || null;
  }

  // Analytics support
  getPricingAnalytics(): any {
    const pricedProducts = this.calculatePrices();
    
    return {
      totalProducts: pricedProducts.length,
      averageMargin: pricedProducts.reduce((sum, p) => sum + p.marginPercentage, 0) / pricedProducts.length,
      totalMarginValue: pricedProducts.reduce((sum, p) => sum + p.margin, 0),
      rulesApplied: this.getAllRules().filter(r => r.isActive).length,
      priceDistribution: this.calculatePriceDistribution(pricedProducts)
    };
  }

  private calculatePriceDistribution(products: PricedProduct[]): any {
    const ranges = [
      { min: 0, max: 25, count: 0 },
      { min: 25, max: 50, count: 0 },
      { min: 50, max: 100, count: 0 },
      { min: 100, max: 250, count: 0 },
      { min: 250, max: Infinity, count: 0 }
    ];

    products.forEach(product => {
      const range = ranges.find(r => product.finalPrice >= r.min && product.finalPrice < r.max);
      if (range) range.count++;
    });

    return ranges;
  }
}

export const pricingEngine = PricingEngine.getInstance();