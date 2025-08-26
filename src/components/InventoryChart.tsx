import React from 'react';

const mockData = [
  { month: 'Jan', turnover: 45 },
  { month: 'Feb', turnover: 52 },
  { month: 'Mar', turnover: 38 },
  { month: 'Apr', turnover: 61 },
  { month: 'May', turnover: 55 },
  { month: 'Jun', turnover: 67 },
];

export default function InventoryChart() {
  const maxValue = Math.max(...mockData.map(item => item.turnover));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Turnover</h3>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
          <option>Last 6 months</option>
          <option>Last 12 months</option>
        </select>
      </div>
      
      <div className="flex items-end justify-between h-64 gap-4">
        {mockData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div 
              className="bg-blue-500 rounded-t-lg w-full min-h-[4px] transition-all duration-500 hover:bg-blue-600"
              style={{ height: `${(item.turnover / maxValue) * 100}%` }}
              title={`${item.month}: ${item.turnover}%`}
            ></div>
            <span className="text-sm text-gray-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Average: 53%</span>
          <span className="text-green-600 font-medium">↑ 8% vs last period</span>
        </div>
      </div>
    </div>
  );
}