'use client';

import { Place } from '../types';
import { formatDistance, calculateBearing, getDirection } from '../utils/distance';
import { Clock, Phone, ExternalLink } from 'lucide-react';

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
    <article
      id={`place-${place.id}`}
      onClick={() => onSelect?.(place)}
      className={`
        group py-4 border-b border-neutral-150 dark:border-neutral-800 cursor-pointer transition-colors
        ${isSelected ? 'bg-neutral-100 dark:bg-neutral-800/50 -mx-4 px-4' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-4 px-4'}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Name and type */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline underline-offset-2">
              {name}
            </h3>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">
              {getAmenityLabel()}
            </span>
          </div>

          {/* Details row */}
          <div className="mt-1.5 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            {/* Distance */}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {formatDistance(place.distance)}
              {direction && <span className="ml-1 font-normal">{direction}</span>}
            </span>

            {/* Cuisine */}
            {cuisine && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span>{cuisine.split(';')[0]}</span>
              </>
            )}

            {/* Features - subtle */}
            {hasWifi && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span>WiFi</span>
              </>
            )}
            {hasOutdoorSeating && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span>Outdoor</span>
              </>
            )}
          </div>

          {/* Hours if available */}
          {openingHours && (
            <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {openingHours.length > 30 ? 'Hours available' : openingHours}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {phone && (
            <a
              href={`tel:${phone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              title="Website"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
