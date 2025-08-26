import React from 'react';
import { Calendar, Users, Tag, X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    dateRange: {
      start: string;
      end: string;
    };
    suppliers: string[];
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const mockSuppliers = [
  'TechCorp API',
  'Fashion Hub API',
  'Home Goods Plus',
  'Sports Equipment Co',
  'Electronics Plus',
  'Gadget World'
];

const mockCategories = [
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Sports',
  'Books',
  'Health & Beauty',
  'Automotive'
];

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateDateRange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const toggleSupplier = (supplier: string) => {
    const newSuppliers = filters.suppliers.includes(supplier)
      ? filters.suppliers.filter(s => s !== supplier)
      : [...filters.suppliers, supplier];
    
    onFiltersChange({
      ...filters,
      suppliers: newSuppliers
    });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const removeSupplier = (supplier: string) => {
    onFiltersChange({
      ...filters,
      suppliers: filters.suppliers.filter(s => s !== supplier)
    });
  };

  const removeCategory = (category: string) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.filter(c => c !== category)
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Calendar className="w-4 h-4 inline mr-2" />
          Date Range
        </label>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => updateDateRange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => updateDateRange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        
        {/* Quick Date Presets */}
        <div className="mt-3 flex flex-wrap gap-1">
          {[
            { label: '7D', days: 7 },
            { label: '30D', days: 30 },
            { label: '90D', days: 90 }
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - preset.days);
                updateDateRange('start', start.toISOString().split('T')[0]);
                updateDateRange('end', end.toISOString().split('T')[0]);
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Users className="w-4 h-4 inline mr-2" />
          Suppliers
        </label>
        
        {/* Selected Suppliers */}
        {filters.suppliers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {filters.suppliers.map(supplier => (
              <span
                key={supplier}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {supplier.length > 15 ? `${supplier.substring(0, 15)}...` : supplier}
                <button
                  onClick={() => removeSupplier(supplier)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Supplier Checkboxes */}
        <div className="space-y-2 max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {mockSuppliers.map(supplier => (
            <label key={supplier} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                checked={filters.suppliers.includes(supplier)}
                onChange={() => toggleSupplier(supplier)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
              />
              <span className="text-sm text-gray-700">{supplier}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Tag className="w-4 h-4 inline mr-2" />
          Categories
        </label>
        
        {/* Selected Categories */}
        {filters.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {filters.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
              >
                {category}
                <button
                  onClick={() => removeCategory(category)}
                  className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Category Checkboxes */}
        <div className="space-y-2 max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {mockCategories.map(category => (
            <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}