import React, { useState } from 'react';
import { X, Plus, Minus, Package, Users, DollarSign } from 'lucide-react';

interface OrderItem {
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CreateOrderModalProps {
  type: 'purchase' | 'sales';
  onClose: () => void;
  onSubmit: (order: any) => void;
}

const mockSuppliers = [
  { id: '1', name: 'TechCorp API' },
  { id: '2', name: 'Fashion Hub API' },
  { id: '3', name: 'Home Goods Plus' },
  { id: '4', name: 'Sports Equipment Co' }
];

const mockCustomers = [
  { id: '1', name: 'Retail Store ABC' },
  { id: '2', name: 'Online Marketplace' },
  { id: '3', name: 'Wholesale Distributor' },
  { id: '4', name: 'Corporate Client XYZ' }
];

const mockProducts = [
  { sku: 'WH-001', name: 'Wireless Headphones', price: 89.99 },
  { sku: 'BS-045', name: 'Bluetooth Speaker', price: 129.99 },
  { sku: 'UC-123', name: 'USB-C Cable', price: 12.99 },
  { sku: 'PC-789', name: 'Phone Case', price: 18.27 },
  { sku: 'PL-456', name: 'Plant Pot - Ceramic', price: 18.50 }
];

export default function CreateOrderModal({ type, onClose, onSubmit }: CreateOrderModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    supplierId: '',
    customerId: '',
    supplierName: '',
    customerName: '',
    notes: ''
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState({
    sku: '',
    productName: '',
    quantity: 1,
    unitPrice: 0
  });

  const totalValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleEntitySelect = (entityId: string) => {
    if (type === 'purchase') {
      const supplier = mockSuppliers.find(s => s.id === entityId);
      setFormData(prev => ({ 
        ...prev, 
        supplierId: entityId, 
        supplierName: supplier?.name || '' 
      }));
    } else {
      const customer = mockCustomers.find(c => c.id === entityId);
      setFormData(prev => ({ 
        ...prev, 
        customerId: entityId, 
        customerName: customer?.name || '' 
      }));
    }
  };

  const handleProductSelect = (sku: string) => {
    const product = mockProducts.find(p => p.sku === sku);
    if (product) {
      setNewItem(prev => ({
        ...prev,
        sku: product.sku,
        productName: product.name,
        unitPrice: product.price
      }));
    }
  };

  const addItem = () => {
    if (newItem.sku && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const item: OrderItem = {
        ...newItem,
        totalPrice: newItem.quantity * newItem.unitPrice
      };
      
      setOrderItems(prev => [...prev, item]);
      setNewItem({ sku: '', productName: '', quantity: 1, unitPrice: 0 });
    }
  };

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity > 0) {
      setOrderItems(prev => prev.map((item, i) => 
        i === index 
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      ));
    }
  };

  const handleSubmit = () => {
    const order = {
      ...formData,
      items: orderItems,
      totalValue
    };
    onSubmit(order);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create {type === 'purchase' ? 'Purchase' : 'Sales'} Order
          </h2>
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
            <span>{type === 'purchase' ? 'Supplier' : 'Customer'}</span>
            <span>Items</span>
            <span>Review</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Select Supplier/Customer */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Select {type === 'purchase' ? 'Supplier' : 'Customer'}
                </label>
                <select
                  value={type === 'purchase' ? formData.supplierId : formData.customerId}
                  onChange={(e) => handleEntitySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose {type === 'purchase' ? 'a supplier' : 'a customer'}...</option>
                  {(type === 'purchase' ? mockSuppliers : mockCustomers).map(entity => (
                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes for this order..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Add Items */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Add New Item */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select
                      value={newItem.sku}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select product...</option>
                      {mockProducts.map(product => (
                        <option key={product.sku} value={product.sku}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addItem}
                      disabled={!newItem.sku || newItem.quantity <= 0 || newItem.unitPrice <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No items added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</div>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{type === 'purchase' ? 'Supplier:' : 'Customer:'}</span>
                    <div className="font-medium">{type === 'purchase' ? formData.supplierName : formData.customerName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Items:</span>
                    <div className="font-medium">{orderItems.length}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Notes:</span>
                    <div className="font-medium">{formData.notes || 'None'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Items</h4>
                <div className="space-y-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">{item.sku} • Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Order Value</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={currentStep === 1 ? onClose : prevStep}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex gap-2">
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !(type === 'purchase' ? formData.supplierId : formData.customerId)) ||
                  (currentStep === 2 && orderItems.length === 0)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}