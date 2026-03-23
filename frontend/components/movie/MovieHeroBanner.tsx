"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { Movie } from "@/types/movie";
import { Rating } from "@/types/rating";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="relative w-full h-[85svh] min-h-[600px] overflow-hidden">
      {/* Background Image with Cinematic Effects */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl space-y-8"
        >
          {/* Metadata Badge */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold tracking-widest uppercase text-primary/80">
            <span>{movie.genre}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>{movie.runtime} Minutes</span>
            {movie.year && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>{movie.year}</span>
              </>
            )}
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            {movie.title}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl p-2.5 pr-5 border border-white/10">
              <span className="text-3xl font-black text-white ml-1">
                {avg > 0 ? avg.toFixed(1) : "—"}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Rating</span>
                <span className="text-xs text-muted-foreground font-medium">{count} reviews</span>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium line-clamp-3">
            {movie.synopsis}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-base hover:scale-105 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95">
              Rate This Story
            </button>

            {movie.creator && (
              <Link
                href={`/profile/${movie.creator.username}`}
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all hover:border-white/20"
              >
                Director: @{movie.creator.username}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Down Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-linear-to-b from-primary to-transparent" />
      </motion.div>
    </div>
  );
}