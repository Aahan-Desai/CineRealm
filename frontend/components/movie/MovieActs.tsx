import MovieScenes from "./MovieScenes";

export default function MovieActs({ scenes }: { scenes: any[] }) {
  if (!scenes?.length) return null;

  const acts = [1, 2, 3];

  return (
    <div className="space-y-40">
      {acts.map((act) => {
        const actScenes = scenes.filter((s) => s.actNumber === act);
        if (actScenes.length === 0) return null;

        return (
          <div key={act} className="space-y-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-px bg-primary/40 shrink-0" />
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60">Stage One</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">ACT {act}</h2>
              </div>
              <div className="w-12 h-px bg-primary/40 shrink-0" />
            </div>

            <MovieScenes scenes={actScenes} />
          </div>
        );
      })}
    </div>
  );
}
