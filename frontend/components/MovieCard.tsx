"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
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
  const creatorInitial = creatorUsername[0]?.toUpperCase() || "?";

  return (
    <div className="group relative w-full rounded-xl overflow-hidden border border-[#262A35]/50 bg-[#1A1D26] transition-all duration-300 hover:scale-[1.02] hover:border-white/10">
      
      <Link
        href={`/movies/${movie.slug}`}
        className="relative block aspect-2/3 w-full"
      >
        {/* Poster */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:brightness-110"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#151821] via-[#1A1D26] to-[#0F1115]">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#E5484D,transparent_45%)]" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0F1115]/95 via-[#0F1115]/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 pr-24">
          <h3 className="text-lg font-semibold leading-tight text-[#F1F5F9] group-hover:text-white transition">
            {movie.title}
          </h3>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href={`/profile/${creatorUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-0 items-center gap-3 group/user"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#262A35]/50 bg-[#151821]">
                {creatorAvatarUrl ? (
                  <img
                    src={creatorAvatarUrl}
                    alt={`${creatorUsername} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm font-bold text-[#F1F5F9]">
                      {creatorInitial}
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[#F1F5F9] group-hover/user:underline">
                  {creatorUsername}
                </div>

                <div
                  title={new Date(movie.createdAt).toLocaleString()}
                  className="truncate text-xs text-[#9CA3AF]"
                >
                  {timeAgo(movie.createdAt)}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Link>

      {/* Like Button */}
      <button
        type="button"
        onClick={handleLike}
        disabled={loading}
        aria-label={liked ? "Unlike movie" : "Like movie"}
        className={`absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95 ${
          liked
            ? "border-[#E5484D]/40 bg-[#E5484D]/10"
            : "border-[#262A35] bg-[#151821]/60 hover:bg-[#151821]"
        }`}
      >
        <Heart
          size={18}
          strokeWidth={1.8}
          className={`transition-transform duration-200 ${
            liked
              ? "text-[#E5484D] scale-110"
              : "text-[#9CA3AF] group-hover:text-[#F1F5F9]"
          }`}
          fill={liked ? "#E5484D" : "transparent"}
        />

        <span className="text-sm font-semibold text-[#F1F5F9]">
          {count}
        </span>
      </button>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition group-hover:ring-white/10" />
    </div>
  );
}