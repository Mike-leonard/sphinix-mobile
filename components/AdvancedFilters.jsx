import React from 'react';

const FILTER_CATEGORIES = [
  {
    title: 'Battery',
    options: ['1001 - 1500 MAh', '1501 - 2000 MAh', '2001 - 3000 MAh', '3001 - 4000 MAh', '4001 - 5000 MAh', '5001 MAh and above', 'Under 1000 MAh']
  },
  {
    title: 'Camera',
    options: ['2 MP', '3 MP', '5 MP', '8 MP', '12 - 16 MP', '20 MP and above']
  },
  {
    title: 'Connectivity',
    options: ['Bluetooth', 'GPS', 'HDMI', 'Infrared', 'NFC', 'USB', 'Wi-fi', 'Wi-fi Hotspot']
  },
  {
    title: 'CPU',
    options: ['1.1 - 1.5 GHz', '1.6 - 2.0 GHz', '2.1 - 2.5 GHz', '2.6 - 3.0 GHz', 'Above 3.0 GHz', 'Under 1.0 GHz']
  },
  {
    title: 'Display',
    options: ['4.1 - 5.0 inches', '5.1 - 6.0 inches', '6.1 - 7.0 inches', '7.1 - 10 inches', '11 - 12 inches', '13 - 15 inches', '15.6 inches', '17 inches', 'Under 4 inches']
  },
  {
    title: 'OS',
    options: ['Android', 'Apple iOS', 'Windows 8.1', 'Windows 10', 'Windows Mobile']
  },
  {
    title: 'Price',
    options: ['$101 - $200', '$201 - $300', '$301 - $400', '$401 - $500', '$501 - $700', '$701 - $1000', 'Above $1000', 'Under $100']
  },
  {
    title: 'RAM',
    options: ['1 GB', '2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB']
  }
];

export default function AdvancedFilters({ isOpen, selectedFilters = {}, onToggleFilter }) {
  if (!isOpen) return null;

  return (
    <div className="w-full bg-slate-100 dark:bg-[#1a2035] border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="grid grid-cols-1 gap-6">
        {FILTER_CATEGORIES.map((category) => (
          <div key={category.title}>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{category.title}</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {category.options.map((option) => {
                const isSelected = selectedFilters[category.title]?.includes(option);
                return (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => onToggleFilter && onToggleFilter(category.title, option)}
                      className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors select-none">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
