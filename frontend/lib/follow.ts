import { apiFetch } from "./api"

export const followUser = (userId: string) =>
  apiFetch(`/follow/${userId}`, { method: "POST" })

export const unfollowUser = (userId: string) =>
  apiFetch(`/follow/${userId}`, { method: "DELETE" })