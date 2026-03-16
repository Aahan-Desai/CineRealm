"use client"

import { useEffect, useState } from "react"
import { getMyMovies } from "@/lib/movies"
import { Movie } from "@/types/movie"

import MovieCard from "@/components/studio/MovieCard"
import CreateMovieButton from "@/components/studio/CreateMovieButton"

export default function StudioPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMyMovies()
        console.log("MOVIES RESPONSE:", data)
        setMovies(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return <p>Loading movies...</p>
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Your Studio
        </h1>

        <CreateMovieButton />
      </div>

      {movies.length === 0 ? (
        <p className="text-muted-foreground">
          No movies yet. Create your first movie!
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}

    </div>
  )
}