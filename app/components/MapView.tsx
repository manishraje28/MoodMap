'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, Place } from '../types';
import { formatDistance } from '../utils/distance';

// Helper to validate coordinates
function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

// Fix for default marker icons in Next.js
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const placeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedPlaceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  userLocation: Location;
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  searchRadius?: number;
}

function MapController({ 
  userLocation, 
  selectedPlace,
  validPlaces = []
}: { 
  userLocation: Location; 
  selectedPlace: Place | null;
  validPlaces?: Place[];
}) {
  const map = useMap();
  const initializedRef = useRef(false);
  
  // Fly to user location on mount (only once)
  useEffect(() => {
    if (initializedRef.current) return;
    
    const lat = userLocation?.lat;
    const lng = userLocation?.lng;
    
    if (isValidCoordinate(lat, lng)) {
      try {
        map.setView([lat as number, lng as number], 14);
        initializedRef.current = true;
      } catch (e) {
        console.error('Failed to set map view:', e);
      }
    }
  }, [map, userLocation]);

  // Fly to selected place - only if place exists in validPlaces
  useEffect(() => {
    if (!selectedPlace) return;
    
    // Verify this place exists in our validated list
    const validatedPlace = validPlaces.find(p => p.id === selectedPlace.id);
    if (!validatedPlace) {
      console.warn('Selected place not found in validPlaces:', selectedPlace.id);
      return;
    }
    
    // Use coordinates from the validated place, not the selectedPlace prop
    const lat = validatedPlace.lat;
    const lon = validatedPlace.lon;
    
    // Final safety check
    if (!isValidCoordinate(lat, lon)) {
      console.warn('Invalid coordinates for place:', validatedPlace.id, lat, lon);
      return;
    }
    
    try {
      map.flyTo([lat, lon], 16, { duration: 1 });
    } catch (e) {
      console.error('Failed to fly to place:', e);
    }
  }, [map, selectedPlace, validPlaces]);
  
  return null;
}

// Default center (World center) - will be overridden once we have valid location
const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

export default function MapView({
  userLocation,
  places,
  selectedPlace,
  onPlaceSelect,
  searchRadius = 2000,
}: MapViewProps) {
  const mapRef = useRef<L.Map>(null);

  // Validate user location
  const hasValidLocation = isValidCoordinate(userLocation?.lat, userLocation?.lng);
  
  // Get safe center coordinates
  const centerLat = hasValidLocation ? userLocation.lat : DEFAULT_CENTER[0];
  const centerLng = hasValidLocation ? userLocation.lng : DEFAULT_CENTER[1];
  const initialZoom = hasValidLocation ? 14 : DEFAULT_ZOOM;
  
  // Filter places with valid coordinates
  const validPlaces = places.filter((place) => 
    isValidCoordinate(place.lat, place.lon)
  );

  const scrollToCard = (placeId: number) => {
    const element = document.getElementById(`place-${placeId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Show error state if location is invalid
  if (!hasValidLocation) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Waiting for location...</p>
          <p className="text-sm">Please allow location access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map controller for flying to locations */}
        <MapController 
          userLocation={userLocation} 
          selectedPlace={selectedPlace} 
          validPlaces={validPlaces}
        />
        
        {/* Search radius circle - only if valid location */}
        {hasValidLocation && (
          <Circle
            center={[centerLat, centerLng]}
            radius={searchRadius}
            pathOptions={{
              color: '#6366f1',
              fillColor: '#6366f1',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5',
            }}
          />
        )}
        
        {/* User location marker - only if valid location */}
        {hasValidLocation && (
          <Marker position={[centerLat, centerLng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>📍 You are here</strong>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Place markers - only render valid ones */}
        {validPlaces.map((place) => {
          // Extra inline validation before rendering
          if (!isValidCoordinate(place.lat, place.lon)) return null;
          
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={selectedPlace?.id === place.id ? selectedPlaceIcon : placeIcon}
              eventHandlers={{
                click: () => {
                  // Only call onPlaceSelect if coordinates are valid
                  if (isValidCoordinate(place.lat, place.lon)) {
                    onPlaceSelect(place);
                    scrollToCard(place.id);
                  }
                },
              }}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <strong className="block mb-1">{place.tags?.name || 'Unnamed Place'}</strong>
                  <span className="text-sm text-gray-600">
                    {formatDistance(place.distance)} away
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 text-xs z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Your location</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-gray-600 dark:text-gray-400">Places</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">Selected</span>
        </div>
      </div>
    </div>
  );
}
