import React from 'react';
import { X, Package, DollarSign, Calendar, TrendingUp, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  category: string;
  stock: number;
  price: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

interface ProductDetailPanelProps {
  product: Product;
  onClose: () => void;
}

const priceHistory = [
  { date: '2024-01-01', price: 89.99 },
  { date: '2024-01-15', price: 94.99 },
  { date: '2024-02-01', price: 89.99 },
  { date: '2024-02-15', price: 87.99 },
  { date: '2024-03-01', price: 89.99 },
];

const supplierStock = [
  { supplier: 'TechCorp API', stock: 45, price: 89.99, lastSync: '2 hours ago' },
  { supplier: 'Electronics Plus', stock: 23, price: 92.99, lastSync: '4 hours ago' },
  { supplier: 'Gadget World', stock: 12, price: 87.50, lastSync: '1 day ago' },
];

export default function ProductDetailPanel({ product, onClose }: ProductDetailPanelProps) {
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Edit Product
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                  View on Supplier Site
                  <ExternalLink className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Stock</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{product.stock}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">${product.price}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier</span>
                  <span className="font-medium">{product.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{product.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
            </div>
            
            <div className="h-32 flex items-end justify-between gap-2">
              {priceHistory.map((point, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-blue-600"
                    style={{ 
                      height: `${((point.price - minPrice) / (maxPrice - minPrice)) * 100}%` 
                    }}
                    title={`$${point.price}`}
                  ></div>
                  <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-600">
              <span>Min: ${minPrice}</span>
              <span>Current: ${product.price}</span>
              <span>Max: ${maxPrice}</span>
            </div>
          </div>

          {/* Stock by Supplier */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Supplier</h3>
            <div className="space-y-3">
              {supplierStock.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.supplier}</div>
                    <div className="text-sm text-gray-500">Last sync: {item.lastSync}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{item.stock} units</div>
                    <div className="text-sm text-gray-600">${item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900">Black - Medium</div>
                <div className="text-sm text-gray-500">SKU: WH-001-BK-M • Stock: 23</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900">Black - Large</div>
                <div className="text-sm text-gray-500">SKU: WH-001-BK-L • Stock: 22</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900">White - Medium</div>
                <div className="text-sm text-gray-500">SKU: WH-001-WH-M • Stock: 0</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900">White - Large</div>
                <div className="text-sm text-gray-500">SKU: WH-001-WH-L • Stock: 0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}