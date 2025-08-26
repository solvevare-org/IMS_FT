import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Tag, 
  Edit3, 
  Eye,
  ChevronDown,
  Package,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ProductDetailPanel from './ProductDetailPanel';

interface Product {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  category: string;
  stock: number;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'WH-001',
    name: 'Wireless Bluetooth Headphones',
    supplier: 'TechCorp API',
    category: 'Electronics',
    stock: 45,
    price: 89.99,
    status: 'active',
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    sku: 'BS-045',
    name: 'Portable Bluetooth Speaker',
    supplier: 'TechCorp API',
    category: 'Electronics',
    stock: 23,
    price: 129.99,
    status: 'active',
    lastUpdated: '4 hours ago'
  },
  {
    id: '3',
    sku: 'TS-789',
    name: 'Cotton T-Shirt - Blue',
    supplier: 'Fashion Hub API',
    category: 'Apparel',
    stock: 0,
    price: 24.99,
    status: 'inactive',
    lastUpdated: '1 day ago'
  },
  {
    id: '4',
    sku: 'CU-123',
    name: 'USB-C Cable 6ft',
    supplier: 'TechCorp API',
    category: 'Electronics',
    stock: 156,
    price: 12.99,
    status: 'active',
    lastUpdated: '30 minutes ago'
  },
  {
    id: '5',
    sku: 'PL-456',
    name: 'Indoor Plant Pot - Ceramic',
    supplier: 'Home Goods Plus',
    category: 'Home & Garden',
    stock: 34,
    price: 18.50,
    status: 'active',
    lastUpdated: '1 hour ago'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier;
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Unified catalog from all connected suppliers</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <DollarSign className="w-4 h-4" />
                Update Price
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Tag className="w-4 h-4" />
                Add Tags
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Suppliers</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
        
        {/* Active Filters */}
        {(selectedCategory || selectedSupplier) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Active filters:</span>
            {selectedCategory && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSupplier && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {selectedSupplier}
                <button onClick={() => setSelectedSupplier('')} className="hover:bg-green-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{product.supplier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 20 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filteredProducts.length} of {products.length} products
              {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
            </span>
            <div className="flex items-center gap-2">
              <span>Rows per page: 50</span>
              <button className="px-2 py-1 border border-gray-300 rounded hover:bg-white">
                1-50 of {products.length}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}