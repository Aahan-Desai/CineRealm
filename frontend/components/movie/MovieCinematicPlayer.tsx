"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene, SceneBlock } from "@/types/scene";
import { getCharacterAccent } from "@/lib/utils/characterAccent";
import SceneReactionBar from "./SceneReactionBar";

function TypewriterText({
  text,
  enabled,
  resetKey,
}: {
  text: string;
  enabled: boolean;
  resetKey: string;
}) {
  const [visibleText, setVisibleText] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setVisibleText(text);
      return;
    }

    setVisibleText("");
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 14);

    return () => window.clearInterval(interval);
  }, [enabled, resetKey, text]);

  return <>{visibleText}</>;
}

const cinematicMoodStyles: Record<string, { shell: string; chip: string; panel: string }> = {
  tense: {
    shell: "border-[#E5484D]/30 bg-[radial-gradient(circle_at_top_left,rgba(229,72,77,0.18),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-[#E5484D]/35 bg-[#E5484D]/10 text-[#ffb1b3]",
    panel: "border-[#E5484D]/20 bg-[#120d0d]/80",
  },
  calm: {
    shell: "border-sky-400/25 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-sky-300/30 bg-sky-400/10 text-sky-200",
    panel: "border-sky-300/20 bg-sky-950/25",
  },
  chaos: {
    shell: "border-amber-400/25 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    panel: "border-amber-300/20 bg-amber-950/25",
  },
  romantic: {
    shell: "border-pink-400/25 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-pink-300/30 bg-pink-400/10 text-pink-200",
    panel: "border-pink-300/20 bg-pink-950/25",
  },
  mystery: {
    shell: "border-violet-400/25 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.16),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    panel: "border-violet-300/20 bg-violet-950/25",
  },
  action: {
    shell: "border-orange-400/25 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.16),transparent_34%),rgba(0,0,0,0.82)]",
    chip: "border-orange-300/30 bg-orange-400/10 text-orange-200",
    panel: "border-orange-300/20 bg-orange-950/25",
  },
};

function normalizeBlocks(scene: Scene): SceneBlock[] {
  if (scene.blocks?.length) return scene.blocks;
  if (!scene.scriptText) return [];
  return [
    {
      id: `${scene.id}-fallback-script`,
      type: "ACTION",
      content: scene.scriptText,
    },
  ];
}

export default function MovieCinematicPlayer({
  scenes,
}: {
  scenes: Scene[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(scenes.length - 1, 0)));
  }, [scenes]);

  const currentScene = scenes[activeIndex];
  const sceneBlocks = useMemo(() => (currentScene ? normalizeBlocks(currentScene) : []), [currentScene]);

  if (!currentScene) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10 text-center text-white/55">
        No scenes yet.
      </div>
    );
  }

  const moodKey = currentScene.mood?.toLowerCase() || "";
  const moodStyle = cinematicMoodStyles[moodKey];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-black/40 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff8d90]/80">
              Cinematic Focus
            </span>
            <p className="max-w-2xl text-sm text-white/55">
              Read scene by scene with a focused layout, soft transitions, and optional dialogue typewriter mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setTypewriterEnabled((prev) => !prev)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-110 active:scale-95 ${
                typewriterEnabled
                  ? "border-[#E5484D]/35 bg-[#E5484D]/15 text-[#ffb3b5]"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
              }`}
            >
              {typewriterEnabled ? "Typewriter On" : "Typewriter Off"}
            </button>

            <button
              type="button"
              disabled
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/35 cursor-not-allowed"
            >
              Soundscape Soon
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42 }}
            className={`rounded-[36px] border p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ${
              moodStyle
                ? `${moodStyle.shell}`
                : "border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(229,72,77,0.1),transparent_34%),rgba(0,0,0,0.82)]"
            }`}
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                    Act {currentScene.actNumber}
                  </span>
                  {moodStyle && currentScene.mood ? (
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${moodStyle.chip}`}>
                      {currentScene.mood}
                    </span>
                  ) : null}
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.34em] text-white/35">
                  Scene {activeIndex + 1} / {scenes.length}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                  {currentScene.title}
                </h3>
                <p className="text-sm uppercase tracking-[0.24em] text-white/40">
                  Focused reading mode
                </p>
              </div>

              <div className="space-y-4">
                {sceneBlocks.map((block, index) => (
                  (() => {
                    const speakerName = block.character?.name || "Unknown Voice";
                    const speakerAccent = getCharacterAccent(block.character?.id || speakerName);

                    return (
                  <motion.div
                    key={block.id || `${currentScene.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.08, 0.28) }}
                    className={`rounded-[28px] border p-5 md:p-6 ${
                      block.type === "DIALOGUE"
                        ? `bg-black/35 ${speakerAccent.glow}`
                        : moodStyle?.panel || "border-white/10 bg-white/[0.03]"
                    }`}
                    style={
                      block.type === "DIALOGUE"
                        ? {
                            borderColor: "rgba(255,255,255,0.14)",
                          }
                        : undefined
                    }
                  >
                    {block.type === "DIALOGUE" ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          {block.character?.avatarUrl ? (
                            <img
                              src={block.character.avatarUrl}
                              alt={speakerName}
                              className="mt-0.5 h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-black uppercase ${speakerAccent.avatar}`}>
                              {speakerName.slice(0, 1)}
                            </div>
                          )}
                          <div className="min-w-0 space-y-2">
                            <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${speakerAccent.name}`}>
                              {speakerName}
                            </p>
                            <p className="whitespace-pre-wrap text-base md:text-lg leading-8 text-foreground/92">
                              <TypewriterText
                                text={block.content}
                                enabled={typewriterEnabled}
                                resetKey={`${currentScene.id}-${block.id || index}`}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/48">
                          Action
                        </p>
                        <p className="whitespace-pre-wrap text-base md:text-lg leading-8 italic text-foreground/74">
                          {block.content}
                        </p>
                      </div>
                    )}
                  </motion.div>
                    );
                  })()
                ))}
              </div>

              <div className="border-t border-white/10 pt-2">
                <SceneReactionBar sceneId={currentScene.id} cinematic />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={activeIndex === 0}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-300 ease-in-out hover:bg-white/10 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous Scene
                </button>

                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                    Continue the experience
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => Math.min(prev + 1, scenes.length - 1))}
                  disabled={activeIndex === scenes.length - 1}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 ease-in-out hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Scene
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
