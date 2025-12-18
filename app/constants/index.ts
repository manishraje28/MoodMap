import { MoodConfig, MoodType } from '../types';

// Muted, earthy color palette - no gradients, just solid colors
export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  work: {
    id: 'work',
    label: 'Work',
    emoji: '☕',
    tags: ['cafe', 'library', 'coworking_space'],
    description: 'Quiet spots with WiFi',
    color: 'bg-stone-700',
  },
  date: {
    id: 'date',
    label: 'Date',
    emoji: '💕',
    tags: ['restaurant', 'bar', 'cafe'],
    description: 'Romantic atmosphere',
    color: 'bg-rose-700',
  },
  quick: {
    id: 'quick',
    label: 'Quick Bite',
    emoji: '🍔',
    tags: ['fast_food', 'food_court', 'cafe'],
    description: 'Fast and convenient',
    color: 'bg-amber-700',
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    emoji: '💰',
    tags: ['fast_food', 'cafe', 'restaurant'],
    description: 'Affordable options',
    color: 'bg-emerald-700',
  },
  chill: {
    id: 'chill',
    label: 'Chill',
    emoji: '🧘',
    tags: ['park', 'garden', 'cafe'],
    description: 'Relaxing spots',
    color: 'bg-sky-700',
  },
  adventure: {
    id: 'adventure',
    label: 'Adventure',
    emoji: '🎯',
    tags: ['attraction', 'museum', 'arts_centre'],
    description: 'Places to explore',
    color: 'bg-violet-700',
  },
};

export const DEFAULT_SEARCH_RADIUS = 2000;
export const MAX_SEARCH_RADIUS = 10000;
export const MIN_RESULTS_THRESHOLD = 3;
export const CACHE_DURATION = 5 * 60 * 1000;
export const API_TIMEOUT = 20;
export const MAX_RESULTS = 30;

export const APP_CONFIG = {
  name: 'MoodMap',
  tagline: 'Places that fit how you feel',
  description: 'Find nearby spots based on your mood. Simple. Private. Free.',
  version: '1.0.0',
  author: 'MoodMap',
  github: 'https://github.com/manishraje28/MoodMap',
};
