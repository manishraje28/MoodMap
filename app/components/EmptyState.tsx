'use client';

import { MapPinOff, WifiOff, AlertCircle, RefreshCw, SearchX, Compass } from 'lucide-react';

type StateType = 'no-location' | 'no-results' | 'error' | 'no-mood';

interface EmptyStateProps {
  type: StateType;
  message?: string;
  onRetry?: () => void;
}

export default function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const configs = {
    'no-location': {
      icon: <MapPinOff className="w-16 h-16" />,
      title: 'Location Required',
      description: message || 'Please enable location access to find nearby places.',
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    'no-results': {
      icon: <SearchX className="w-16 h-16" />,
      title: 'No Places Found',
      description: message || 'We couldn\'t find any places matching your mood in this area. Try a different mood or expand your search radius.',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    'error': {
      icon: <WifiOff className="w-16 h-16" />,
      title: 'Something Went Wrong',
      description: message || 'We had trouble fetching places. Please check your connection and try again.',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    'no-mood': {
      icon: <Compass className="w-16 h-16" />,
      title: 'Select Your Mood',
      description: 'Choose a mood above to discover places that match how you feel.',
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  };

  const config = configs[type];

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-3xl ${config.bgColor}`}>
      <div className={`${config.iconColor} mb-4`}>
        {config.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
        {config.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
        {config.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
