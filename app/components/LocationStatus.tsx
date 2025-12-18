'use client';

import { Location } from '../types';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationStatusProps {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function LocationStatus({
  location,
  isLoading,
  error,
  onRetry,
}: LocationStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Getting your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 rounded-xl">
        <MapPin className="w-4 h-4 text-red-500" />
        <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
        <button
          onClick={onRetry}
          className="ml-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl">
        <MapPin className="w-4 h-4 text-emerald-500" />
        <span className="text-emerald-600 dark:text-emerald-400 text-sm">
          Location found: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </span>
      </div>
    );
  }

  return null;
}
