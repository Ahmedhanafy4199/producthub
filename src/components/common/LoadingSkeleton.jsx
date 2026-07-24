/**
 * LoadingSkeleton - animated skeleton placeholder for product cards
 * Shown while products are loading from the API
 */

// Single skeleton card
const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
    <div className="h-52 bg-slate-200 dark:bg-slate-700" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/5" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

// Grid of skeleton cards
const LoadingSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
