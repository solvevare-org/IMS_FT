import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TableProps {
  title: string;
  type: 'sync-logs' | 'low-stock';
}

const syncLogs = [
  { id: 1, supplier: 'Supplier A', status: 'success', time: '2 min ago', items: 245 },
  { id: 2, supplier: 'Supplier B', status: 'pending', time: '5 min ago', items: 189 },
  { id: 3, supplier: 'Supplier C', status: 'success', time: '12 min ago', items: 367 },
  { id: 4, supplier: 'Supplier D', status: 'error', time: '18 min ago', items: 0 },
  { id: 5, supplier: 'Supplier E', status: 'success', time: '24 min ago', items: 156 },
];

const lowStockItems = [
  { id: 1, product: 'Wireless Headphones', sku: 'WH-001', stock: 5, threshold: 20, supplier: 'Tech Corp' },
  { id: 2, product: 'Bluetooth Speaker', sku: 'BS-045', stock: 8, threshold: 25, supplier: 'Audio Plus' },
  { id: 3, product: 'USB Cable', sku: 'UC-123', stock: 12, threshold: 50, supplier: 'Cable Co' },
  { id: 4, product: 'Phone Case', sku: 'PC-789', stock: 3, threshold: 15, supplier: 'Accessory Hub' },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

export default function DataTable({ title, type }: TableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      {type === 'sync-logs' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Supplier</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Items</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="space-y-3">
              {syncLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <span className="text-sm font-medium text-gray-900">{log.supplier}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={log.status} />
                      <span className={`text-sm capitalize ${
                        log.status === 'success' ? 'text-green-700' :
                        log.status === 'pending' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-700">{log.items}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-500">{log.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Product</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">SKU</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Stock</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">{item.product}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-700">{item.sku}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${
                      item.stock < item.threshold / 2 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {item.stock} / {item.threshold}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-500">{item.supplier}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}