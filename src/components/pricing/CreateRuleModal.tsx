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

interface CreateRuleModalProps {
  onClose: () => void;
  onSubmit: (rule: Omit<PricingRule, 'id' | 'createdDate' | 'lastModified'>) => void;
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

export default function CreateRuleModal({ onClose, onSubmit }: CreateRuleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    category: '',
    productSku: '',
    markupPercentage: 0,
    priority: 1,
    isActive: true
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      productSku: formData.productSku || undefined
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Pricing Rule</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Conditions</span>
            <span>Settings</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
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
                    placeholder="e.g., Electronics Premium Markup"
                    required
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
                      value={formData.markupPercentage || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, markupPercentage: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Conditions */}
            {currentStep === 2 && (
              <>
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
                    <option value="">Select supplier...</option>
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
                    <option value="">Select category...</option>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to apply to all products in the category
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Settings */}
            {currentStep === 3 && (
              <>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers have higher priority (1 = highest)
                  </p>
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
                    Activate rule immediately
                  </label>
                </div>
                
                {/* Rule Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Rule Preview</h4>
                  <div className="text-sm text-blue-700">
                    <p><strong>When:</strong> {formData.supplier} supplies {formData.category} products{formData.productSku && ` (SKU: ${formData.productSku})`}</p>
                    <p><strong>Then:</strong> Apply {formData.markupPercentage}% markup</p>
                    <p><strong>Priority:</strong> {formData.priority}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : prevStep}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex gap-2">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.markupPercentage)) ||
                    (currentStep === 2 && (!formData.supplier || !formData.category))
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Rule
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}