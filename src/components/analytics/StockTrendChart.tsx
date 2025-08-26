import React from 'react';
import { TrendingUp, Info, Download } from 'lucide-react';

interface StockTrendChartProps {
  filters: any;
}

const mockData = [
  { month: 'Jan', inStock: 12500, outStock: 8200, turnover: 4.2 },
  { month: 'Feb', inStock: 13200, outStock: 9100, turnover: 4.5 },
  { month: 'Mar', inStock: 11800, outStock: 7800, turnover: 3.9 },
  { month: 'Apr', inStock: 14100, outStock: 10200, turnover: 4.8 },
  { month: 'May', inStock: 13600, outStock: 9800, turnover: 4.6 },
  { month: 'Jun', inStock: 15200, outStock: 11400, turnover: 5.1 }
];

export default function StockTrendChart({ filters }: StockTrendChartProps) {
  const maxValue = Math.max(...mockData.map(d => Math.max(d.inStock, d.outStock)));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stock Trend Analysis</h3>
            <p className="text-sm text-gray-600">Inventory movement over time</p>
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

      {/* Chart */}
      <div className="relative h-64 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {mockData.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="relative w-full flex gap-1">
                {/* In Stock Bar */}
                <div 
                  className="bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600 cursor-pointer relative group shadow-sm"
                  style={{ 
                    height: `${(item.inStock / maxValue) * 100}%`,
                    width: '45%'
                  }}
                  title={`In Stock: ${item.inStock.toLocaleString()}`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    In: {item.inStock.toLocaleString()}
                  </div>
                </div>
                
                {/* Out Stock Bar */}
                <div 
                  className="bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600 cursor-pointer relative group shadow-sm"
                  style={{ 
                    height: `${(item.outStock / maxValue) * 100}%`,
                    width: '45%'
                  }}
                  title={`Out Stock: ${item.outStock.toLocaleString()}`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Out: {item.outStock.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="text-xs text-gray-500">
                  {item.turnover}x turnover
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Stock In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Stock Out</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {mockData.reduce((sum, item) => sum + item.inStock, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Stock In</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {mockData.reduce((sum, item) => sum + item.outStock, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Stock Out</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {(mockData.reduce((sum, item) => sum + item.turnover, 0) / mockData.length).toFixed(1)}x
          </div>
          <div className="text-sm text-gray-600 font-medium">Avg Turnover</div>
        </div>
      </div>
    </div>
  );
}