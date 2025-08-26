import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Settings, 
  Download,
  ChevronDown,
  TrendingDown,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import StockAdjustmentModal from './StockAdjustmentModal';
import ReorderAlertModal from './ReorderAlertModal';
import StockAgingChart from './StockAgingChart';

interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  stockQuantity: number;
  allocated: number;
  available: number;
  reorderLevel: number;
  warehouse: string;
  category: string;
  lastUpdated: string;
  daysInStock: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'WH-001',
    productName: 'Wireless Bluetooth Headphones',
    stockQuantity: 45,
    allocated: 12,
    available: 33,
    reorderLevel: 20,
    warehouse: 'Main Warehouse',
    category: 'Electronics',
    lastUpdated: '2 hours ago',
    daysInStock: 15
  },
  {
    id: '2',
    sku: 'BS-045',
    productName: 'Portable Bluetooth Speaker',
    stockQuantity: 8,
    allocated: 3,
    available: 5,
    reorderLevel: 25,
    warehouse: 'Main Warehouse',
    category: 'Electronics',
    lastUpdated: '4 hours ago',
    daysInStock: 45
  },
  {
    id: '3',
    sku: 'UC-123',
    productName: 'USB-C Cable 6ft',
    stockQuantity: 156,
    allocated: 24,
    available: 132,
    reorderLevel: 50,
    warehouse: 'Supplier A Warehouse',
    category: 'Electronics',
    lastUpdated: '30 minutes ago',
    daysInStock: 8
  },
  {
    id: '4',
    sku: 'PC-789',
    productName: 'Phone Case - Clear',
    stockQuantity: 3,
    allocated: 1,
    available: 2,
    reorderLevel: 15,
    warehouse: 'Main Warehouse',
    category: 'Accessories',
    lastUpdated: '1 hour ago',
    daysInStock: 67
  },
  {
    id: '5',
    sku: 'PL-456',
    productName: 'Indoor Plant Pot - Ceramic',
    stockQuantity: 34,
    allocated: 8,
    available: 26,
    reorderLevel: 10,
    warehouse: 'Supplier B Warehouse',
    category: 'Home & Garden',
    lastUpdated: '3 hours ago',
    daysInStock: 23
  }
];

const warehouses = [
  'All Warehouses',
  'Main Warehouse',
  'Supplier A Warehouse',
  'Supplier B Warehouse',
  'Supplier C Warehouse'
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(mockInventory);
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [showReorderAlert, setShowReorderAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesWarehouse = selectedWarehouse === 'All Warehouses' || item.warehouse === selectedWarehouse;
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWarehouse && matchesSearch;
  });

  const lowStockItems = filteredInventory.filter(item => item.available <= item.reorderLevel);
  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.stockQuantity * 25), 0); // Mock price calculation

  const handleStockAdjustment = (adjustment: any) => {
    setInventory(prev => prev.map(item => 
      item.id === adjustment.itemId 
        ? { 
            ...item, 
            stockQuantity: item.stockQuantity + adjustment.quantity,
            available: item.available + adjustment.quantity,
            lastUpdated: 'Just now'
          }
        : item
    ));
    setShowStockAdjustment(false);
    setSelectedItem(null);
  };

  const handleReorderAlert = (alert: any) => {
    setInventory(prev => prev.map(item => 
      item.id === alert.itemId 
        ? { ...item, reorderLevel: alert.threshold }
        : item
    ));
    setShowReorderAlert(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Monitor stock levels across all warehouses</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStockAdjustment(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Stock Adjustment
          </button>
          <button
            onClick={() => setShowReorderAlert(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Set Reorder Alert
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Days in Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredInventory.reduce((sum, item) => sum + item.daysInStock, 0) / filteredInventory.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              >
                {warehouses.map(warehouse => (
                  <option key={warehouse} value={warehouse}>{warehouse}</option>
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Stock Overview</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Qty
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${item.available <= item.reorderLevel ? 'bg-orange-50 border-l-4 border-orange-400' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500 font-mono">{item.sku}</div>
                        {item.available <= item.reorderLevel && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">Low Stock</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{item.stockQuantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{item.allocated}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        item.available <= item.reorderLevel ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {item.available}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.warehouse}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Aging Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StockAgingChart data={filteredInventory} />
        </div>
      </div>

      {/* Modals */}
      {showStockAdjustment && (
        <StockAdjustmentModal
          items={inventory}
          selectedItem={selectedItem}
          onClose={() => {
            setShowStockAdjustment(false);
            setSelectedItem(null);
          }}
          onSubmit={handleStockAdjustment}
        />
      )}

      {showReorderAlert && (
        <ReorderAlertModal
          items={inventory}
          selectedItem={selectedItem}
          onClose={() => {
            setShowReorderAlert(false);
            setSelectedItem(null);
          }}
          onSubmit={handleReorderAlert}
        />
      )}
    </div>
  );
}