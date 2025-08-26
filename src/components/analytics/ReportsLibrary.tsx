import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  BarChart3,
  Eye,
  Clock
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'inventory' | 'supplier' | 'financial';
  lastGenerated: string;
  size: string;
  format: 'PDF' | 'CSV' | 'Excel';
}

interface ReportsLibraryProps {
  viewMode: 'grid' | 'list';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Inventory Turnover Analysis',
    description: 'Detailed analysis of inventory turnover rates across all product categories',
    icon: Package,
    category: 'inventory',
    lastGenerated: '2 hours ago',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: '2',
    title: 'Supplier Reliability Report',
    description: 'Performance metrics and reliability scores for all connected suppliers',
    icon: Users,
    category: 'supplier',
    lastGenerated: '1 day ago',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: '3',
    title: 'Profitability Dashboard',
    description: 'Comprehensive profit analysis with margin trends and cost breakdowns',
    icon: DollarSign,
    category: 'financial',
    lastGenerated: '3 hours ago',
    size: '3.1 MB',
    format: 'PDF'
  },
  {
    id: '4',
    title: 'Stock Movement Report',
    description: 'Detailed tracking of stock movements, adjustments, and transfers',
    icon: TrendingUp,
    category: 'inventory',
    lastGenerated: '5 hours ago',
    size: '4.2 MB',
    format: 'CSV'
  },
  {
    id: '5',
    title: 'Supplier Performance Metrics',
    description: 'Fill rates, delivery times, and quality scores by supplier',
    icon: BarChart3,
    category: 'supplier',
    lastGenerated: '1 day ago',
    size: '2.7 MB',
    format: 'Excel'
  },
  {
    id: '6',
    title: 'Financial Summary',
    description: 'Monthly financial overview with revenue, costs, and profit analysis',
    icon: FileText,
    category: 'financial',
    lastGenerated: '6 hours ago',
    size: '1.5 MB',
    format: 'PDF'
  }
];

const categoryColors = {
  inventory: 'bg-blue-50 text-blue-700 border-blue-200',
  supplier: 'bg-green-50 text-green-700 border-green-200',
  financial: 'bg-purple-50 text-purple-700 border-purple-200'
};

const formatColors = {
  PDF: 'bg-red-100 text-red-800',
  CSV: 'bg-green-100 text-green-800',
  Excel: 'bg-blue-100 text-blue-800'
};

export default function ReportsLibrary({ viewMode }: ReportsLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredReports = selectedCategory === 'all' 
    ? mockReports 
    : mockReports.filter(report => report.category === selectedCategory);

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // Simulate report generation
  };

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`);
    // Simulate report download
  };

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report: ${reportId}`);
    // Simulate report viewing
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reports Library</h3>
          <p className="text-sm text-gray-600">Pre-built reports with export capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="inventory">Inventory</option>
            <option value="supplier">Supplier</option>
            <option value="financial">Financial</option>
          </select>

          <button
            onClick={() => handleGenerateReport('all')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate All
          </button>
        </div>
      </div>

      {/* Reports Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[report.category]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${formatColors[report.format]}`}>
                        {report.format}
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.lastGenerated}
                  </div>
                  <span>{report.size}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewReport(report.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="flex items-center justify-center p-2 border border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-600 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    className="flex items-center justify-center p-2 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 rounded-lg transition-colors"
                    title="Regenerate"
                  >
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${categoryColors[report.category]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{report.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${formatColors[report.format]}`}>
                        {report.format}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.lastGenerated}
                      </div>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewReport(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="p-2 border border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-600 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    className="p-2 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 rounded-lg transition-colors"
                    title="Regenerate"
                  >
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredReports.length} reports available
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Schedule Reports
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Custom Report Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}