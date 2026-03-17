import { apiFetch } from "./api";
import { Movie } from "@/types/movie";
import { User } from "@/types/user";

export type UserProfileResponse = {
  user: User;
  movies: Movie[];
};

export const getUserProfile = async (
  username: string
): Promise<UserProfileResponse> => {
  return apiFetch(`/users/${username}`);
};