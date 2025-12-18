'use client';

import { FilterState } from '../types';
import { ArrowUpDown, Navigation, Type, Sparkles, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxAvailableDistance: number;
  resultsCount: number;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  maxAvailableDistance,
  resultsCount,
}: FilterPanelProps) {
  const sortOptions: { value: FilterState['sortBy']; label: string; icon: React.ReactNode }[] = [
    { value: 'score', label: 'Best Match', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'distance', label: 'Nearest', icon: <Navigation className="w-4 h-4" /> },
    { value: 'name', label: 'Name', icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-gray-900 dark:text-white">Filters</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {resultsCount} {resultsCount === 1 ? 'place' : 'places'} found
        </span>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
          <ArrowUpDown className="w-4 h-4 inline mr-1" />
          Sort by
        </label>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filters, sortBy: option.value })}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  filters.sortBy === option.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Slider */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-between">
          <span>Max distance</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {filters.maxDistance >= 10 ? '10+ km' : `${filters.maxDistance.toFixed(1)} km`}
          </span>
        </label>
        <input
          type="range"
          min="0.5"
          max={Math.max(maxAvailableDistance, 10)}
          step="0.5"
          value={filters.maxDistance}
          onChange={(e) =>
            onFilterChange({ ...filters, maxDistance: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0.5 km</span>
          <span>{Math.max(maxAvailableDistance, 10).toFixed(0)} km</span>
        </div>
      </div>

      {/* Open Now Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="openNow" className="text-sm text-gray-600 dark:text-gray-400">
          Show open now only
        </label>
        <button
          id="openNow"
          role="switch"
          aria-checked={filters.openNow}
          onClick={() => onFilterChange({ ...filters, openNow: !filters.openNow })}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${filters.openNow ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform
              ${filters.openNow ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
}
