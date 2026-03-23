"use client";

import { getMovieFull } from "@/lib/movies";
import MovieHeroBanner from "@/components/movie/MovieHeroBanner";
import MovieSynopsis from "@/components/movie/MovieSynopsis";
import MovieCharacters from "@/components/movie/MovieCharacters";
import MovieScenes from "@/components/movie/MovieScenes";
import MovieRating from "@/components/movie/MovieRating";
import MovieLikeButton from "@/components/movie/MovieLikeButton";
import { MovieFullResponse } from "@/types/movieFull";

export default async function MoviePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const data: MovieFullResponse = await getMovieFull(slug);
  const user = null;

  return (
    <div className="min-h-screen animate-in fade-in duration-1000">
      <MovieHeroBanner movie={data.movie} ratings={data.ratings} />

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex items-center gap-6 p-1">
          <MovieLikeButton movie={data.movie} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <MovieSynopsis synopsis={data.movie.synopsis} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
          <MovieCharacters characters={data.characters} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
          <MovieScenes scenes={data.scenes} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-600 bg-white/0.02 border border-white/5 rounded-[40px] p-8 md:p-12">
          <MovieRating movieId={data.movie.id} ratings={data.ratings} />
        </section>
      </div>
    </div>
  );
}
