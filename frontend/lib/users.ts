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

export async function updateProfile(data: {
  bio?: string
  avatarUrl?: string
  coverUrl?: string
}) {
  return apiFetch("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}