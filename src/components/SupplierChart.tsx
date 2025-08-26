import React from 'react';

const supplierData = [
  { name: 'Supplier A', value: 35, color: '#3b82f6' },
  { name: 'Supplier B', value: 25, color: '#10b981' },
  { name: 'Supplier C', value: 20, color: '#f59e0b' },
  { name: 'Supplier D', value: 12, color: '#ef4444' },
  { name: 'Others', value: 8, color: '#6b7280' },
];

export default function SupplierChart() {
  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Supplier Stock Distribution</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            {supplierData.map((segment, index) => {
              const circumference = 2 * Math.PI * 90;
              const strokeDasharray = `${(segment.value / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              cumulativePercentage += segment.value;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:stroke-[25]"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500">Total Stock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {supplierData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-700 flex-1">{item.name}</span>
            <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}