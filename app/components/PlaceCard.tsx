'use client';

import { Place } from '../types';
import { formatDistance, calculateBearing, getDirection } from '../utils/distance';
import { MapPin, Clock, Phone, Globe, Navigation, Wifi, Coffee, Utensils, Star } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect?: (place: Place) => void;
  userLat?: number;
  userLng?: number;
}

export default function PlaceCard({
  place,
  isSelected = false,
  onSelect,
  userLat,
  userLng,
}: PlaceCardProps) {
  const name = place.tags?.name || 'Unnamed Place';
  const amenity = place.tags?.amenity || '';
  const cuisine = place.tags?.cuisine;
  const phone = place.tags?.phone;
  const website = place.tags?.website;
  const openingHours = place.tags?.opening_hours;
  const hasWifi = place.tags?.internet_access === 'wlan' || place.tags?.internet_access === 'yes';
  const hasOutdoorSeating = place.tags?.outdoor_seating === 'yes';

  const direction = userLat && userLng
    ? getDirection(calculateBearing({ lat: userLat, lng: userLng }, { lat: place.lat, lng: place.lon }))
    : null;

  const getAmenityIcon = () => {
    switch (amenity) {
      case 'cafe':
        return <Coffee className="w-4 h-4" />;
      case 'restaurant':
      case 'fast_food':
        return <Utensils className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getAmenityLabel = () => {
    const labels: Record<string, string> = {
      cafe: 'Café',
      restaurant: 'Restaurant',
      fast_food: 'Fast Food',
      bar: 'Bar',
      pub: 'Pub',
      library: 'Library',
      park: 'Park',
    };
    return labels[amenity] || amenity.replace(/_/g, ' ');
  };

  return (
    <div
      id={`place-${place.id}`}
      onClick={() => onSelect?.(place)}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-2xl p-5 
        shadow-sm hover:shadow-xl dark:shadow-gray-900/50
        border-2 transition-all duration-300 cursor-pointer
        hover:-translate-y-1
        ${isSelected
          ? 'border-indigo-500 dark:border-indigo-400 ring-4 ring-indigo-500/20'
          : 'border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
        }
      `}
    >
      {/* Score Badge */}
      {place.score !== undefined && place.score >= 80 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-current" />
          Top Pick
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {name}
          </h3>

          {/* Amenity & Cuisine */}
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {getAmenityIcon()}
              {getAmenityLabel()}
            </span>
            {cuisine && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                • {cuisine.split(';')[0]}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mt-3">
            {hasWifi && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3" />
                WiFi
              </span>
            )}
            {hasOutdoorSeating && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                ☀️ Outdoor
              </span>
            )}
            {openingHours && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {openingHours.length > 20 ? 'Hours available' : openingHours}
              </span>
            )}
          </div>

          {/* Contact Links */}
          <div className="flex items-center gap-3 mt-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Phone className="w-3 h-3" />
                Call
              </a>
            )}
            {website && (
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Globe className="w-3 h-3" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Distance */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-lg font-bold text-indigo-600 dark:text-indigo-400">
            <Navigation className="w-4 h-4" />
            {formatDistance(place.distance)}
          </div>
          {direction && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {direction}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
