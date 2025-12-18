'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
import { Map, List, RefreshCw } from 'lucide-react';

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
  // State
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

  // Fetch user location on mount
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

  // Fetch places when mood changes
  const handleFetchPlaces = useCallback(async () => {
    if (!location || !mood) return;
    
    setLoading(true);
    setError(null);
    setSelectedPlace(null);
    
    try {
      const results = await fetchPlaces(location, mood);
      setPlaces(results);
      
      if (results.length > 0) {
        // Set max distance filter based on results
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

  // Auto-fetch when mood is selected
  useEffect(() => {
    if (mood && location) {
      handleFetchPlaces();
    }
  }, [mood, location, handleFetchPlaces]);

  // Filter and sort places
  const processedPlaces = (() => {
    let result = filterPlaces(places, filters.maxDistance, filters.openNow);
    result = sortPlaces(result, filters.sortBy);
    return result;
  })();

  // Scroll to discover section
  const scrollToDiscover = () => {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle place selection
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
        {/* Hero Section */}
        <HeroSection onGetStarted={scrollToDiscover} />

        {/* Main Content */}
        <section
          id="discover"
          ref={discoverRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Location Status */}
          <div className="mb-8">
            <LocationStatus
              location={location}
              isLoading={locationLoading}
              error={locationError}
              onRetry={fetchLocation}
            />
          </div>

          {/* Mood Selector */}
          <div className="mb-8">
            <MoodSelector
              selectedMood={mood}
              onMoodSelect={setMood}
              disabled={!location || locationLoading}
            />
          </div>

          {/* Results Section */}
          {mood && (
            <div className="space-y-6">
              {/* View Toggle & Refresh */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nearby Places
                </h2>
                
                <div className="flex items-center gap-3">
                  {/* Refresh Button */}
                  <button
                    onClick={handleFetchPlaces}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-gray-700 shadow-sm'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">List</span>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        viewMode === 'map'
                          ? 'bg-white dark:bg-gray-700 shadow-sm'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                      <span className="hidden sm:inline">Map</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <EmptyState
                  type="error"
                  message={error}
                  onRetry={handleFetchPlaces}
                />
              )}

              {/* Loading State */}
              {loading && <PlaceCardSkeletonGrid count={6} />}

              {/* Results */}
              {!loading && !error && (
                <>
                  {places.length === 0 ? (
                    <EmptyState type="no-results" />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Filters & Cards */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Map View (Mobile/Tablet) */}
                        {viewMode === 'map' && isValidLocation(location) && (
                          <div className="lg:hidden">
                            <MapWrapper
                              userLocation={location}
                              places={processedPlaces}
                              selectedPlace={selectedPlace}
                              onPlaceSelect={handlePlaceSelect}
                              searchRadius={DEFAULT_SEARCH_RADIUS}
                            />
                          </div>
                        )}

                        {/* Place Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No places match your current filters. Try adjusting them.
                          </div>
                        )}
                      </div>

                      {/* Sidebar (Desktop) */}
                      <div className="space-y-4">
                        {/* Filters */}
                        <FilterPanel
                          filters={filters}
                          onFilterChange={setFilters}
                          maxAvailableDistance={maxAvailableDistance}
                          resultsCount={processedPlaces.length}
                        />

                        {/* Map View (Desktop) */}
                        {isValidLocation(location) && (
                          <div className="hidden lg:block sticky top-24">
                            <MapWrapper
                              userLocation={location}
                              places={processedPlaces}
                              selectedPlace={selectedPlace}
                              onPlaceSelect={handlePlaceSelect}
                              searchRadius={DEFAULT_SEARCH_RADIUS}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* No Mood Selected State */}
          {!mood && !loading && (
            <EmptyState type="no-mood" />
          )}
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why PlaceSense?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A simple, free, and privacy-focused way to discover places around you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Mood-Based Discovery',
                  description: 'Find places that match how you feel - from work cafes to date spots.',
                },
                {
                  icon: '🗺️',
                  title: 'Interactive Map',
                  description: 'See all places on an interactive map with real-time distance calculation.',
                },
                {
                  icon: '🔒',
                  title: 'Privacy First',
                  description: 'Your location stays on your device. No tracking, no accounts needed.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}