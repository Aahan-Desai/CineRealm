"use client";

import { useState } from "react";
import { Scene } from "@/types/scene";

export default function MovieScenes({ scenes }: { scenes: Scene[] }) {
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
      {scenes.map((scene, idx) => (
        <div
          key={scene.id}
          className="group relative bg-white/0.01 border border-white/5 rounded-[32px] p-8 md:p-12 hover:bg-white/0.02 transition-colors"
        >
          <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 group-hover:text-primary transition-colors">
            Scene {idx + 1}
          </div>

          <div className="space-y-6 max-w-2xl">
            <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
              {scene.title}
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Action & Dialogue</span>
              </div>
              {scene.blocks?.length ? (
                <div className="space-y-3">
                  {scene.blocks.map((block, blockIndex) => (
                    <div
                      key={block.id || `${scene.id}-${blockIndex}`}
                      className={`p-6 rounded-2xl border ${
                        block.type === "DIALOGUE"
                          ? "bg-[#120d0d] border-[#E5484D]/20"
                          : "bg-black/20 border-white/5"
                      }`}
                    >
                      {block.type === "DIALOGUE" ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-[#E5484D]/30 bg-[#E5484D]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#ff8d90]">
                              {block.character?.name || "Unknown Voice"}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                              Dialogue
                            </span>
                          </div>

                          <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                            <span className="font-black text-[#ffb3b5]">
                              {(block.character?.name || "Unknown Voice") + ":"}{" "}
                            </span>
                            {block.content}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                            Action
                          </div>
                          <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/70 whitespace-pre-wrap">
                            {block.content}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/70 bg-black/20 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">
                  {scene.scriptText || "No script text provided for this scene."}
                </p>
              )}

              {scene.choices?.length ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff8d90]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8d90]/80">Choices</span>
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
                          className="rounded-2xl border border-[#E5484D]/20 bg-[#120d0d] p-5"
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
      ))}
    </div>
  );
}
