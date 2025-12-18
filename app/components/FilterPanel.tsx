'use client';

import { FilterState } from '../types';

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
  const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
    { value: 'score', label: 'Best' },
    { value: 'distance', label: 'Nearest' },
    { value: 'name', label: 'A–Z' },
  ];

  return (
    <div className="space-y-4">
      {/* Results count */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
        {resultsCount} {resultsCount === 1 ? 'place' : 'places'}
      </p>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Sort:</span>
        <div className="flex gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filters, sortBy: option.value })}
              className={`
                px-2 py-1 text-xs rounded transition-colors
                ${
                  filters.sortBy === option.value
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-neutral-500 dark:text-neutral-400">Max distance</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {filters.maxDistance >= 10 ? '10+ km' : `${filters.maxDistance.toFixed(1)} km`}
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max={Math.max(maxAvailableDistance, 10)}
          step="0.5"
          value={filters.maxDistance}
          onChange={(e) => onFilterChange({ ...filters, maxDistance: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Open Now */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Open now only</span>
        <button
          role="switch"
          aria-checked={filters.openNow}
          onClick={() => onFilterChange({ ...filters, openNow: !filters.openNow })}
          className={`
            relative w-8 h-5 rounded-full transition-colors
            ${filters.openNow ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-700'}
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full transition-transform shadow-sm
              ${filters.openNow ? 'translate-x-3' : 'translate-x-0'}
            `}
          />
        </button>
      </label>
    </div>
  );
}
