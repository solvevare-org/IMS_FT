import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Info, Eye, BarChart3 } from 'lucide-react';

interface ProfitabilityChartProps {
  filters: any;
}

const mockData = [
  { month: 'Jan', revenue: 245000, costs: 186000, profit: 59000, margin: 24.1, orders: 145 },
  { month: 'Feb', revenue: 267000, costs: 198000, profit: 69000, margin: 25.8, orders: 167 },
  { month: 'Mar', revenue: 234000, costs: 182000, profit: 52000, margin: 22.2, orders: 134 },
  { month: 'Apr', revenue: 289000, costs: 215000, profit: 74000, margin: 25.6, orders: 189 },
  { month: 'May', revenue: 312000, costs: 231000, profit: 81000, margin: 26.0, orders: 203 },
  { month: 'Jun', revenue: 298000, costs: 224000, profit: 74000, margin: 24.8, orders: 178 }
];

const chartTypes = [
  { id: 'combined', label: 'Combined View', icon: BarChart3 },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'profit', label: 'Profit', icon: TrendingUp },
  { id: 'margin', label: 'Margin %', icon: TrendingUp }
];

export default function ProfitabilityChart({ filters }: ProfitabilityChartProps) {
  const [chartType, setChartType] = useState<'combined' | 'revenue' | 'profit' | 'margin'>('combined');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const maxRevenue = Math.max(...mockData.map(d => d.revenue));
  const maxProfit = Math.max(...mockData.map(d => d.profit));
  const maxCosts = Math.max(...mockData.map(d => d.costs));
  const maxMargin = Math.max(...mockData.map(d => d.margin));

  const getChartData = () => {
    switch (chartType) {
      case 'revenue':
        return { data: mockData.map(d => d.revenue), max: maxRevenue, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', label: 'Revenue', format: 'currency' };
      case 'profit':
        return { data: mockData.map(d => d.profit), max: maxProfit, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', label: 'Profit', format: 'currency' };
      case 'margin':
        return { data: mockData.map(d => d.margin), max: maxMargin, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', label: 'Margin %', format: 'percentage' };
      default:
        return { data: mockData.map(d => d.profit), max: maxProfit, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', label: 'Profit', format: 'currency' };
    }
  };

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `$${value.toLocaleString()}`;
    } else if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toString();
  };

  const chartData = getChartData();

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Profitability Over Time</h3>
            <p className="text-sm text-gray-600">Revenue, costs, and profit analysis with trends</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Options */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    chartType === type.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Export Chart">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Chart Information">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 mb-6">
        {chartType === 'combined' ? (
          // Combined Chart with Revenue, Costs, and Profit
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-between gap-3">
              {mockData.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Stacked Bars */}
                  <div className="relative w-full flex flex-col items-center">
                    {/* Revenue Bar (Background) */}
                    <div 
                      className="bg-blue-200 rounded-t-lg w-full transition-all duration-300 relative"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    >
                      {/* Costs Bar (Inside Revenue) */}
                      <div 
                        className="bg-red-400 rounded-t-lg w-full absolute bottom-0 transition-all duration-300"
                        style={{ height: `${(item.costs / item.revenue) * 100}%` }}
                      />
                      
                      {/* Profit Bar (Top portion) */}
                      <div 
                        className="bg-green-500 rounded-t-lg w-full absolute top-0 transition-all duration-300 group-hover:bg-green-600"
                        style={{ height: `${(item.profit / item.revenue) * 100}%` }}
                      />
                    </div>

                    {/* Hover Tooltip */}
                    {hoveredIndex === index && (
                      <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg z-10 min-w-max">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Revenue: ${item.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span>Costs: ${item.costs.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Profit: ${item.profit.toLocaleString()}</span>
                          </div>
                          <div className="border-t border-gray-600 pt-1 mt-1">
                            <span>Margin: {item.margin}%</span>
                          </div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Month Label */}
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.orders} orders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Single Metric Chart
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-between gap-3">
              {mockData.map((item, index) => {
                const value = chartData.data[index];
                const height = (value / chartData.max) * 100;
                const prevValue = index > 0 ? chartData.data[index - 1] : value;
                const trend = calculateTrend(value, prevValue);
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div 
                      className={`${chartData.color} ${chartData.hoverColor} rounded-t-lg transition-all duration-500 relative w-full shadow-sm group-hover:shadow-md`}
                      style={{ height: `${height}%` }}
                    >
                      {/* Trend Indicator */}
                      {index > 0 && (
                        <div className="absolute -top-6 right-1 flex items-center">
                          {trend > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : trend < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          ) : null}
                        </div>
                      )}

                      {/* Hover Tooltip */}
                      {hoveredIndex === index && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-semibold">{formatValue(value, chartData.format)}</div>
                            {index > 0 && (
                              <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-300' : trend < 0 ? 'text-red-300' : 'text-gray-300'}`}>
                                {trend > 0 ? '+' : ''}{trend.toFixed(1)}% vs prev
                              </div>
                            )}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatValue(value, chartData.format)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          {chartType === 'combined' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600 font-medium">Profit</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 ${chartData.color} rounded`}></div>
              <span className="text-sm text-gray-600 font-medium">{chartData.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">
            ${mockData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-700 font-medium mb-2">Total Revenue</div>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-semibold">+12.5%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-900">
            ${mockData.reduce((sum, item) => sum + item.costs, 0).toLocaleString()}
          </div>
          <div className="text-sm text-red-700 font-medium mb-2">Total Costs</div>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-red-600" />
            <span className="text-xs text-red-600 font-semibold">+8.2%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-900">
            ${mockData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-700 font-medium mb-2">Total Profit</div>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-semibold">+18.7%</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-900">
            {(mockData.reduce((sum, item) => sum + item.margin, 0) / mockData.length).toFixed(1)}%
          </div>
          <div className="text-sm text-purple-700 font-medium mb-2">Avg Margin</div>
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-semibold">+2.3%</span>
          </div>
        </div>
      </div>
    </div>
  );
}