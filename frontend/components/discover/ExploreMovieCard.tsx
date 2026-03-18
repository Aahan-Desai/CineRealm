"use client"

import Link from "next/link"
import { Movie } from "@/types/movie"

interface Props {
  movie: Movie
}

export default function ExploreMovieCard({ movie }: Props) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className="group relative rounded-xl overflow-hidden cursor-pointer">

        {/* POSTER */}
        <div className="aspect-2/3 w-full bg-gray-800 overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-700 to-black" />
          )}
        </div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition" />

        {/* CONTENT (revealed on hover) */}
        <div className="absolute bottom-0 p-3 w-full translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">

          <h3 className="text-sm font-semibold leading-tight line-clamp-2">
            {movie.title}
          </h3>

          <p className="text-xs text-gray-300 mt-1">
            {movie.genre} • {movie.runtime} min
          </p>
        </div>

        {/* HOVER SHADOW */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition" />
      </div>
    </Link>
  )
}