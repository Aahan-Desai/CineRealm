"use client";

import { useMemo, useState } from "react";
import MovieActs from "./MovieActs";
import MovieCinematicPlayer from "./MovieCinematicPlayer";
import { Scene } from "@/types/scene";

export type StoryViewMode = "standard" | "cinematic";

export default function MovieStoryViewer({ scenes }: { scenes: Scene[] }) {
  const [viewMode, setViewMode] = useState<StoryViewMode>("standard");
  const [progressiveReveal, setProgressiveReveal] = useState(false);
  const [maxUnlockedAct, setMaxUnlockedAct] = useState(1);

  const highestAct = useMemo(() => {
    if (!scenes.length) return 1;
    return Math.max(...scenes.map(scene => scene.actNumber));
  }, [scenes]);

  const handleProgressiveToggle = () => {
    setProgressiveReveal(prev => {
      const next = !prev;
      if (!next) {
        setMaxUnlockedAct(highestAct);
      } else {
        setMaxUnlockedAct(1);
      }
      return next;
    });
  };

  const handleUnlockNextAct = () => {
    setMaxUnlockedAct(prev => Math.min(prev + 1, highestAct));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">
              Story Mode
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              Experience The Story
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-white/55">
              Standard keeps the current reading flow. Cinematic adds mood-driven styling,
              stronger text treatment, richer dialogue framing, and a more immersive scene presentation.
            </p>
          </div>

          <div className="inline-flex items-center rounded-full border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setViewMode("standard")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95 ${
                viewMode === "standard"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Standard View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cinematic")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95 ${
                viewMode === "cinematic"
                  ? "bg-[#E5484D] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Cinematic View
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Progressive Reveal</p>
            <p className="text-sm text-white/50">
              Lock later acts until you choose to continue the story.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleProgressiveToggle}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95 ${
                progressiveReveal
                  ? "border-[#E5484D]/35 bg-[#E5484D]/15 text-[#ffb3b5]"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
              }`}
            >
              {progressiveReveal ? "Progressive Reveal On" : "Progressive Reveal Off"}
            </button>

            {progressiveReveal && maxUnlockedAct < highestAct ? (
              <button
                type="button"
                onClick={handleUnlockNextAct}
                className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95"
              >
                Unlock Next Act
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {viewMode === "cinematic" ? (
        <MovieCinematicPlayer
          scenes={scenes.filter((scene) => scene.actNumber <= (progressiveReveal ? maxUnlockedAct : highestAct))}
        />
      ) : (
        <MovieActs
          scenes={scenes}
          viewMode={viewMode}
          progressiveReveal={progressiveReveal}
          maxUnlockedAct={progressiveReveal ? maxUnlockedAct : highestAct}
          onUnlockNextAct={handleUnlockNextAct}
        />
      )}
    </div>
  );
}
