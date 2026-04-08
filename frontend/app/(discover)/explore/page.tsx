import { getExploreMovies } from "@/lib/movies";
import ExploreMovieCard from "@/components/discover/ExploreMovieCard";
import ExploreHeader from "@/components/discover/ExploreHeader";
import { Movie } from "@/types/movie";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  try {
    const movies = await getExploreMovies();

    return (
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12 animate-in fade-in duration-1000">
        <ExploreHeader />
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie: Movie) => (
              <ExploreMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1A1D26]/50 rounded-2xl border border-[#262A35]/50">
            <p className="text-[#9CA3AF] text-lg">No stories found yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Explore Page Error:", error);
    
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <ExploreHeader />
        <div className="text-center py-20 bg-red-500/10 rounded-2xl border border-red-500/20">
          <p className="text-red-400 text-lg font-medium">Unable to load stories right now.</p>
          <p className="text-red-300/70 text-sm mt-2">Please try refreshing or check back later.</p>
        </div>
      </div>
    );
  }
}