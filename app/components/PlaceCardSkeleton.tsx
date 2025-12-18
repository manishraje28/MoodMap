export default function PlaceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Name skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
          
          {/* Amenity skeleton */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          
          {/* Features skeleton */}
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-18" />
          </div>
        </div>
        
        {/* Distance skeleton */}
        <div className="flex flex-col items-end gap-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export function PlaceCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  );
}
