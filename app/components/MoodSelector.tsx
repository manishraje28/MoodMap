'use client';

import { MoodType } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
  disabled = false,
}: MoodSelectorProps) {
  const moods = Object.values(MOOD_CONFIGS);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            disabled={disabled}
            className={`
              relative group p-4 rounded-2xl border-2 transition-all duration-300
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
              ${
                selectedMood === mood.id
                  ? `bg-gradient-to-br ${mood.color} border-transparent text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }
            `}
            aria-pressed={selectedMood === mood.id}
            aria-label={`Select ${mood.label} mood`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl" role="img" aria-hidden="true">
                {mood.emoji}
              </span>
              <span
                className={`font-medium text-sm ${
                  selectedMood === mood.id
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {mood.label}
              </span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {mood.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
