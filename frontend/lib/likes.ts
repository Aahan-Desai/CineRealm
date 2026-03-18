import { apiFetch } from "@/lib/api";

export const likeMovie = (movieId: string) => {
  return apiFetch(`/likes/${movieId}`, {
    method: "POST",
  });
};

export const unlikeMovie = (movieId: string) => {
  return apiFetch(`/likes/${movieId}`, {
    method: "DELETE",
  });
};