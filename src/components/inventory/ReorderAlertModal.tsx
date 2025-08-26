import React, { useState } from 'react';
import { X, AlertTriangle, Package } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  stockQuantity: number;
  allocated: number;
  available: number;
  reorderLevel: number;
}

interface ReorderAlertModalProps {
  items: InventoryItem[];
  selectedItem?: InventoryItem | null;
  onClose: () => void;
  onSubmit: (alert: {
    itemId: string;
    threshold: number;
  }) => void;
}

export default function ReorderAlertModal({ 
  items, 
  selectedItem, 
  onClose, 
  onSubmit 
}: ReorderAlertModalProps) {
  const [formData, setFormData] = useState({
    itemId: selectedItem?.id || '',
    threshold: selectedItem?.reorderLevel || 0
  });

  const selectedProduct = items.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      itemId: formData.itemId,
      threshold: formData.threshold
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Set Reorder Alert</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Select Product
              </label>
              <select
                value={formData.itemId}
                onChange={(e) => {
                  const item = items.find(i => i.id === e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    itemId: e.target.value,
                    threshold: item?.reorderLevel || 0
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a product...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.productName} ({item.sku})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Stock Info */}
            {selectedProduct && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Stock Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Available Stock:</span>
                    <div className="font-medium text-lg">{selectedProduct.available}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Alert Level:</span>
                    <div className="font-medium text-lg">{selectedProduct.reorderLevel}</div>
                  </div>
                </div>
                
                {selectedProduct.available <= selectedProduct.reorderLevel && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700 font-medium">
                      Currently below reorder level
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Threshold Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Reorder Threshold
              </label>
              <input
                type="number"
                min="0"
                value={formData.threshold || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter minimum stock level"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll be alerted when stock falls to or below this level
              </p>
            </div>

            {/* Recommended Thresholds */}
            {selectedProduct && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Thresholds</h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, threshold: Math.ceil(selectedProduct.stockQuantity * 0.1) }))}
                    className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">Conservative (10%)</span>
                      <span className="text-sm font-medium">{Math.ceil(selectedProduct.stockQuantity * 0.1)}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, threshold: Math.ceil(selectedProduct.stockQuantity * 0.2) }))}
                    className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">Moderate (20%)</span>
                      <span className="text-sm font-medium">{Math.ceil(selectedProduct.stockQuantity * 0.2)}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, threshold: Math.ceil(selectedProduct.stockQuantity * 0.3) }))}
                    className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">Aggressive (30%)</span>
                      <span className="text-sm font-medium">{Math.ceil(selectedProduct.stockQuantity * 0.3)}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Alert Preview */}
            {selectedProduct && formData.threshold > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Alert Preview</h4>
                <div className="text-sm text-gray-600">
                  You'll receive an alert when <strong>{selectedProduct.productName}</strong> stock 
                  falls to <strong>{formData.threshold}</strong> units or below.
                </div>
                {formData.threshold > selectedProduct.available && (
                  <div className="mt-2 p-2 bg-orange-100 rounded text-sm text-orange-700">
                    ⚠️ This threshold is above current stock - you'll be alerted immediately
                  </div>
                )}
              </div>
            )}
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
              disabled={!formData.itemId || formData.threshold < 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}