"use client";

import { useState } from "react";
import MovieActs from "./MovieActs";
import { Scene } from "@/types/scene";

export type StoryViewMode = "standard" | "cinematic";

export default function MovieStoryViewer({ scenes }: { scenes: Scene[] }) {
  const [viewMode, setViewMode] = useState<StoryViewMode>("standard");

  return (
    <div className="space-y-8">
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
            richer dialogue framing, and more immersive scene presentation.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setViewMode("standard")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "cinematic"
                ? "bg-[#E5484D] text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Cinematic View
          </button>
        </div>
      </div>

      <MovieActs scenes={scenes} viewMode={viewMode} />
    </div>
  );
}
