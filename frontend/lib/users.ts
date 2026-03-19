import { apiFetch } from "./api";
import { Movie } from "@/types/movie";
import { User } from "@/types/user";

export type UserProfileResponse = {
  user: {
    id: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
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
      id: data.id,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      coverUrl: data.coverUrl,
      isFollowing: data.isFollowing,
      followersCount: data.followersCount,
      followingCount: data.followingCount,
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

export const getSuggestions = () => {
  return apiFetch("/users/suggestions");
};