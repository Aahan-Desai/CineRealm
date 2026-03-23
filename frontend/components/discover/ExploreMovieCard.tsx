"use client"

import Link from "next/link"
import { Movie } from "@/types/movie"

interface Props {
  movie: Movie
}

export default function ExploreMovieCard({ movie }: Props) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className="group relative rounded-xl overflow-hidden border border-[#262A35]/50 bg-[#1A1D26] transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative aspect-2/3 w-full">
          {/* POSTER */}
          {movie.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#151821] via-[#1A1D26] to-[#0F1115]">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_25%,#E5484D,transparent_45%)]" />
            </div>
          )}

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0F1115]/95 via-[#0F1115]/40 to-transparent" />

          {/* CONTENT */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-[#F1F5F9]">
              {movie.title}
            </h3>
            {(movie.genre || movie.runtime) && (
              <p className="mt-1 text-xs text-[#9CA3AF]">
                {movie.genre ? movie.genre : "Uncategorized"}
                {movie.runtime ? ` • ${movie.runtime} min` : ""}
              </p>
            )}
          </div>

          {/* HOVER RING */}
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition group-hover:ring-[#262A35]/70" />
        </div>
      </div>
    </Link>
  )
}