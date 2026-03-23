export default function MovieSynopsis({ synopsis }: { synopsis?: string }) {
  if (!synopsis) return null;

  return (
    <div
      className="max-w-4xl mx-auto space-y-8"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary/60">The Synopsis</h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-2xl md:text-3xl font-medium text-foreground/90 leading-[1.6] text-center tracking-tight first-letter:text-5xl first-letter:font-black first-letter:mr-1 first-letter:text-primary">
        {synopsis}
      </p>

      <div className="flex justify-center pt-4">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
      </div>
    </div>
  );
}
