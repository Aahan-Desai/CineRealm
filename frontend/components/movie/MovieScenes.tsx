"use client";

import { useState } from "react";
import { Scene } from "@/types/scene";
import { StoryViewMode } from "./MovieStoryViewer";

const moodStyles: Record<string, { shell: string; chip: string; label: string; panel: string }> = {
  tense: {
    shell: "border-[#E5484D]/25 bg-[#130b0b]",
    chip: "border-[#E5484D]/35 bg-[#E5484D]/10 text-[#ff9d9f]",
    label: "Tense",
    panel: "bg-[#1a0e10] border-[#E5484D]/20",
  },
  calm: {
    shell: "border-sky-400/20 bg-sky-950/20",
    chip: "border-sky-300/30 bg-sky-400/10 text-sky-200",
    label: "Calm",
    panel: "bg-sky-950/20 border-sky-300/20",
  },
  chaos: {
    shell: "border-amber-400/25 bg-amber-950/20",
    chip: "border-amber-300/30 bg-amber-400/10 text-amber-200",
    label: "Chaos",
    panel: "bg-amber-950/20 border-amber-300/20",
  },
  romantic: {
    shell: "border-pink-400/25 bg-pink-950/20",
    chip: "border-pink-300/30 bg-pink-400/10 text-pink-200",
    label: "Romantic",
    panel: "bg-pink-950/20 border-pink-300/20",
  },
  mystery: {
    shell: "border-violet-400/20 bg-violet-950/20",
    chip: "border-violet-300/30 bg-violet-400/10 text-violet-200",
    label: "Mystery",
    panel: "bg-violet-950/20 border-violet-300/20",
  },
  action: {
    shell: "border-orange-400/25 bg-orange-950/20",
    chip: "border-orange-300/30 bg-orange-400/10 text-orange-200",
    label: "Action",
    panel: "bg-orange-950/20 border-orange-300/20",
  },
};

const reactionOptions = [
  { id: "fire", label: "Fire", icon: "Fire" },
  { id: "shock", label: "Shock", icon: "Shock" },
  { id: "heart", label: "Heart", icon: "Heart" },
];

export default function MovieScenes({
  scenes,
  viewMode = "standard",
}: {
  scenes: Scene[]
  viewMode?: StoryViewMode
}) {
  if (!scenes?.length) return null;

  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, string>>({});
  const [sceneReactions, setSceneReactions] = useState<Record<string, string>>({});

  const revealOutcome = (sceneId: string, choiceId: string, outcomeText: string) => {
    setSelectedOutcomes(prev => ({
      ...prev,
      [`${sceneId}:${choiceId}`]: outcomeText
    }));
  };

  const reactToScene = (sceneId: string, reactionId: string) => {
    setSceneReactions(prev => ({
      ...prev,
      [sceneId]: prev[sceneId] === reactionId ? "" : reactionId
    }));
  };

  return (
    <div className="space-y-12">
      {scenes.map((scene, idx) => {
        const moodKey = scene.mood?.toLowerCase() || "";
        const moodStyle = moodStyles[moodKey];
        const isCinematic = viewMode === "cinematic";
        const selectedReaction = sceneReactions[scene.id];

        return (
          <div
            key={scene.id}
            className={`group relative rounded-[32px] p-8 md:p-12 transition-all duration-300 ${
              isCinematic
                ? `${moodStyle?.shell || "border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(229,72,77,0.12),transparent_35%),rgba(255,255,255,0.03)] border"} shadow-[0_20px_80px_rgba(0,0,0,0.35)]`
                : "bg-white/0.01 border border-white/5 hover:bg-white/0.02"
            }`}
          >
            <div className={`absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${
              isCinematic ? "text-white/35" : "text-primary/20 group-hover:text-primary"
            }`}>
              Scene {idx + 1}
            </div>

            <div className="space-y-6 max-w-3xl">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {isCinematic && moodStyle ? (
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${moodStyle.chip}`}>
                      {moodStyle.label}
                    </span>
                  ) : null}
                  {isCinematic ? (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/60">
                      {scene.blocks?.length ? "Structured Scene" : "Screenplay Passage"}
                    </span>
                  ) : null}
                </div>

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
                  <div
                    className={`rounded-[28px] border p-6 md:p-8 ${
                      isCinematic
                        ? `${moodStyle?.panel || "bg-[linear-gradient(135deg,rgba(229,72,77,0.12),rgba(255,255,255,0.03))] border-white/12"}`
                        : "bg-black/20 border-white/5"
                    }`}
                  >
                    {isCinematic ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-px w-10 bg-[#ff8d90]/60" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb3b5]/80">
                            Cinematic Passage
                          </span>
                        </div>
                        <p className="text-lg md:text-2xl leading-[1.9] tracking-[0.01em] text-foreground/90 whitespace-pre-wrap">
                          {scene.scriptText || "No script text provided for this scene."}
                        </p>
                      </div>
                    ) : (
                      <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/70 whitespace-pre-wrap">
                        {scene.scriptText || "No script text provided for this scene."}
                      </p>
                    )}
                  </div>
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
                                ? `${moodStyle?.panel || "bg-[#120d0d] border-[#E5484D]/20"}`
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

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
                      Scene Reactions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {reactionOptions.map(option => {
                      const isActive = selectedReaction === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => reactToScene(scene.id, option.id)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            isActive
                              ? "border-[#E5484D]/40 bg-[#E5484D]/15 text-[#ffb3b5]"
                              : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                          }`}
                        >
                          {option.icon}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
