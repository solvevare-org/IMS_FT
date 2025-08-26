import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const presetRanges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 }
];

export default function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeSelectorProps) {
  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center gap-1">
        {presetRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handlePresetRange(range.days)}
            className="px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}