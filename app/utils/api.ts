import { Location, Place, RawPlace, MoodType, OverpassResponse, CacheEntry } from '../types';
import { MOOD_CONFIGS, DEFAULT_SEARCH_RADIUS, MAX_SEARCH_RADIUS, MIN_RESULTS_THRESHOLD, CACHE_DURATION, API_TIMEOUT, MAX_RESULTS } from '../constants';
import { calculateDistance } from './distance';

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();

function getCacheKey(location: Location, mood: MoodType): string {
  return `${location.lat.toFixed(4)}_${location.lng.toFixed(4)}_${mood}`;
}

function getFromCache(location: Location, mood: MoodType): Place[] | null {
  const key = getCacheKey(location, mood);
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  const isNearby = calculateDistance(
    location.lat,
    location.lng,
    entry.location.lat,
    entry.location.lng
  ) < 0.1; // 100 meters tolerance
  
  if (isExpired || !isNearby) {
    cache.delete(key);
    return null;
  }
  
  return entry.places;
}

function saveToCache(location: Location, mood: MoodType, places: Place[]): void {
  const key = getCacheKey(location, mood);
  cache.set(key, {
    places,
    timestamp: Date.now(),
    location,
    mood,
  });
}

export function clearCache(): void {
  cache.clear();
}

function buildOverpassQuery(tags: string[], location: Location, radius: number): string {
  const tagQueries = tags
    .map((tag) => `node["amenity"="${tag}"](around:${radius},${location.lat},${location.lng});`)
    .join('\n  ');
  
  return `
[out:json][timeout:${API_TIMEOUT}];
(
  ${tagQueries}
);
out tags center ${MAX_RESULTS};
`;
}

function calculatePlaceScore(place: Place, mood: MoodType): number {
  let score = 100;
  
  // Distance penalty (closer is better)
  score -= place.distance * 10;
  
  // Name bonus (named places are usually better established)
  if (place.tags?.name) {
    score += 15;
  }
  
  // Amenity relevance
  const primaryTag = MOOD_CONFIGS[mood].tags[0];
  if (place.tags?.amenity === primaryTag) {
    score += 20;
  }
  
  // Features bonuses
  if (place.tags?.internet_access === 'wlan' || place.tags?.internet_access === 'yes') {
    if (mood === 'work') score += 25;
  }
  
  if (place.tags?.outdoor_seating === 'yes') {
    if (mood === 'date' || mood === 'chill') score += 15;
  }
  
  if (place.tags?.wheelchair === 'yes') {
    score += 5; // Accessibility bonus
  }
  
  return Math.max(0, score);
}

async function fetchFromOverpass(
  location: Location,
  tags: string[],
  radius: number
): Promise<RawPlace[]> {
  const query = buildOverpassQuery(tags, location, radius);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), (API_TIMEOUT + 5) * 1000);
  
  try {
    const response = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      body: query,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: OverpassResponse = await response.json();
    return data.elements;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
}

export async function fetchPlaces(
  location: Location,
  mood: MoodType,
  useCache = true
): Promise<Place[]> {
  // Check cache first
  if (useCache) {
    const cached = getFromCache(location, mood);
    if (cached) {
      console.log('Returning cached results');
      return cached;
    }
  }
  
  const moodConfig = MOOD_CONFIGS[mood];
  let radius = DEFAULT_SEARCH_RADIUS;
  let results: RawPlace[] = [];
  
  // Try with increasing radius if too few results
  while (radius <= MAX_SEARCH_RADIUS) {
    results = await fetchFromOverpass(location, moodConfig.tags, radius);
    
    if (results.length >= MIN_RESULTS_THRESHOLD) {
      break;
    }
    
    // Try with fallback tags
    if (results.length < MIN_RESULTS_THRESHOLD && moodConfig.tags.length > 1) {
      const fallbackResults = await fetchFromOverpass(
        location,
        moodConfig.tags.slice(1),
        radius
      );
      
      // Merge and deduplicate
      const existingIds = new Set(results.map((r) => r.id));
      results = [...results, ...fallbackResults.filter((r) => !existingIds.has(r.id))];
    }
    
    if (results.length >= MIN_RESULTS_THRESHOLD) {
      break;
    }
    
    radius += 1000; // Increase by 1km
  }
  
  // Helper to validate coordinates
  const isValidCoord = (lat: unknown, lon: unknown): boolean => {
    if (typeof lat !== 'number' || typeof lon !== 'number') return false;
    if (Number.isNaN(lat) || Number.isNaN(lon)) return false;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
    return true;
  };
  
  // Process results - filter out invalid coordinates
  const places: Place[] = results
    .filter((rawPlace) => isValidCoord(rawPlace.lat, rawPlace.lon))
    .map((rawPlace) => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        rawPlace.lat,
        rawPlace.lon
      );
    
      const place: Place = {
        ...rawPlace,
        distance,
      };
    
      place.score = calculatePlaceScore(place, mood);
    
      return place;
    })
    .filter((place) => !Number.isNaN(place.distance) && Number.isFinite(place.distance));
  
  // Sort by score by default
  places.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  
  // Cache results
  saveToCache(location, mood, places);
  
  return places;
}

export function sortPlaces(
  places: Place[],
  sortBy: 'distance' | 'name' | 'score'
): Place[] {
  const sorted = [...places];
  
  switch (sortBy) {
    case 'distance':
      sorted.sort((a, b) => a.distance - b.distance);
      break;
    case 'name':
      sorted.sort((a, b) => {
        const nameA = a.tags?.name || 'zzz';
        const nameB = b.tags?.name || 'zzz';
        return nameA.localeCompare(nameB);
      });
      break;
    case 'score':
      sorted.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      break;
  }
  
  return sorted;
}

export function filterPlaces(
  places: Place[],
  maxDistance: number,
  openNow: boolean
): Place[] {
  return places.filter((place) => {
    if (place.distance > maxDistance) {
      return false;
    }
    
    if (openNow && place.tags?.opening_hours) {
      // Basic check - this could be enhanced with a proper opening hours parser
      // For now, we just filter out places with known closed status
      const hours = place.tags.opening_hours.toLowerCase();
      if (hours.includes('closed')) {
        return false;
      }
    }
    
    return true;
  });
}
