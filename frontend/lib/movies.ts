import { apiFetch } from "./api"
import { Movie } from "@/types/movie"
import { Scene } from "@/types/scene"
import { Character } from "@/types/character"
import { Rating } from "@/types/rating"
  
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
): Promise<Movie> => {
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

export const deleteMovie = async (movieId: string) => {
  return apiFetch(`/movies/${movieId}`, {
    method: "DELETE"
  })
}

export const getExploreMovies = async () => {
  const data = await apiFetch("/movies/explore");
  return data?.movies || [];
};

export const searchMovies = async (query: string) => {
  return apiFetch(`/movies/search?q=${query}`)
}

export const getMovieFull = async (
  slug: string
): Promise<MovieFullResponse> => {
  const data = await apiFetch(`/movies/${slug}/full`);

  return {
    movie: data.movie,
    scenes: data.scenes,
    characters: data.characters,
    ratings: data.ratings || [],
    likeCount: data.likeCount,
    isLiked: data.isLiked,
  };
};

export type MovieProgressResponse = {
  movieId: string
  sceneId: string | null
  updatedAt: string | null
}

export const getMovieProgress = async (
  movieId: string
): Promise<MovieProgressResponse> => {
  return apiFetch(`/movies/${movieId}/progress`)
}

export const saveMovieProgress = async (
  movieId: string,
  sceneId: string
): Promise<MovieProgressResponse> => {
  return apiFetch(`/movies/${movieId}/progress`, {
    method: "POST",
    body: JSON.stringify({ sceneId })
  })
}

type MovieFullResponse = {
  movie: Movie
  scenes: Scene[]
  characters: Character[]
  ratings: Rating[]
  likeCount: number;
  isLiked: boolean;
}

export const getFeed = async (page: number = 1, limit: number = 10) => {
  return apiFetch(`/movies/feed?page=${page}&limit=${limit}`)
}
