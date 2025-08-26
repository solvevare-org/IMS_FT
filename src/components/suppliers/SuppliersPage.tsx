import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Edit3, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink
} from 'lucide-react';
import AddSupplierModal from './AddSupplierModal';

interface Supplier {
  id: string;
  name: string;
  apiStatus: 'active' | 'error' | 'pending';
  lastSync: string;
  baseUrl: string;
  category: string;
  productsCount: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp API',
    apiStatus: 'active',
    lastSync: '2 minutes ago',
    baseUrl: 'https://api.techcorp.com/v1',
    category: 'Electronics',
    productsCount: 1247
  },
  {
    id: '2',
    name: 'Fashion Hub API',
    apiStatus: 'error',
    lastSync: '2 hours ago',
    baseUrl: 'https://api.fashionhub.com/v2',
    category: 'Apparel',
    productsCount: 892
  },
  {
    id: '3',
    name: 'Home Goods Plus',
    apiStatus: 'active',
    lastSync: '15 minutes ago',
    baseUrl: 'https://api.homegoods.com/v1',
    category: 'Home & Garden',
    productsCount: 634
  },
  {
    id: '4',
    name: 'Sports Equipment Co',
    apiStatus: 'pending',
    lastSync: '1 hour ago',
    baseUrl: 'https://api.sportsequip.com/v1',
    category: 'Sports',
    productsCount: 445
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    error: { color: 'bg-red-100 text-red-800', icon: XCircle },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
  };
  
  const { color, icon: Icon } = config[status as keyof typeof config];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = async (supplierId: string) => {
    setSyncingId(supplierId);
    // Simulate API call
    setTimeout(() => {
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, lastSync: 'Just now', apiStatus: 'active' as const }
          : supplier
      ));
      setSyncingId(null);
    }, 2000);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier API connections and sync settings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Supplier API
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <tr 
                  key={supplier.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {supplier.baseUrl}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {supplier.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={supplier.apiStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{supplier.lastSync}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {supplier.productsCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSync(supplier.id)}
                        disabled={syncingId === supplier.id}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Sync Now"
                      >
                        <RefreshCw className={`w-4 h-4 ${syncingId === supplier.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Logs"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <AddSupplierModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newSupplier) => {
            setSuppliers(prev => [...prev, { ...newSupplier, id: Date.now().toString() }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}