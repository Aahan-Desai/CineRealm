import { apiFetch } from "./api"

export const loginUser = (data: {
  email: string
  password: string
}) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const registerUser = (data: {
  username: string
  email: string
  password: string
}) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  })