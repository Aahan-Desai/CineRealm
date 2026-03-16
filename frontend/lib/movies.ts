import { apiFetch } from "./api"
import { Movie } from "@/types/movie"

export const getMyMovies = async (): Promise<Movie[]> => {
  const data = await apiFetch("/movies/my")

  return [
    ...data.drafts,
    ...data.private,
    ...data.published
  ]
}