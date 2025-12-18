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
      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
        <span>Finding your location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="w-3.5 h-3.5 text-red-500" strokeWidth={1.5} />
        <span className="text-red-600 dark:text-red-400">{error}</span>
        <button
          onClick={onRetry}
          className="ml-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (location) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
        <span>
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </span>
      </div>
    );
  }

  return null;
}
