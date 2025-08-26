import React from 'react';
import { Clock } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  daysInStock: number;
  stockQuantity: number;
}

interface StockAgingChartProps {
  data: InventoryItem[];
}

export default function StockAgingChart({ data }: StockAgingChartProps) {
  // Group items by age ranges
  const ageRanges = [
    { label: '0-7 days', min: 0, max: 7, color: '#10b981' },
    { label: '8-30 days', min: 8, max: 30, color: '#3b82f6' },
    { label: '31-60 days', min: 31, max: 60, color: '#f59e0b' },
    { label: '61-90 days', min: 61, max: 90, color: '#ef4444' },
    { label: '90+ days', min: 91, max: Infinity, color: '#6b7280' }
  ];

  const chartData = ageRanges.map(range => {
    const items = data.filter(item => 
      item.daysInStock >= range.min && item.daysInStock <= range.max
    );
    const totalQuantity = items.reduce((sum, item) => sum + item.stockQuantity, 0);
    
    return {
      ...range,
      count: items.length,
      quantity: totalQuantity
    };
  });

  const maxQuantity = Math.max(...chartData.map(d => d.quantity));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Stock Aging</h3>
      </div>
      
      <div className="space-y-4">
        {chartData.map((range, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{range.label}</span>
              <span className="text-gray-500">{range.count} items</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${maxQuantity > 0 ? (range.quantity / maxQuantity) * 100 : 0}%`,
                    backgroundColor: range.color
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="font-medium">{range.quantity} units</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Items:</span>
            <div className="font-semibold text-gray-900">{data.length}</div>
          </div>
          <div>
            <span className="text-gray-600">Avg. Age:</span>
            <div className="font-semibold text-gray-900">
              {Math.round(data.reduce((sum, item) => sum + item.daysInStock, 0) / data.length)} days
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-700">
            <strong>Tip:</strong> Items over 60 days may need promotional pricing or supplier review.
          </div>
        </div>
      </div>
    </div>
  );
}