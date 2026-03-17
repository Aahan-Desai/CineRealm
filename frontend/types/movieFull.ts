import { apiFetch } from "@/lib/api";
import { Movie } from "./movie";
import { Scene } from "./scene";
import { Character } from "./character";
import { Rating } from "./rating";

export const getMovieFull = async (
  slug: string
): Promise<MovieFullResponse> => {
  const data = await apiFetch(`/movies/${slug}/full`);

  return {
    movie: data.movie,
    scenes: data.scenes,
    characters: data.characters,
    ratings: data.ratings || [],
  };
};

export type MovieFullResponse = {
  movie: Movie
  scenes: Scene[]
  characters: Character[]
  ratings: Rating[]
}