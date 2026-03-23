"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { likeMovie, unlikeMovie } from "@/lib/likes";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [liked, setLiked] = useState(movie.isLiked ?? false);
  const [count, setCount] = useState(movie.likeCount ?? 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;

    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (prevLiked) {
        await unlikeMovie(movie.id);
      } else {
        await likeMovie(movie.id);
      }
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  const creatorUsername = movie.creator?.username || "unknown";
  const creatorAvatarUrl = movie.creator?.avatarUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full rounded-2xl overflow-hidden bg-card border border-white/[0.04] hover:border-white/10 transition-colors shadow-2xl shadow-black/40"
    >
      <Link
        href={`/movies/${movie.slug}`}
        className="relative block aspect-[2/3] w-full"
      >
        {/* Poster with Soft Zoom */}
        <div className="absolute inset-0 overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-card via-[#12141c] to-background">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,var(--primary),transparent_45%)]" />
            </div>
          )}
        </div>

        {/* Improved Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Content Layer */}
        <div className="absolute inset-x-0 bottom-0 p-5 pt-10">
          <div className="space-y-3">
            <h3 className="text-xl font-bold leading-tight text-foreground tracking-tight group-hover:text-white transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/profile/${creatorUsername}`;
                }}
                className="flex items-center gap-2.5 group/user cursor-pointer"
              >
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10 bg-muted/50 ring-2 ring-transparent group-hover/user:ring-white/20 transition-all">
                  {creatorAvatarUrl ? (
                    <img
                      src={creatorAvatarUrl}
                      alt={`${creatorUsername} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[10px] font-bold text-foreground">
                        {creatorUsername[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-foreground group-hover/user:text-primary transition-colors">
                    {creatorUsername}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    {timeAgo(movie.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Like Button - Floating cinematic style */}
      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md transition-all duration-300 border active:scale-90 ${
            liked
              ? "bg-primary/20 border-primary/30 text-primary"
              : "bg-black/20 border-white/5 text-muted-foreground hover:bg-black/40 hover:border-white/10 hover:text-white"
          }`}
        >
          <Heart
            size={14}
            strokeWidth={liked ? 0 : 2.5}
            fill={liked ? "currentColor" : "transparent"}
            className={liked ? "animate-pulse" : ""}
          />
          <span className="text-[11px] font-bold">
            {count}
          </span>
        </button>
      </div>
    </motion.div>
  );
}