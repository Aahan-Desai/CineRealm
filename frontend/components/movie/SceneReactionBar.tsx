"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSceneReactions, reactToScene } from "@/lib/scenes";
import { SceneReactionSummary, SceneReactionType } from "@/types/scene";

const reactionOptions: Array<{
  type: SceneReactionType;
  icon: string;
  label: string;
}> = [
  { type: "like", icon: "👍", label: "Like" },
  { type: "wow", icon: "😲", label: "Wow" },
  { type: "fire", icon: "🔥", label: "Fire" },
  { type: "funny", icon: "😂", label: "Funny" },
  { type: "sad", icon: "💔", label: "Sad" },
];

const emptyCounts: Record<SceneReactionType, number> = {
  like: 0,
  wow: 0,
  fire: 0,
  funny: 0,
  sad: 0,
};

function normalizeSummary(sceneId: string, summary?: Partial<SceneReactionSummary>): SceneReactionSummary {
  return {
    sceneId,
    counts: {
      like: summary?.counts?.like ?? 0,
      wow: summary?.counts?.wow ?? 0,
      fire: summary?.counts?.fire ?? 0,
      funny: summary?.counts?.funny ?? 0,
      sad: summary?.counts?.sad ?? 0,
    },
    userReactions: summary?.userReactions ?? [],
  };
}

export default function SceneReactionBar({
  sceneId,
  cinematic = false,
}: {
  sceneId: string;
  cinematic?: boolean;
}) {
  const [summary, setSummary] = useState<SceneReactionSummary>(() =>
    normalizeSummary(sceneId, { counts: emptyCounts, userReactions: [] })
  );
  const [loadingType, setLoadingType] = useState<SceneReactionType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReactions() {
      try {
        const data = await getSceneReactions(sceneId);
        if (!cancelled) {
          setSummary(normalizeSummary(sceneId, data));
        }
      } catch {
        if (!cancelled) {
          setSummary(normalizeSummary(sceneId));
        }
      }
    }

    setSummary(normalizeSummary(sceneId));
    loadReactions();

    return () => {
      cancelled = true;
    };
  }, [sceneId]);

  const hasAnyReaction = useMemo(
    () => Object.values(summary.counts).some((count) => count > 0),
    [summary.counts]
  );

  const handleReact = async (type: SceneReactionType) => {
    if (loadingType) return;

    const previousSummary = summary;
    const isActive = summary.userReactions.includes(type);
    const optimisticSummary = {
      ...summary,
      counts: {
        ...summary.counts,
        [type]: Math.max(0, summary.counts[type] + (isActive ? -1 : 1)),
      },
      userReactions: isActive
        ? summary.userReactions.filter((reaction) => reaction !== type)
        : [...summary.userReactions, type],
    };

    setSummary(optimisticSummary);
    setLoadingType(type);

    try {
      const response = await reactToScene(sceneId, type);
      setSummary({
        sceneId,
        counts: {
          like: response.counts.like ?? 0,
          wow: response.counts.wow ?? 0,
          fire: response.counts.fire ?? 0,
          funny: response.counts.funny ?? 0,
          sad: response.counts.sad ?? 0,
        },
        userReactions: response.reacted
          ? [...previousSummary.userReactions.filter((reaction) => reaction !== type), type]
          : previousSummary.userReactions.filter((reaction) => reaction !== type),
      });
    } catch {
      setSummary(previousSummary);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-3">
        <div className={`h-1.5 w-1.5 rounded-full ${cinematic ? "bg-[#ff8d90]/75" : "bg-white/30"}`} />
        <span
          className={`text-[10px] font-black uppercase tracking-[0.2em] ${
            cinematic ? "text-[#ffb3b5]/70" : "text-white/55"
          }`}
        >
          Scene Reactions
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {reactionOptions.map((option) => {
          const count = summary.counts[option.type] ?? 0;
          const isActive = summary.userReactions.includes(option.type);
          const isLoading = loadingType === option.type;

          return (
            <motion.button
              key={option.type}
              type="button"
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReact(option.type)}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-300 ease-in-out hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 ${
                isActive
                  ? "border-[#E5484D]/40 bg-[#E5484D]/15 text-[#ffb3b5] shadow-[0_0_22px_rgba(229,72,77,0.12)]"
                  : cinematic
                    ? "border-white/10 bg-white/5 text-white/72 hover:bg-white/10"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
              }`}
              aria-label={`${option.label} scene`}
            >
              <span className="text-base leading-none">{option.icon}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`${option.type}-${count}`}
                  initial={{ opacity: 0.35, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-[0.75rem] text-xs font-bold tabular-nums"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {!hasAnyReaction ? (
        <p className={`text-xs ${cinematic ? "text-white/35" : "text-white/40"}`}>
          Be the first to react to this scene.
        </p>
      ) : null}
    </div>
  );
}
