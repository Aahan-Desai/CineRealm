"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { Movie } from "@/types/movie";
import { Rating } from "@/types/rating";
import Link from "next/link";

type Props = {
  movie: Movie;
  ratings: Rating[];
};

export default function MovieHeroBanner({
  movie,
  ratings,
}: Props) {
  const user = useAuthStore((s) => s.user);

  const { avg, count } = useMemo(() => {
    if (!ratings.length) return { avg: 0, count: 0 };

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);

    return {
      avg: total / ratings.length,
      count: ratings.length,
    };
  }, [ratings]);

  const userRating = ratings.find(
    (r) => r.user?.username === user?.username
  )?.rating;

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">

      <img
        src={movie.backdropUrl || movie.posterUrl}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover scale-105 brightness-50"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

      <div className="relative z-10 h-full flex items-center px-12">
        <div className="max-w-xl space-y-5">

          <h1 className="text-6xl font-bold tracking-tight">
            {movie.title}
          </h1>

          <p className="text-muted-foreground">
            {movie.genre} • {movie.runtime} min
          </p>

          {movie.creator && (
            <Link
              href={`/profile/${movie.creator.username}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              Created by @{movie.creator.username}
            </Link>
          )}

          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-bold text-yellow-400">
              ★ {avg.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({count} ratings)
            </span>
          </div>

          {userRating && (
            <p className="text-sm text-muted-foreground">
              You rated this {userRating} ★
            </p>
          )}

          <p className="text-sm line-clamp-3">
            {movie.synopsis}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
              ⭐ Rate
            </button>

            <button className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg hover:bg-white/30 transition">
              View Creator
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}