'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Navbar,
  Footer,
  HeroSection,
  MoodSelector,
  PlaceCard,
  PlaceCardSkeletonGrid,
  FilterPanel,
  EmptyState,
  LocationStatus,
  MapWrapper,
} from './components';
import { Location, Place, MoodType, FilterState } from './types';
import { getUserLocation, fetchPlaces, sortPlaces, filterPlaces } from './utils';
import { DEFAULT_SEARCH_RADIUS } from './constants';
import { Map, LayoutList, RotateCw } from 'lucide-react';

// Helper to validate location
function isValidLocation(loc: Location | null): loc is Location {
  if (!loc) return false;
  const { lat, lng } = loc;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [mood, setMood] = useState<MoodType | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const [filters, setFilters] = useState<FilterState>({
    maxDistance: 10,
    sortBy: 'score',
    openNow: false,
  });

  const discoverRef = useRef<HTMLDivElement>(null);

  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const loc = await getUserLocation();
      setLocation(loc);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleFetchPlaces = useCallback(async () => {
    if (!location || !mood) return;
    
    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    
    try {
      const results = await fetchPlaces(location, mood);
      setPlaces(results);
      
      if (results.length > 0) {
        const maxDist = Math.max(...results.map((p) => p.distance));
        setFilters((prev) => ({ ...prev, maxDistance: Math.ceil(maxDist) + 1 }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [location, mood]);

  useEffect(() => {
    if (mood && location) {
      handleFetchPlaces();
    }
  }, [mood, location, handleFetchPlaces]);

  const processedPlaces = (() => {
    let result = filterPlaces(places, filters.maxDistance, filters.openNow);
    result = sortPlaces(result, filters.sortBy);
    return result;
  })();

  const scrollToDiscover = () => {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    if (viewMode === 'list') {
      setViewMode('map');
    }
  };

  const maxAvailableDistance = places.length > 0
    ? Math.max(...places.map((p) => p.distance))
    : 10;

  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        <HeroSection onGetStarted={scrollToDiscover} />

        <section
          id="discover"
          ref={discoverRef}
          className="max-w-5xl mx-auto px-4 sm:px-6 py-12"
        >
          {/* Location Status */}
          <div className="mb-6">
            <LocationStatus
              location={location}
              isLoading={locationLoading}
              error={locationError}
              onRetry={fetchLocation}
            />
          </div>

          {/* Mood Selector */}
          <div className="mb-10">
            <MoodSelector
              selectedMood={mood}
              onMoodSelect={setMood}
              disabled={!location || locationLoading}
            />
          </div>

          {/* Results */}
          {mood && (
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  Nearby places
                </h2>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchPlaces}
                    disabled={loading}
                    className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                  </button>
                  
                  <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                      title="List view"
                    >
                      <LayoutList className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 transition-colors ${
                        viewMode === 'map'
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                      title="Map view"
                    >
                      <Map className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <EmptyState type="error" message={error} onRetry={handleFetchPlaces} />
              )}

              {/* Loading */}
              {loading && <PlaceCardSkeletonGrid count={4} />}

              {/* Results content */}
              {!loading && !error && (
                <>
                  {places.length === 0 ? (
                    <EmptyState type="no-results" />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Main content */}
                      <div className="lg:col-span-8">
                        {/* Map (when map view selected) */}
                        {viewMode === 'map' && isValidLocation(location) && (
                          <div className="mb-6">
                            <MapWrapper
                              userLocation={location}
                              places={processedPlaces}
                              selectedPlace={selectedPlace}
                              onPlaceSelect={handlePlaceSelect}
                              searchRadius={DEFAULT_SEARCH_RADIUS}
                            />
                          </div>
                        )}

                        {/* Place list */}
                        <div>
                          {processedPlaces.map((place) => (
                            <PlaceCard
                              key={place.id}
                              place={place}
                              isSelected={selectedPlace?.id === place.id}
                              onSelect={handlePlaceSelect}
                              userLat={location?.lat}
                              userLng={location?.lng}
                            />
                          ))}
                        </div>

                        {processedPlaces.length === 0 && places.length > 0 && (
                          <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                            No places match your filters.
                          </p>
                        )}
                      </div>

                      {/* Sidebar - filters */}
                      <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-20">
                          <FilterPanel
                            filters={filters}
                            onFilterChange={setFilters}
                            maxAvailableDistance={maxAvailableDistance}
                            resultsCount={processedPlaces.length}
                          />
                        </div>
                      </aside>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* No mood selected */}
          {!mood && !loading && (
            <EmptyState type="no-mood" />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}