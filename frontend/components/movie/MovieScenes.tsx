"use client";

import { useState } from "react";
import { Scene } from "@/types/scene";
import { StoryViewMode } from "./MovieStoryViewer";

const moodStyles: Record<string, { shell: string; chip: string; label: string }> = {
  tense: {
    shell: "border-[#E5484D]/25 bg-[#130b0b]",
    chip: "border-[#E5484D]/35 bg-[#E5484D]/10 text-[#ff9d9f]",
    label: "Tense",
  },
  calm: {
    shell: "border-sky-400/20 bg-sky-950/20",
    chip: "border-sky-300/30 bg-sky-400/10 text-sky-200",
    label: "Calm",
  },
  chaos: {
    shell: "border-amber-400/25 bg-amber-950/20",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    label: "Chaos",
  },
  romantic: {
    shell: "border-pink-400/25 bg-pink-950/20",
    chip: "border-pink-300/30 bg-pink-400/10 text-pink-200",
    label: "Romantic",
  },
  mystery: {
    shell: "border-violet-400/20 bg-violet-950/20",
    chip: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    label: "Mystery",
  },
  action: {
    shell: "border-orange-400/25 bg-orange-950/20",
    chip: "border-orange-300/30 bg-orange-400/10 text-orange-200",
    label: "Action",
  },
};

export default function MovieScenes({
  scenes,
  viewMode = "standard",
}: {
  scenes: Scene[]
  viewMode?: StoryViewMode
}) {
  if (!scenes?.length) return null;

  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, string>>({});

  const revealOutcome = (sceneId: string, choiceId: string, outcomeText: string) => {
    setSelectedOutcomes(prev => ({
      ...prev,
      [`${sceneId}:${choiceId}`]: outcomeText
    }));
  };

  return (
    <div className="space-y-12">
      {scenes.map((scene, idx) => {
        const moodKey = scene.mood?.toLowerCase() || "";
        const moodStyle = moodStyles[moodKey];
        const isCinematic = viewMode === "cinematic";

        return (
          <div
            key={scene.id}
            className={`group relative rounded-[32px] p-8 md:p-12 transition-colors ${
              isCinematic
                ? `${moodStyle?.shell || "bg-white/0.02 border border-white/10"} shadow-[0_20px_80px_rgba(0,0,0,0.25)]`
                : "bg-white/0.01 border border-white/5 hover:bg-white/0.02"
            }`}
          >
            <div className={`absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${
              isCinematic ? "text-white/35" : "text-primary/20 group-hover:text-primary"
            }`}>
              Scene {idx + 1}
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                {isCinematic && moodStyle ? (
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${moodStyle.chip}`}>
                      {moodStyle.label}
                    </span>
                  </div>
                ) : null}

                <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                  {scene.title}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${isCinematic ? "bg-[#ff8d90]" : "bg-primary"}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    isCinematic ? "text-white/55" : "text-muted-foreground"
                  }`}>
                    Action & Dialogue
                  </span>
                </div>

                {scene.blocks?.length ? (
                  <div className="space-y-3">
                    {scene.blocks.map((block, blockIndex) => (
                      <div
                        key={block.id || `${scene.id}-${blockIndex}`}
                        className={`p-6 rounded-2xl border ${
                          block.type === "DIALOGUE"
                            ? isCinematic
                              ? "bg-black/30 border-[#E5484D]/25"
                              : "bg-[#120d0d] border-[#E5484D]/20"
                            : isCinematic
                              ? "bg-white/[0.03] border-white/10"
                              : "bg-black/20 border-white/5"
                        }`}
                      >
                        {block.type === "DIALOGUE" ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                                isCinematic
                                  ? "border-[#ffb3b5]/40 bg-[#E5484D]/15 text-[#ffd0d1]"
                                  : "border-[#E5484D]/30 bg-[#E5484D]/10 text-[#ff8d90]"
                              }`}>
                                {block.character?.name || "Unknown Voice"}
                              </span>
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                isCinematic ? "text-white/55" : "text-primary/70"
                              }`}>
                                Dialogue
                              </span>
                            </div>

                            <p className={`font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                              isCinematic ? "text-foreground/90" : "text-foreground/80"
                            }`}>
                              <span className={`font-black ${
                                isCinematic ? "text-[#ffd0d1]" : "text-[#ffb3b5]"
                              }`}>
                                {(block.character?.name || "Unknown Voice") + ":"}{" "}
                              </span>
                              {block.content}
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className={`mb-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                              isCinematic ? "text-white/50" : "text-primary/70"
                            }`}>
                              Action
                            </div>
                            <p className={`font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                              isCinematic ? "text-foreground/80" : "text-foreground/70"
                            }`}>
                              {block.content}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`font-mono text-sm md:text-base leading-relaxed p-6 rounded-2xl border whitespace-pre-wrap ${
                    isCinematic
                      ? `${moodStyle?.shell || "bg-black/25 border-white/10"} text-foreground/80`
                      : "text-foreground/70 bg-black/20 border-white/5"
                  }`}>
                    {scene.scriptText || "No script text provided for this scene."}
                  </p>
                )}

                {scene.choices?.length ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff8d90]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8d90]/80">
                        Choices
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {scene.choices.map(choice => {
                        const outcomeKey = `${scene.id}:${choice.id}`;
                        const isRevealed = Boolean(selectedOutcomes[outcomeKey]);

                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => revealOutcome(scene.id, choice.id, choice.outcomeText)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
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
                      {scene.choices.map(choice => {
                        const outcomeKey = `${scene.id}:${choice.id}`;
                        const outcome = selectedOutcomes[outcomeKey];
                        if (!outcome) return null;

                        return (
                          <div
                            key={outcomeKey}
                            className={`rounded-2xl border p-5 ${
                              isCinematic
                                ? `${moodStyle?.shell || "bg-[#120d0d] border-[#E5484D]/20"}`
                                : "border-[#E5484D]/20 bg-[#120d0d]"
                            }`}
                          >
                            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8d90]/80">
                              Outcome
                            </div>
                            <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                              {outcome}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
