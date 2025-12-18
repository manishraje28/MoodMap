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
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        What are you in the mood for?
      </p>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            disabled={disabled}
            className={`
              group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              ${
                selectedMood === mood.id
                  ? `${mood.color} text-white`
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }
            `}
            aria-pressed={selectedMood === mood.id}
            aria-label={`Select ${mood.label} mood`}
          >
            <span className="text-base" role="img" aria-hidden="true">
              {mood.emoji}
            </span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
