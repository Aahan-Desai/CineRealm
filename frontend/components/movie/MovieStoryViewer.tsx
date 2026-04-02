"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MovieActs from "./MovieActs";
import MovieCinematicPlayer from "./MovieCinematicPlayer";
import { Scene } from "@/types/scene";
import { getMovieProgress, saveMovieProgress } from "@/lib/movies";

export type StoryViewMode = "standard" | "cinematic";

export default function MovieStoryViewer({
  movieId,
  scenes,
}: {
  movieId: string;
  scenes: Scene[];
}) {
  const [viewMode, setViewMode] = useState<StoryViewMode>("standard");
  const [progressiveReveal, setProgressiveReveal] = useState(false);
  const [maxUnlockedAct, setMaxUnlockedAct] = useState(1);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(scenes[0]?.id ?? null);
  const [resumeSceneId, setResumeSceneId] = useState<string | null>(null);
  const [resumeTarget, setResumeTarget] = useState<{ sceneId: string; token: number } | null>(null);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const lastSavedSceneIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  const highestAct = useMemo(() => {
    if (!scenes.length) return 1;
    return Math.max(...scenes.map(scene => scene.actNumber));
  }, [scenes]);

  const orderedScenes = useMemo(
    () =>
      [...scenes].sort((a, b) => {
        if (a.actNumber !== b.actNumber) return a.actNumber - b.actNumber;
        return (a.sceneOrder ?? 0) - (b.sceneOrder ?? 0);
      }),
    [scenes]
  );

  const sceneLookup = useMemo(
    () =>
      new Map(
        orderedScenes.map((scene, index) => [
          scene.id,
          {
            ...scene,
            storyIndex: index + 1,
          },
        ])
      ),
    [orderedScenes]
  );

  useEffect(() => {
    if (!orderedScenes.length) return;
    setActiveSceneId((current) => current ?? orderedScenes[0].id);
  }, [orderedScenes]);

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

  const jumpToScene = (sceneId: string) => {
    const scene = sceneLookup.get(sceneId);
    if (!scene) return;

    setMaxUnlockedAct(prev => Math.max(prev, scene.actNumber));
    setResumeSceneId(sceneId);
    setActiveSceneId(sceneId);
    setResumeTarget({
      sceneId,
      token: Date.now(),
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      try {
        const progress = await getMovieProgress(movieId);
        if (cancelled) return;

        if (progress.sceneId && sceneLookup.has(progress.sceneId)) {
          const scene = sceneLookup.get(progress.sceneId)!;
          setResumeSceneId(progress.sceneId);
          setResumeLabel(`Resuming from Scene ${scene.storyIndex}: ${scene.title}`);
          setMaxUnlockedAct(prev => Math.max(prev, scene.actNumber));
          setActiveSceneId(progress.sceneId);
          setResumeTarget({
            sceneId: progress.sceneId,
            token: Date.now(),
          });
          lastSavedSceneIdRef.current = progress.sceneId;
        } else if (orderedScenes[0]) {
          setActiveSceneId(orderedScenes[0].id);
        }
      } catch {
        if (!cancelled && orderedScenes[0]) {
          setActiveSceneId(orderedScenes[0].id);
        }
      } finally {
        if (!cancelled) {
          setResumeLoaded(true);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [movieId, orderedScenes, sceneLookup]);

  useEffect(() => {
    if (!resumeLoaded || !activeSceneId) return;
    if (lastSavedSceneIdRef.current === activeSceneId) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveMovieProgress(movieId, activeSceneId);
        lastSavedSceneIdRef.current = activeSceneId;
        const scene = sceneLookup.get(activeSceneId);
        if (scene) {
          setResumeSceneId(activeSceneId);
          setResumeLabel(`Resuming from Scene ${scene.storyIndex}: ${scene.title}`);
        }
      } catch {
        // Ignore auth/no-progress failures and keep the experience uninterrupted.
      }
    }, 700);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [activeSceneId, movieId, resumeLoaded, sceneLookup]);

  const visibleScenes = useMemo(
    () =>
      scenes.filter(
        (scene) => scene.actNumber <= (progressiveReveal ? maxUnlockedAct : highestAct)
      ),
    [scenes, progressiveReveal, maxUnlockedAct, highestAct]
  );

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

        {resumeSceneId && resumeLabel ? (
          <div className="flex flex-col gap-3 rounded-[24px] border border-[#E5484D]/20 bg-[#130b0c] p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ff8d90]/80">
                Continue Watching
              </p>
              <p className="text-sm text-white/80">{resumeLabel}</p>
            </div>

            <button
              type="button"
              onClick={() => jumpToScene(resumeSceneId)}
              className="rounded-full border border-[#E5484D]/35 bg-[#E5484D]/15 px-4 py-2 text-sm font-semibold text-[#ffb3b5] transition-all duration-300 ease-in-out hover:brightness-110 active:scale-95"
            >
              Continue where you left off
            </button>
          </div>
        ) : null}
      </div>

      {viewMode === "cinematic" ? (
        <MovieCinematicPlayer
          scenes={visibleScenes}
          initialSceneId={resumeTarget?.sceneId ?? resumeSceneId}
          initialSceneToken={resumeTarget?.token}
          onActiveSceneChange={setActiveSceneId}
        />
      ) : (
        <MovieActs
          scenes={scenes}
          viewMode={viewMode}
          progressiveReveal={progressiveReveal}
          maxUnlockedAct={progressiveReveal ? maxUnlockedAct : highestAct}
          onUnlockNextAct={handleUnlockNextAct}
          activeSceneId={activeSceneId}
          targetScene={resumeTarget}
          onSceneVisible={setActiveSceneId}
        />
      )}
    </div>
  );
}
