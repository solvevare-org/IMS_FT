import React, { useState } from 'react';
import { X, Tag, Users, Package, Percent } from 'lucide-react';

interface PricingRule {
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

interface EditRuleModalProps {
  rule: PricingRule;
  onClose: () => void;
  onSubmit: (rule: PricingRule) => void;
}

const mockSuppliers = [
  'TechCorp API',
  'Fashion Hub API',
  'Home Goods Plus',
  'Sports Equipment Co'
];

const mockCategories = [
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Sports',
  'Books',
  'Health & Beauty',
  'Automotive'
];

export default function EditRuleModal({ rule, onClose, onSubmit }: EditRuleModalProps) {
  const [formData, setFormData] = useState({
    name: rule.name,
    supplier: rule.supplier,
    category: rule.category,
    productSku: rule.productSku || '',
    markupPercentage: rule.markupPercentage,
    priority: rule.priority,
    isActive: rule.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...rule,
      ...formData,
      productSku: formData.productSku || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Pricing Rule</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Rule Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Supplier
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {mockSuppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {mockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Specific Product SKU (Optional)
              </label>
              <input
                type="text"
                value={formData.productSku}
                onChange={(e) => setFormData(prev => ({ ...prev, productSku: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., WH-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-2" />
                Markup Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  value={formData.markupPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, markupPercentage: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Rule is active
              </label>
            </div>

            {/* Rule Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Rule Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Created: {new Date(rule.createdDate).toLocaleDateString()}</p>
                <p>Last Modified: {new Date(rule.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Update Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}