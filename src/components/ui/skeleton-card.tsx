import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function SkeletonCard({ 
  className = "", 
  lines = 3, 
  showHeader = true,
  showFooter = false 
}: SkeletonCardProps) {
  return (
    <div className={`rounded-2xl border border-border/50 p-6 space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-3" 
            style={{ width: `${85 - i * 15}%` }} 
          />
        ))}
      </div>

      {showFooter && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      )}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

export function SkeletonAnalysis() {
  return (
    <div className="space-y-6">
      {/* Score skeleton */}
      <div className="rounded-2xl border border-border/50 p-8 flex flex-col items-center">
        <Skeleton className="w-32 h-32 rounded-full mb-4" />
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Details skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard lines={4} showHeader />
        <SkeletonCard lines={4} showHeader />
      </div>

      {/* Skills skeleton */}
      <div className="rounded-2xl border border-border/50 p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonResume() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Sections */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-muted/30 p-3 flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-6 rounded-full ml-auto" />
        </div>
      ))}
    </div>
  );
}
