import MovieScenes from "./MovieScenes";
import { Scene } from "@/types/scene";
import { StoryViewMode } from "./MovieStoryViewer";

export default function MovieActs({
  scenes,
  viewMode = "standard",
}: {
  scenes: Scene[]
  viewMode?: StoryViewMode
}) {
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
              <div className={`w-12 h-px shrink-0 ${viewMode === "cinematic" ? "bg-[#ff8d90]/60" : "bg-primary/40"}`} />
              <div className="space-y-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${viewMode === "cinematic" ? "text-[#ff8d90]/80" : "text-primary/60"}`}>
                  {viewMode === "cinematic" ? "Cinematic Stage" : "Stage One"}
                </span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">ACT {act}</h2>
              </div>
              <div className={`w-12 h-px shrink-0 ${viewMode === "cinematic" ? "bg-[#ff8d90]/60" : "bg-primary/40"}`} />
            </div>

            <MovieScenes scenes={actScenes} viewMode={viewMode} />
          </div>
        );
      })}
    </div>
  );
}
