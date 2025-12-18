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
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 dark:text-gray-500">Loading map...</div>
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
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500">Waiting for valid location...</div>
      </div>
    );
  }

  return <MapView {...props} />;
}
