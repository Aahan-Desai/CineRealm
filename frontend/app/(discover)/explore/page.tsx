import { getExploreMovies } from "@/lib/movies";
import ExploreGrid from "@/components/discover/ExploreGrid";
import ExploreHeader from "@/components/discover/ExploreHeader";

export default async function ExplorePage() {
  const movies = await getExploreMovies();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12 animate-in fade-in duration-1000">
      <ExploreHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}