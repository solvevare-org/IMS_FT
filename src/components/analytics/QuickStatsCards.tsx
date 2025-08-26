import React from 'react';
import { DollarSign, Activity, TrendingUp, PieChart, TrendingDown } from 'lucide-react';

interface KPIs {
  totalRevenue: number;
  revenueGrowth: number;
  inventoryTurnover: number;
  turnoverChange: number;
  avgFillRate: number;
  fillRateChange: number;
  profitMargin: number;
  marginChange: number;
}

interface QuickStatsCardsProps {
  kpis: KPIs;
}

export default function QuickStatsCards({ kpis }: QuickStatsCardsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(kpis.totalRevenue / 1000000).toFixed(1)}M`,
      change: kpis.revenueGrowth,
      icon: DollarSign,
      color: 'blue',
      prefix: '+',
      suffix: '%'
    },
    {
      title: 'Inventory Turnover',
      value: `${kpis.inventoryTurnover}x`,
      change: kpis.turnoverChange,
      icon: Activity,
      color: 'green',
      prefix: '+',
      suffix: '%'
    },
    {
      title: 'Avg Fill Rate',
      value: `${kpis.avgFillRate}%`,
      change: kpis.fillRateChange,
      icon: TrendingUp,
      color: 'orange',
      prefix: '',
      suffix: '%'
    },
    {
      title: 'Profit Margin',
      value: `${kpis.profitMargin}%`,
      change: kpis.marginChange,
      icon: PieChart,
      color: 'purple',
      prefix: '+',
      suffix: '%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(stat.change)}`}>
                {getChangeIcon(stat.change)}
                <span>
                  {stat.prefix}{Math.abs(stat.change)}{stat.suffix}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className={`text-xs ${getChangeColor(stat.change)}`}>
                vs last period
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}