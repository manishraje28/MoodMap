'use client';

import { RefreshCw } from 'lucide-react';

type StateType = 'no-location' | 'no-results' | 'error' | 'no-mood';

interface EmptyStateProps {
  type: StateType;
  message?: string;
  onRetry?: () => void;
}

export default function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const configs = {
    'no-location': {
      title: 'Location needed',
      description: message || 'Enable location access to find nearby places.',
    },
    'no-results': {
      title: 'Nothing found',
      description: message || 'No places match this mood nearby. Try a different one.',
    },
    'error': {
      title: 'Something went wrong',
      description: message || 'We had trouble loading places. Please try again.',
    },
    'no-mood': {
      title: 'Select a mood above',
      description: 'Pick how you are feeling to see nearby places.',
    },
  };

  const config = configs[type];

  return (
    <div className="py-12 text-center">
      <h3 className="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
        {config.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Try again
        </button>
      )}
    </div>
  );
}
