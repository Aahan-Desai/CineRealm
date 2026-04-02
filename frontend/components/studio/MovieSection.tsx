import MovieCard from "./MovieCard"

type Movie = {
  id: string
  title: string
  genre?: string
  runtime?: number
  posterUrl?: string
}

export default function MovieSection({
  title,
  movies,
  onDelete,
}: {
  title: string
  movies: Movie[]
  onDelete: (movieId: string) => void
}) {
  if (!movies || movies.length === 0) return null

  return (
    <section className="space-y-4">

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onDelete={onDelete} />
        ))}
      </div>

    </section>
  )
}
