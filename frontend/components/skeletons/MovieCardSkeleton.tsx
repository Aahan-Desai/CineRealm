export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#262A35]/50 bg-[#1A1D26] overflow-hidden">
      <div className="relative aspect-2/3">
        <div className="absolute inset-0 bg-linear-to-br from-[#151821] via-[#1A1D26] to-[#0F1115]" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F1115]/95 via-[#0F1115]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 pr-24">
          <div className="h-5 w-3/4 rounded-lg bg-[#0F1115]/40" />

          <div className="mt-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#0F1115]/40" />
            <div className="min-w-0 space-y-2">
              <div className="h-4 w-28 rounded-lg bg-[#0F1115]/40" />
              <div className="h-3 w-16 rounded-lg bg-[#0F1115]/40" />
            </div>
          </div>
        </div>

        {/* Like button placeholder */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-[#262A35]/50 bg-[#151821]/30 px-3 py-1.5">
          <div className="h-4 w-4 rounded-md bg-[#0F1115]/40" />
          <div className="h-4 w-10 rounded-md bg-[#0F1115]/40" />
        </div>
      </div>
    </div>
  );
}
