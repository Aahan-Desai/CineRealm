"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Scene } from "@/types/scene";
import { StoryViewMode } from "./MovieStoryViewer";
import { getCharacterAccent } from "@/lib/utils/characterAccent";
import SceneReactionBar from "./SceneReactionBar";
import CharacterAvatar from "@/components/characters/CharacterAvatar";

const moodStyles: Record<
  string,
  {
    shell: string;
    chip: string;
    label: string;
    panel: string;
    glow: string;
  }
> = {
  tense: {
    shell: "border-[#E5484D]/25 bg-[linear-gradient(145deg,rgba(36,12,14,0.96),rgba(18,9,10,0.88))]",
    chip: "border-[#E5484D]/35 bg-[#E5484D]/10 text-[#ff9d9f]",
    label: "Tense",
    panel: "bg-[#1a0e10]/90 border-[#E5484D]/20",
    glow: "shadow-[0_0_0_1px_rgba(229,72,77,0.12),0_18px_45px_rgba(84,16,18,0.28)]",
  },
  calm: {
    shell: "border-sky-400/20 bg-[linear-gradient(145deg,rgba(11,23,35,0.96),rgba(8,16,26,0.88))]",
    chip: "border-sky-300/30 bg-sky-400/10 text-sky-200",
    label: "Calm",
    panel: "bg-sky-950/20 border-sky-300/20",
    glow: "shadow-[0_0_0_1px_rgba(125,211,252,0.1),0_18px_45px_rgba(8,23,40,0.28)]",
  },
  chaos: {
    shell: "border-amber-400/25 bg-[linear-gradient(145deg,rgba(39,24,6,0.96),rgba(24,15,3,0.9))]",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    label: "Chaos",
    panel: "bg-amber-950/20 border-amber-300/20",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.1),0_18px_45px_rgba(52,30,4,0.3)]",
  },
  romantic: {
    shell: "border-pink-400/25 bg-[linear-gradient(145deg,rgba(36,10,24,0.96),rgba(22,8,16,0.9))]",
    chip: "border-pink-300/30 bg-pink-400/10 text-pink-200",
    label: "Romantic",
    panel: "bg-pink-950/20 border-pink-300/20",
    glow: "shadow-[0_0_0_1px_rgba(244,114,182,0.1),0_18px_45px_rgba(56,14,35,0.28)]",
  },
  mystery: {
    shell: "border-violet-400/20 bg-[linear-gradient(145deg,rgba(22,12,34,0.96),rgba(14,9,22,0.9))]",
    chip: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    label: "Mystery",
    panel: "bg-violet-950/20 border-violet-300/20",
    glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.1),0_18px_45px_rgba(24,14,42,0.28)]",
  },
  action: {
    shell: "border-orange-400/25 bg-[linear-gradient(145deg,rgba(42,18,8,0.96),rgba(26,12,4,0.9))]",
    chip: "border-orange-300/30 bg-orange-400/10 text-orange-200",
    label: "Action",
    panel: "bg-orange-950/20 border-orange-300/20",
    glow: "shadow-[0_0_0_1px_rgba(251,146,60,0.1),0_18px_45px_rgba(56,24,8,0.3)]",
  },
};

const sceneVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: Math.min(index * 0.06, 0.24),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function hasScriptText(scene: Scene) {
  return typeof scene.scriptText === "string" && scene.scriptText.trim().length > 0;
}

export default function MovieScenes({
  scenes,
  viewMode = "standard",
  activeSceneId,
  targetScene,
  onSceneVisible,
}: {
  scenes: Scene[];
  viewMode?: StoryViewMode;
  activeSceneId?: string | null;
  targetScene?: { sceneId: string; token: number } | null;
  onSceneVisible?: (sceneId: string) => void;
}) {
  if (!scenes?.length) return null;

  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetScene || !containerRef.current) return;

    const targetElement = containerRef.current.querySelector<HTMLElement>(
      `[data-scene-id="${targetScene.sceneId}"]`
    );

    if (!targetElement) return;

    window.setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }, [targetScene]);

  const revealOutcome = (sceneId: string, choiceId: string, outcomeText: string) => {
    setSelectedOutcomes((prev) => ({
      ...prev,
      [`${sceneId}:${choiceId}`]: outcomeText,
    }));
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {scenes.map((scene, idx) => {
        const moodKey = scene.mood?.toLowerCase() || "";
        const moodStyle = moodStyles[moodKey];
        const isCinematic = viewMode === "cinematic";
        const isActiveScene = activeSceneId === scene.id;
        const showScriptPassage = hasScriptText(scene);

        return (
          <motion.div
            key={scene.id}
            data-scene-id={scene.id}
            variants={sceneVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -2, scale: 1.01 }}
            onViewportEnter={() => onSceneVisible?.(scene.id)}
            className={`group relative overflow-hidden rounded-[28px] p-4 md:p-5 transition-all duration-300 ease-in-out ${
              moodStyle
                ? `border ${moodStyle.shell} ${moodStyle.glow} ${
                    isActiveScene ? "ring-1 ring-[#ffb3b5]/50" : ""
                  }`
                : isCinematic
                  ? `border border-white/12 bg-[linear-gradient(145deg,rgba(17,17,20,0.96),rgba(9,10,14,0.92))] shadow-[0_18px_45px_rgba(0,0,0,0.3)] ${
                      isActiveScene ? "ring-1 ring-[#ffb3b5]/50" : ""
                    }`
                  : `border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] hover:border-white/15 hover:shadow-[0_14px_36px_rgba(0,0,0,0.24)] ${
                      isActiveScene ? "ring-1 ring-white/20 border-white/20" : ""
                    }`
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)] opacity-70" />
            {moodStyle ? (
              <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_30%)]" />
            ) : null}

            <div
              className={`absolute right-5 top-4 text-[10px] font-black uppercase tracking-[0.34em] transition-colors ${
                isCinematic ? "text-white/35" : "text-primary/25 group-hover:text-primary/70"
              }`}
            >
              Scene {idx + 1}
            </div>

            <div className="relative z-10 space-y-5 max-w-3xl">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {moodStyle ? (
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${moodStyle.chip}`}
                    >
                      {moodStyle.label}
                    </span>
                  ) : null}
                  {isCinematic ? (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                      {scene.blocks?.length ? "Structured Scene" : "Screenplay Passage"}
                    </span>
                  ) : null}
                </div>

                <h4 className="pr-24 text-2xl md:text-3xl font-black tracking-tighter text-white">
                  {scene.title}
                </h4>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className={`h-1.5 w-1.5 rounded-full ${isCinematic ? "bg-[#ff8d90]" : "bg-primary"}`} />
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                      isCinematic ? "text-white/55" : "text-muted-foreground"
                    }`}
                  >
                    Action & Dialogue
                  </span>
                </div>

                {scene.blocks?.length ? (
                  <div className="space-y-3">
                    {showScriptPassage ? (
                      <div
                        className={`rounded-[24px] border p-4 md:p-5 transition-all duration-300 ease-in-out ${
                          isCinematic
                            ? `${moodStyle?.panel || "border-white/12 bg-[linear-gradient(135deg,rgba(229,72,77,0.1),rgba(255,255,255,0.03))]"}`
                            : "border-white/6 bg-black/20"
                        }`}
                      >
                        {isCinematic ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-px w-10 bg-[#ff8d90]/60" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb3b5]/80">
                                Cinematic Passage
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-lg md:text-[1.45rem] leading-[1.9] tracking-[0.01em] text-foreground/90">
                              {scene.scriptText}
                            </p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm md:text-base leading-7 text-foreground/72">
                            {scene.scriptText}
                          </p>
                        )}
                      </div>
                    ) : null}

                    {scene.blocks.map((block, blockIndex) => (
                      (() => {
                        const speakerName = block.character?.name || "Unknown Voice";
                        const speakerAccent = getCharacterAccent(block.character?.id || speakerName);

                        return (
                      <motion.div
                        key={block.id || `${scene.id}-${blockIndex}`}
                        custom={blockIndex}
                        variants={blockVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className={`rounded-2xl border p-4 md:p-5 transition-all duration-300 ease-in-out ${
                          block.type === "DIALOGUE"
                            ? isCinematic
                              ? `bg-black/30 ${speakerAccent.glow}`
                              : `bg-[#120d0d]/85 ${speakerAccent.glow}`
                            : isCinematic
                              ? "border-white/10 bg-white/0.03"
                              : "border-white/6 bg-black/20"
                        }`}
                        style={
                          block.type === "DIALOGUE"
                            ? {
                                borderColor: "rgba(255,255,255,0.12)",
                              }
                            : undefined
                        }
                      >
                        {block.type === "DIALOGUE" ? (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <CharacterAvatar
                                name={speakerName}
                                avatarUrl={block.character?.avatarUrl}
                                role={block.character?.role}
                                seed={block.character?.id || speakerName}
                                className="mt-0.5 h-8 w-8 shrink-0"
                                initialsClassName="text-[11px]"
                              />
                              <div className="min-w-0 space-y-2">
                                <p
                                  className={`text-[11px] font-black uppercase tracking-[0.28em] ${speakerAccent.name}`}
                                >
                                  {speakerName}
                                </p>
                                <p
                                  className={`whitespace-pre-wrap text-sm md:text-base leading-7 ${
                                    isCinematic ? "text-foreground/92" : "text-foreground/82"
                                  }`}
                                >
                                  {block.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p
                              className={`text-[10px] font-black uppercase tracking-[0.24em] ${
                                isCinematic ? "text-white/48" : "text-primary/65"
                              }`}
                            >
                              Action
                            </p>
                            <p
                              className={`whitespace-pre-wrap text-sm md:text-base leading-7 italic ${
                                isCinematic ? "text-foreground/74" : "text-foreground/66"
                              }`}
                            >
                              {block.content}
                            </p>
                          </div>
                        )}
                      </motion.div>
                        );
                      })()
                    ))}
                  </div>
                ) : (
                  <div
                    className={`rounded-[24px] border p-4 md:p-5 transition-all duration-300 ease-in-out ${
                      isCinematic
                        ? `${moodStyle?.panel || "border-white/12 bg-[linear-gradient(135deg,rgba(229,72,77,0.1),rgba(255,255,255,0.03))]"}`
                        : "border-white/6 bg-black/20"
                    }`}
                  >
                    {isCinematic ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-px w-10 bg-[#ff8d90]/60" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb3b5]/80">
                            Cinematic Passage
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-lg md:text-[1.45rem] leading-[1.9] tracking-[0.01em] text-foreground/90">
                          {scene.scriptText || "No script text provided for this scene."}
                        </p>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm md:text-base leading-7 text-foreground/72">
                        {scene.scriptText || "No script text provided for this scene."}
                      </p>
                    )}
                  </div>
                )}

                {scene.choices?.length ? (
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#ff8d90]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8d90]/80">
                        Choices
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {scene.choices.map((choice) => {
                        const outcomeKey = `${scene.id}:${choice.id}`;
                        const isRevealed = Boolean(selectedOutcomes[outcomeKey]);

                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => revealOutcome(scene.id, choice.id, choice.outcomeText)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-110 active:scale-95 ${
                              isRevealed
                                ? "border-[#E5484D]/40 bg-[#E5484D]/15 text-[#ffb3b5]"
                                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {choice.text}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                      {scene.choices.map((choice) => {
                        const outcomeKey = `${scene.id}:${choice.id}`;
                        const outcome = selectedOutcomes[outcomeKey];
                        if (!outcome) return null;

                        return (
                          <div
                            key={outcomeKey}
                            className={`rounded-2xl border p-5 ${
                              isCinematic
                                ? `${moodStyle?.panel || "bg-[#120d0d] border-[#E5484D]/20"}`
                                : "border-[#E5484D]/20 bg-[#120d0d]"
                            }`}
                          >
                            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8d90]/80">
                              Outcome
                            </div>
                            <p className="whitespace-pre-wrap text-sm md:text-base leading-7 text-foreground/80">
                              {outcome}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <SceneReactionBar sceneId={scene.id} cinematic={isCinematic} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
