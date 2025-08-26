import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  DollarSign,
  Grid3X3,
  List
} from 'lucide-react';
import ReportsLibrary from './ReportsLibrary';
import StockTrendChart from './StockTrendChart';
import SupplierFillRateChart from './SupplierFillRateChart';
import ProfitabilityChart from './ProfitabilityChart';
import FilterPanel from './FilterPanel';
import QuickStatsCards from './QuickStatsCards';

interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  suppliers: string[];
  categories: string[];
}

const mockKPIs = {
  totalRevenue: 2450000,
  revenueGrowth: 12.5,
  inventoryTurnover: 4.2,
  turnoverChange: 8.3,
  avgFillRate: 94.2,
  fillRateChange: -2.1,
  profitMargin: 23.8,
  marginChange: 5.7
};

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: '2024-01-01', 
      end: new Date().toISOString().split('T')[0]
    },
    suppliers: [],
    categories: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExportData = (type: 'csv' | 'pdf') => {
    // Simulate export functionality
    console.log(`Exporting data as ${type.toUpperCase()}`);
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: '2024-01-01',
        end: '2024-01-31'
      },
      suppliers: [],
      categories: []
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive insights and data-driven reports for your inventory management</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportData('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleExportData('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {filters.suppliers.length + filters.categories.length > 0 && 
                  `${filters.suppliers.length + filters.categories.length} filters applied`
                }
              </span>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>
      )}

      {/* Quick Stats Cards */}
      <QuickStatsCards kpis={mockKPIs} />

      {/* Reports Library */}
      <ReportsLibrary viewMode={viewMode} />

      {/* Charts Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <StockTrendChart filters={filters} />
        <SupplierFillRateChart filters={filters} />
      </div>

      {/* Full Width Chart */}
      <ProfitabilityChart filters={filters} />
      
      {/* Export Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Analytics Data</h3>
            <p className="text-sm text-gray-600">
              Export all current analytics data with applied filters for external analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExportData('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExportData('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}