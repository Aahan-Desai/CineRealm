"use client"

import { useEffect, useState } from "react"
import { getMyMovies } from "@/lib/movies"
import { MyMoviesResponse } from "@/types/movie"

import MovieSection from "@/components/studio/MovieSection"
import CreateMovieButton from "@/components/studio/CreateMovieButton"

export default function StudioPage() {
  const [movies, setMovies] = useState<MyMoviesResponse>({
    drafts: [],
    private: [],
    published: []
  })

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
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Your Studio
        </h1>

        <CreateMovieButton />
      </div>

      <MovieSection
        title="Drafts"
        movies={movies.drafts}
      />

      <MovieSection
        title="Private Movies"
        movies={movies.private}
      />

      <MovieSection
        title="Published Movies"
        movies={movies.published}
      />

    </div>
  )
}