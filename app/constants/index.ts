import { MoodConfig, MoodType } from '../types';

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  work: {
    id: 'work',
    label: 'Work',
    emoji: '☕',
    tags: ['cafe', 'library', 'coworking_space'],
    description: 'Quiet spots with WiFi for productivity',
    color: 'from-amber-500 to-orange-600',
  },
  date: {
    id: 'date',
    label: 'Date',
    emoji: '💕',
    tags: ['restaurant', 'bar', 'cafe'],
    description: 'Romantic places for quality time',
    color: 'from-pink-500 to-rose-600',
  },
  quick: {
    id: 'quick',
    label: 'Quick Bite',
    emoji: '🍔',
    tags: ['fast_food', 'food_court', 'cafe'],
    description: 'Fast and convenient food options',
    color: 'from-yellow-500 to-amber-600',
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    emoji: '💰',
    tags: ['fast_food', 'cafe', 'restaurant'],
    description: 'Affordable places that save money',
    color: 'from-green-500 to-emerald-600',
  },
  chill: {
    id: 'chill',
    label: 'Chill',
    emoji: '🧘',
    tags: ['park', 'garden', 'cafe'],
    description: 'Relaxing spots to unwind',
    color: 'from-blue-500 to-cyan-600',
  },
  adventure: {
    id: 'adventure',
    label: 'Adventure',
    emoji: '🎯',
    tags: ['attraction', 'museum', 'arts_centre'],
    description: 'Exciting places to explore',
    color: 'from-purple-500 to-violet-600',
  },
};

export const DEFAULT_SEARCH_RADIUS = 2000; // meters
export const MAX_SEARCH_RADIUS = 10000; // meters
export const MIN_RESULTS_THRESHOLD = 3;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const API_TIMEOUT = 20; // seconds
export const MAX_RESULTS = 30;

export const APP_CONFIG = {
  name: 'PlaceSense',
  tagline: 'Discover places that match your mood',
  description: 'Find the perfect nearby spot based on how you feel. Whether you need a quiet cafe to work, a romantic restaurant for a date, or a quick bite on the go.',
  version: '1.0.0',
  author: 'PlaceSense Team',
  github: 'https://github.com/manishraje28/MoodMap',
};
