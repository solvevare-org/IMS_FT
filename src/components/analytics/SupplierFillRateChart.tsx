import React from 'react';
import { Users, TrendingDown, TrendingUp, Download, Info } from 'lucide-react';

interface SupplierFillRateChartProps {
  filters: any;
}

const mockData = [
  { supplier: 'TechCorp API', fillRate: 96.5, orders: 145, trend: 'up' },
  { supplier: 'Fashion Hub API', fillRate: 89.2, orders: 98, trend: 'down' },
  { supplier: 'Home Goods Plus', fillRate: 94.8, orders: 76, trend: 'up' },
  { supplier: 'Sports Equipment Co', fillRate: 87.3, orders: 54, trend: 'down' },
  { supplier: 'Electronics Plus', fillRate: 92.1, orders: 67, trend: 'up' },
  { supplier: 'Gadget World', fillRate: 85.6, orders: 43, trend: 'down' }
];

const getFillRateColor = (rate: number) => {
  if (rate >= 95) return 'bg-green-500';
  if (rate >= 90) return 'bg-yellow-500';
  if (rate >= 85) return 'bg-orange-500';
  return 'bg-red-500';
};

const getFillRateTextColor = (rate: number) => {
  if (rate >= 95) return 'text-green-700';
  if (rate >= 90) return 'text-yellow-700';
  if (rate >= 85) return 'text-orange-700';
  return 'text-red-700';
};

export default function SupplierFillRateChart({ filters }: SupplierFillRateChartProps) {
  const maxFillRate = Math.max(...mockData.map(d => d.fillRate));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Supplier Fill Rate</h3>
            <p className="text-sm text-gray-600">Order fulfillment performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Export Chart">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Chart Information">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Heatmap-style Chart */}
      <div className="space-y-3 mb-6">
        {mockData.map((supplier, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                  {supplier.supplier}
                </span>
                {supplier.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {supplier.orders} orders
                </span>
                <span className={`text-sm font-semibold ${getFillRateTextColor(supplier.fillRate)}`}>
                  {supplier.fillRate}%
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getFillRateColor(supplier.fillRate)} group-hover:opacity-80 shadow-sm`}
                  style={{ width: `${(supplier.fillRate / 100) * 100}%` }}
                ></div>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {supplier.fillRate}% fill rate • {supplier.orders} orders
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Excellent</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {mockData.filter(s => s.fillRate >= 95).length}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-600">Good</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {mockData.filter(s => s.fillRate >= 90 && s.fillRate < 95).length}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">Fair</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {mockData.filter(s => s.fillRate >= 85 && s.fillRate < 90).length}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Poor</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {mockData.filter(s => s.fillRate < 85).length}
          </div>
        </div>
      </div>

      {/* Average Fill Rate */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <div className="text-3xl font-bold text-gray-900">
          {(mockData.reduce((sum, s) => sum + s.fillRate, 0) / mockData.length).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600 font-medium">Average Fill Rate</div>
        <div className="text-xs text-gray-500 mt-1">Across all suppliers</div>
      </div>
    </div>
  );
}