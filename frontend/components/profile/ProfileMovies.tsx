import { Movie } from "@/types/movie";
import ExploreMovieCard from "@/components/discover/ExploreMovieCard";

export default function ProfileMovies({ movies }: { movies: Movie[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Movies
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <ExploreMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}