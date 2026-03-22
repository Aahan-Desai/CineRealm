"use client";

export default function MovieCardSkeleton() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#262A35]/50 bg-[#1A1D26] animate-pulse">
      
      {/* Poster skeleton */}
      <div className="aspect-2/3 w-full bg-[#151821]" />

      {/* Content */}
      <div className="p-4 space-y-3">
        
        {/* Title */}
        <div className="h-4 w-3/4 bg-[#262A35] rounded" />

        {/* User row */}
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-[#262A35]" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-[#262A35] rounded" />
            <div className="h-3 w-1/4 bg-[#262A35] rounded" />
          </div>
        </div>

      </div>
    </div>
  );
}