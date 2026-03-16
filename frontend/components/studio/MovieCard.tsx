"use client"

import Link from "next/link"

type Movie = {
  id: string
  title: string
  genre?: string
  runtime?: number
  posterUrl?: string
  visibility?: string
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/studio/${movie.id}`}
      className="block rounded-lg border overflow-hidden hover:shadow-md transition"
    >

      <div className="aspect-2/3 bg-muted">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No Poster
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="font-semibold">{movie.title}</h3>

        <p className="text-xs text-muted-foreground">
          {movie.genre || "Genre not set"}
        </p>

        {movie.runtime && (
          <p className="text-xs text-muted-foreground">
            {movie.runtime} min
          </p>
        )}
      </div>

    </Link>
  )
}