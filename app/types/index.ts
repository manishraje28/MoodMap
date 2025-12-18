// Location types
export interface Location {
  lat: number;
  lng: number;
}

// Mood types
export type MoodType = 'work' | 'date' | 'quick' | 'budget' | 'chill' | 'adventure';

export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  tags: string[];
  description: string;
  color: string;
}

// Place types from Overpass API
export interface PlaceTags {
  name?: string;
  amenity?: string;
  cuisine?: string;
  opening_hours?: string;
  phone?: string;
  website?: string;
  'addr:street'?: string;
  'addr:city'?: string;
  'addr:housenumber'?: string;
  wheelchair?: string;
  outdoor_seating?: string;
  internet_access?: string;
  takeaway?: string;
  delivery?: string;
  [key: string]: string | undefined;
}

export interface RawPlace {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags?: PlaceTags;
}

export interface Place extends RawPlace {
  distance: number;
  score?: number;
}

// Filter types
export interface FilterState {
  maxDistance: number;
  sortBy: 'distance' | 'name' | 'score';
  openNow: boolean;
}

// API response types
export interface OverpassResponse {
  elements: RawPlace[];
}

// Cache types
export interface CacheEntry {
  places: Place[];
  timestamp: number;
  location: Location;
  mood: MoodType;
}

// Component prop types
export interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect?: (place: Place) => void;
}

export interface MapViewProps {
  userLocation: Location;
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
}

export interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxAvailableDistance: number;
}

// Error types
export interface AppError {
  type: 'location' | 'api' | 'network' | 'unknown';
  message: string;
  retryable: boolean;
}
