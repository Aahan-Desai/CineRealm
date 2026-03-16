import { apiFetch } from "./api"
import { Movie } from "@/types/movie"
  
export const getMyMovies = async (): Promise<{
  drafts: Movie[]
  private: Movie[]
  published: Movie[]
}> => {
  return apiFetch("/movies/my")
}

export const getMovieStudio = async (movieId: string): Promise<Movie> => {
  return apiFetch(`/movies/${movieId}/studio`)
}

export const createMovie = async (data: {
  title: string
  genre?: string
  runtime?: number
}) => {
  return apiFetch("/movies", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export const updateMovie = async (
  movieId: string,
  data: Partial<Movie>
) => {
  return apiFetch(`/movies/${movieId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export const publishMovie = async (movieId: string) => {
  return apiFetch(`/movies/${movieId}/publish`, {
    method: "PATCH"
  })
}

export const getExploreMovies = async () => {
  return apiFetch("/movies/explore")
}

export const searchMovies = async (query: string) => {
  return apiFetch(`/movies/search?q=${query}`)
}