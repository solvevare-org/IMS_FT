import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Eye,
  Edit3,
  Calendar,
  DollarSign,
  Package,
  Users
} from 'lucide-react';
import CreateOrderModal from './CreateOrderModal';
import OrderDetailPanel from './OrderDetailPanel';

interface Order {
  id: string;
  type: 'purchase' | 'sales';
  supplierId?: string;
  customerId?: string;
  supplierName?: string;
  customerName?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  totalValue: number;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const mockOrders: Order[] = [
  {
    id: 'PO-001',
    type: 'purchase',
    supplierId: '1',
    supplierName: 'TechCorp API',
    status: 'pending',
    date: '2024-01-15',
    totalValue: 2450.00,
    items: [
      { id: '1', sku: 'WH-001', productName: 'Wireless Headphones', quantity: 25, unitPrice: 89.99, totalPrice: 2249.75 },
      { id: '2', sku: 'UC-123', productName: 'USB-C Cable', quantity: 15, unitPrice: 12.99, totalPrice: 194.85 }
    ]
  },
  {
    id: 'SO-001',
    type: 'sales',
    customerId: '1',
    customerName: 'Retail Store ABC',
    status: 'completed',
    date: '2024-01-14',
    totalValue: 1299.90,
    items: [
      { id: '1', sku: 'BS-045', productName: 'Bluetooth Speaker', quantity: 10, unitPrice: 129.99, totalPrice: 1299.90 }
    ]
  },
  {
    id: 'PO-002',
    type: 'purchase',
    supplierId: '2',
    supplierName: 'Fashion Hub API',
    status: 'in_progress',
    date: '2024-01-13',
    totalValue: 875.50,
    items: [
      { id: '1', sku: 'TS-789', productName: 'Cotton T-Shirt', quantity: 35, unitPrice: 24.99, totalPrice: 874.65 }
    ]
  },
  {
    id: 'SO-002',
    type: 'sales',
    customerId: '2',
    customerName: 'Online Marketplace',
    status: 'pending',
    date: '2024-01-12',
    totalValue: 456.75,
    items: [
      { id: '1', sku: 'PC-789', productName: 'Phone Case', quantity: 25, unitPrice: 18.27, totalPrice: 456.75 }
    ]
  },
  {
    id: 'PO-003',
    type: 'purchase',
    supplierId: '3',
    supplierName: 'Home Goods Plus',
    status: 'completed',
    date: '2024-01-10',
    totalValue: 925.00,
    items: [
      { id: '1', sku: 'PL-456', productName: 'Plant Pot - Ceramic', quantity: 50, unitPrice: 18.50, totalPrice: 925.00 }
    ]
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
  };
  
  const { color, label } = config[status as keyof typeof config];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState<'purchase' | 'sales'>('purchase');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesTab = order.type === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalValue, 0);
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;

  const handleCreateOrder = (newOrder: any) => {
    const order: Order = {
      id: `${activeTab === 'purchase' ? 'PO' : 'SO'}-${String(orders.length + 1).padStart(3, '0')}`,
      type: activeTab,
      ...newOrder,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };
    
    setOrders(prev => [order, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Track and manage purchase and sales orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
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
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'purchase'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sales'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sales Orders
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab} orders...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'purchase' ? 'Supplier' : 'Customer'}
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {activeTab === 'purchase' ? order.supplierName : order.customerName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ${order.totalValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Order"
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
              Showing {filteredOrders.length} {activeTab} orders
            </span>
            <div className="flex items-center gap-2">
              <span>Total Value: ${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateOrderModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrder}
        />
      )}

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}