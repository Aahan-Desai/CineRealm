import { apiFetch } from "./api"
import { MyMoviesResponse } from "@/types/movie"

export const getMyMovies = async (): Promise<MyMoviesResponse> => {
  const data = await apiFetch("/movies/my")

  return data
}