"use client";

import MovieScenes from "./MovieScenes";
import { Scene } from "@/types/scene";
import { StoryViewMode } from "./MovieStoryViewer";

export default function MovieActs({
  scenes,
  viewMode = "standard",
  progressiveReveal = false,
  maxUnlockedAct = 3,
  onUnlockNextAct,
}: {
  scenes: Scene[]
  viewMode?: StoryViewMode
  progressiveReveal?: boolean
  maxUnlockedAct?: number
  onUnlockNextAct?: () => void
}) {
  if (!scenes?.length) return null;

  const acts = [1, 2, 3];

  return (
    <div className="space-y-40">
      {acts.map((act) => {
        const actScenes = scenes.filter((s) => s.actNumber === act);
        if (actScenes.length === 0) return null;

        const isLocked = progressiveReveal && act > maxUnlockedAct;

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

            {isLocked ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center space-y-5">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white/65">
                  Locked Act
                </span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  Act {act} unlocks when you continue the story
                </h3>
                <p className="max-w-2xl mx-auto text-white/55">
                  Progressive Reveal is hiding this section for now. Unlock the next act when you are ready.
                </p>
                {onUnlockNextAct ? (
                  <button
                    type="button"
                    onClick={onUnlockNextAct}
                    className="rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95"
                  >
                    Unlock Act {act}
                  </button>
                ) : null}
              </div>
            ) : (
              <MovieScenes scenes={actScenes} viewMode={viewMode} />
            )}
          </div>
        );
      })}
    </div>
  );
}
