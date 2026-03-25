import { getMovieFull } from "@/lib/movies";
import MovieHeroBanner from "@/components/movie/MovieHeroBanner";
import MovieSynopsis from "@/components/movie/MovieSynopsis";
import MovieCharacters from "@/components/movie/MovieCharacters";
import MovieRating from "@/components/movie/MovieRating";
import MovieLikeButton from "@/components/movie/MovieLikeButton";
import { MovieFullResponse } from "@/types/movieFull";
import MovieStoryViewer from "@/components/movie/MovieStoryViewer";

export default async function MoviePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const data: MovieFullResponse = await getMovieFull(slug);
  const isFull = data.movie.creationType === "FULL" || data.movie.creationType === "full";

  return (
    <div className="min-h-screen bg-[#070809] animate-in fade-in duration-1000">
      {/* 1. HERO SECTION */}
      <MovieHeroBanner movie={data.movie} ratings={data.ratings} />

      <div className="max-w-7xl mx-auto px-6 -mt-12 md:-mt-16 relative z-30">
        <div className="inline-flex items-center gap-4 bg-[#070809] border border-white/5 rounded-full p-2 pr-6 shadow-2xl backdrop-blur-3xl">
          <MovieLikeButton movie={data.movie} />
          <div className="h-6 w-px bg-white/10" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Official Feature</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-40 space-y-48">
        {/* 2. SYNOPSIS SECTION */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <MovieSynopsis synopsis={data.movie.synopsis} />
        </section>

        {isFull && (
          <>
            {/* 3. CHARACTERS SECTION */}
            <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
              <MovieCharacters characters={data.characters} />
            </section>

            {/* 4. STORY STRUCTURE (ACTS & SCENES) */}
            <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-600">
              <MovieStoryViewer scenes={data.scenes} />
            </section>
          </>
        )}

        {/* 5. RATING SECTION */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 bg-white/0.015 border border-white/5 rounded-[48px] p-8 md:p-24 shadow-inner">
          <div className="max-w-5xl mx-auto">
            <MovieRating movieId={data.movie.id} ratings={data.ratings} />
          </div>
        </section>

        {/* Cinematic End-title Scroll */}
        <div className="pt-24 flex flex-col items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white">The end of the story</span>
        </div>
      </div>
    </div>
  );
}
