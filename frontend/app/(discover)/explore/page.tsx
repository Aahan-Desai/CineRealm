import { getExploreMovies } from "@/lib/movies";
import ExploreMovieCard from "@/components/discover/ExploreMovieCard";
import ExploreHeader from "@/components/discover/ExploreHeader";
import { Movie } from "@/types/movie";

export default async function ExplorePage() {
  const movies = await getExploreMovies();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12 animate-in fade-in duration-1000">
      <ExploreHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map((movie: Movie) => (
          <ExploreMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}