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
  const heroImage = movie.backdropUrl || movie.posterUrl || null;
  const posterImage = movie.posterUrl || null;

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
  const creatorInitials = movie.creator?.username
    ?.split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className="relative w-full h-[95svh] min-h-[750px] overflow-hidden">
      {/* Background Image with Cinematic Effects */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt={movie.title}
            className="w-full h-full object-cover brightness-[0.25]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#070809] via-[#070809]/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#070809] via-[#070809]/20 to-transparent" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center md:items-end pb-24 md:pb-32">
        <div className="grid md:grid-cols-[300px_1fr] gap-12 items-end w-full">
          {/* Poster Image */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block group relative"
          >
            <div className="aspect-2/3 rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/10">
              {posterImage ? (
                <img 
                  src={posterImage} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={`${movie.title} Poster`}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-white/5 text-sm font-medium text-muted-foreground">
                  Poster coming soon
                </div>
              )}
            </div>
            <div className="absolute -inset-1 rounded-[33px] bg-linear-to-tr from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur" />
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            {/* Metadata Badge */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-black tracking-[0.2em] uppercase text-primary/80">
              <span className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{movie.genre || "Drama"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{movie.runtime} Minutes</span>
              {movie.creationType && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-muted-foreground">{movie.creationType === 'quick' ? 'Quick Plot' : 'Studio Production'}</span>
                </>
              )}
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-2">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl rounded-[32px] p-4 pr-8 border border-white/10">
                <div className="w-14 h-14 rounded-full bg-linear-to-tr from-primary/20 to-white/5 flex items-center justify-center text-3xl font-black text-white shadow-inner">
                  {avg > 0 ? avg.toFixed(1) : "—"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Audience Score</span>
                  <span className="text-xs text-muted-foreground font-bold tracking-tight">{count} critics reviewed</span>
                </div>
              </div>

              {movie.creator && (
                <Link
                  href={`/profile/${movie.creator.username}`}
                  className="group flex items-center gap-4 bg-white/5 backdrop-blur-2xl rounded-[32px] p-2 pr-8 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-sm font-black tracking-[0.18em] text-white">
                    {movie.creator.avatarUrl ? (
                      <img
                        src={movie.creator.avatarUrl}
                        className="h-full w-full object-cover"
                        alt={movie.creator.username}
                      />
                    ) : (
                      <span>{creatorInitials}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Director</span>
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">@{movie.creator.username}</span>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <button className="bg-primary text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95">
                Rate Experience
              </button>

              <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white/10 transition-all hover:border-white/20 active:scale-95">
                Add to Watchlist
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Cinematic Shadow Gradient Footer */}
      <div className="absolute bottom-0 inset-x-0 h-96 bg-linear-to-t from-[#070809] to-transparent pointer-events-none" />
    </div>
  );
}
