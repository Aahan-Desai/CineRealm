import ExploreMovieCard from "./ExploreMovieCard";

export default function ExploreGrid({ movies }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map((movie: any) => (
        <ExploreMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}