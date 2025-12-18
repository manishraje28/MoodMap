export default function PlaceCardSkeleton() {
  return (
    <div className="py-4 border-b border-neutral-150 dark:border-neutral-800 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Name */}
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-2" />
          {/* Details */}
          <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function PlaceCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  );
}
