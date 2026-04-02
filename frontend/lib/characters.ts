import { Character } from "@/types/character"
import { apiFetch } from "./api"

export const createCharacter = async (data: {
  name: string
  actorName?: string
  avatarUrl?: string
  role?: string
  traits?: string
  shortBio?: string
  movieId: string
}): Promise<Character> => {

  return apiFetch("/characters", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export const updateCharacter = async (
  characterId: string,
  data: {
    name: string
    actorName?: string
    avatarUrl?: string
    role?: string
    traits?: string
    shortBio?: string
  }
): Promise<Character> => {
  return apiFetch(`/characters/${characterId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export const deleteCharacter = async (characterId: string) => {
  return apiFetch(`/characters/${characterId}`, {
    method: "DELETE"
  })
}
