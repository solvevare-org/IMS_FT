import React, { useState } from 'react';
import { X, Globe, Key, Tag, Link } from 'lucide-react';

interface AddSupplierModalProps {
  onClose: () => void;
  onAdd: (supplier: any) => void;
}

export default function AddSupplierModal({ onClose, onAdd }: AddSupplierModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    apiKey: '',
    category: '',
    description: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      apiStatus: 'pending',
      lastSync: 'Never',
      productsCount: 0
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Supplier API</h2>
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
            <span>API Config</span>
            <span>Category</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., TechCorp API"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of this supplier..."
                  />
                </div>
              </>
            )}

            {/* Step 2: API Configuration */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Link className="w-4 h-4 inline mr-2" />
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://api.supplier.com/v1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Key className="w-4 h-4 inline mr-2" />
                    API Key / Token
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter API key or token"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be encrypted and stored securely
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Category Mapping */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Product Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Ready to Connect</h4>
                  <p className="text-sm text-blue-700">
                    We'll test the API connection and start syncing products once you submit.
                  </p>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Supplier
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}