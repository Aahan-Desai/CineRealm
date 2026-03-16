import { Movie } from "@/types/movie"

export default function MovieHeader({
  movie
}: {
  movie: Movie
}) {

  return (
    <div className="border-b pb-6 space-y-2">

      <h1 className="text-3xl font-bold">
        {movie.title}
      </h1>

      <div className="text-sm text-muted-foreground flex gap-4">

        {movie.genre && (
          <span>
            {movie.genre}
          </span>
        )}

        {movie.runtime && (
          <span>
            {movie.runtime} min
          </span>
        )}

        {!movie.isPublished && (
          <span className="text-yellow-600">
            Draft
          </span>
        )}

      </div>

    </div>
  )
}