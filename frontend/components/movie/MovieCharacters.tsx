import { Character } from "@/types/character";

export default function MovieCharacters({ characters }: { characters: Character[] }) {
  if (!characters?.length) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Cast</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {characters.map((char) => (
          <div
            key={char.id}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-6 transition-all hover:bg-white/[0.05]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,72,77,0.12),transparent_35%)] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex gap-5">
              <div className="w-24 h-32 md:w-28 md:h-36 shrink-0 rounded-[22px] overflow-hidden border border-white/10 bg-black/20">
                <img
                  src={char.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${char.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={char.name}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                    {char.name}
                  </p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {char.actorName || "Uncast Role"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                    {char.role || "Supporting"}
                  </span>
                  {char.traits ? (
                    <span className="inline-flex items-center rounded-full border border-[#E5484D]/20 bg-[#E5484D]/10 px-3 py-1 text-[11px] font-semibold text-[#ffb3b5]">
                      {char.traits}
                    </span>
                  ) : null}
                </div>

                <p className="text-sm leading-relaxed text-white/60">
                  {char.shortBio || "A defining presence in the story, carrying the emotional weight of each turning point."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
