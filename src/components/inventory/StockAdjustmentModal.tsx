import React, { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  stockQuantity: number;
  allocated: number;
  available: number;
}

interface StockAdjustmentModalProps {
  items: InventoryItem[];
  selectedItem?: InventoryItem | null;
  onClose: () => void;
  onSubmit: (adjustment: {
    itemId: string;
    quantity: number;
    reason: string;
    type: 'increase' | 'decrease';
  }) => void;
}

const adjustmentReasons = [
  'Damaged goods',
  'Lost inventory',
  'Found inventory',
  'Supplier return',
  'Customer return',
  'Theft/shrinkage',
  'Expired products',
  'Quality control',
  'Manual recount',
  'Other'
];

export default function StockAdjustmentModal({ 
  items, 
  selectedItem, 
  onClose, 
  onSubmit 
}: StockAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    itemId: selectedItem?.id || '',
    quantity: 0,
    reason: '',
    type: 'increase' as 'increase' | 'decrease',
    notes: ''
  });

  const selectedProduct = items.find(item => item.id === formData.itemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adjustmentQuantity = formData.type === 'decrease' ? -Math.abs(formData.quantity) : Math.abs(formData.quantity);
    
    onSubmit({
      itemId: formData.itemId,
      quantity: adjustmentQuantity,
      reason: formData.reason,
      type: formData.type
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Stock Adjustment</h2>
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
                onChange={(e) => setFormData(prev => ({ ...prev, itemId: e.target.value }))}
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
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Stock</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <div className="font-medium">{selectedProduct.stockQuantity}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Allocated:</span>
                    <div className="font-medium">{selectedProduct.allocated}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Available:</span>
                    <div className="font-medium">{selectedProduct.available}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Adjustment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'increase' }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.type === 'increase'
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Increase
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'decrease' }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.type === 'decrease'
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  Decrease
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a reason...</option>
                {adjustmentReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Preview */}
            {selectedProduct && formData.quantity > 0 && (
              <div className={`rounded-lg p-4 ${
                formData.type === 'increase' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Current Available:</span>
                    <span>{selectedProduct.available}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adjustment:</span>
                    <span className={formData.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
                      {formData.type === 'increase' ? '+' : '-'}{formData.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                    <span>New Available:</span>
                    <span>
                      {formData.type === 'increase' 
                        ? selectedProduct.available + formData.quantity
                        : selectedProduct.available - formData.quantity
                      }
                    </span>
                  </div>
                </div>
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
              disabled={!formData.itemId || !formData.quantity || !formData.reason}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}