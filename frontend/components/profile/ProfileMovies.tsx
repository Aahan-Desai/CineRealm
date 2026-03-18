import { Movie } from "@/types/movie";
import ExploreMovieCard from "@/components/discover/ExploreMovieCard";

export default function ProfileMovies({ movies }: { movies: Movie[] }) {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4 tracking-tight">
        Movies
      </h2>

      {movies.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No movies created yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="transform hover:scale-[1.03] transition duration-300"
            >
              <ExploreMovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}