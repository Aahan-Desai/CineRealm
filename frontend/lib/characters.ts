import { Character } from "@/types/character"
import { apiFetch } from "./api"

export const createCharacter = async (data: {
  name: string
  actorName?: string
  movieId: string
}): Promise<Character> => {

  return apiFetch("/characters", {
    method: "POST",
    body: JSON.stringify(data)
  })
}