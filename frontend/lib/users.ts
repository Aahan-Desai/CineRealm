import { apiFetch } from "./api";
import { Movie } from "@/types/movie";
import { User } from "@/types/user";

export type UserProfileResponse = {
  user: User;
  movies: Movie[];
  moviesCount: number;
  averageRating: number | null;
};

export const getUserProfile = async (
  username: string
): Promise<UserProfileResponse> => {
  const data = await apiFetch(`/users/${username}`);

  // 🔥 Normalize backend → frontend shape
  return {
    user: {
      username: data.username,
      bio: data.bio,
    },
    movies: data.movies,
    moviesCount: data.moviesCount,
    averageRating: data.averageRating,
  };
};