import React from 'react';
import { X, Package, Calendar, DollarSign, User, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  type: 'purchase' | 'sales';
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

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
}

const statusTimeline = [
  { status: 'pending', label: 'Order Created', date: '2024-01-15 10:30 AM', completed: true },
  { status: 'in_progress', label: 'Processing', date: '2024-01-15 2:15 PM', completed: true },
  { status: 'completed', label: 'Completed', date: '2024-01-16 9:45 AM', completed: false }
];

const StatusIcon = ({ status, completed }: { status: string; completed: boolean }) => {
  if (completed) {
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  }
  
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'in_progress':
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{order.id}</h2>
            <p className="text-sm text-gray-500">
              {order.type === 'purchase' ? 'Purchase Order' : 'Sales Order'} • 
              {order.type === 'purchase' ? order.supplierName : order.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Order Date</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Total Value</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                ${order.totalValue.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Items</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {order.items.length}
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
            <div className="space-y-4">
              {statusTimeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <StatusIcon status={step.status} completed={step.completed} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </h4>
                      <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.completed ? step.date : 'Pending'}
                      </span>
                    </div>
                    {index < statusTimeline.length - 1 && (
                      <div className={`w-px h-6 ml-2.5 mt-2 ${step.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-600">{item.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">${item.totalPrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      ${order.totalValue.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {order.type === 'purchase' ? 'Supplier' : 'Customer'} Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.type === 'purchase' ? order.supplierName : order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">Primary Contact</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Notes</div>
                    <div className="text-sm text-gray-600">
                      {order.notes || 'No additional notes'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Update Status
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              Edit Order
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}