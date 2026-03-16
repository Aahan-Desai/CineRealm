"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { getMovieStudio } from "@/lib/movies"
import { Movie } from "@/types/movie"

import MovieHeader from "@/components/builder/MovieHeader"
import BuilderTabs from "@/components/builder/BuilderTabs"

export default function MovieBuilderPage() {

  const params = useParams()
  const movieId = params.movieId as string

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchMovie = async () => {
      try {

        const data = await getMovieStudio(movieId)
        setMovie(data)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()

  }, [movieId])

  if (loading) {
    return <p>Loading movie...</p>
  }

  if (!movie) {
    return <p>Movie not found</p>
  }

  return (
    <div className="space-y-8">

      <MovieHeader movie={movie} />

      <BuilderTabs movie={movie} />

    </div>
  )
}