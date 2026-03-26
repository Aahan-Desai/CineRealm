import { Character } from "./character"

export type SceneReactionType = "like" | "wow" | "fire" | "sad" | "funny"

export interface SceneReactionSummary {
  sceneId: string
  counts: Record<SceneReactionType, number>
  userReactions: SceneReactionType[]
}

export interface Choice {
  id: string
  text: string
  outcomeText: string
}

export interface SceneBlock {
  id: string
  type: "DIALOGUE" | "ACTION"
  content: string
  sceneId?: string
  characterId?: string | null
  character?: Character | null
  createdAt?: string
}

export interface Scene {
  id: string
  title: string
  location?: string
  scriptText?: string
  mood?: string
  characters?: { character: Character }[] | Character[]
  blocks?: SceneBlock[]
  choices?: Choice[]
  actNumber: number
  sceneOrder?: number
  movieId: string
  createdAt: string
}
