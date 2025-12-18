'use client';

import dynamic from 'next/dynamic';
import { Location, Place } from '../types';

// Helper to validate coordinates
function isValidLocation(location: Location | null | undefined): location is Location {
  if (!location) return false;
  const { lat, lng } = location;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Dynamically import MapView to prevent SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
      <span className="text-sm text-neutral-400 dark:text-neutral-500">Loading map...</span>
    </div>
  ),
});

interface MapWrapperProps {
  userLocation: Location;
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  searchRadius?: number;
}

export default function MapWrapper(props: MapWrapperProps) {
  // Don't render map if location is invalid
  if (!isValidLocation(props.userLocation)) {
    return (
      <div className="w-full aspect-[4/3] rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <span className="text-sm text-neutral-400 dark:text-neutral-500">Waiting for location...</span>
      </div>
    );
  }

  return <MapView {...props} />;
}
