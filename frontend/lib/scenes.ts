"use client"

import { Scene, SceneReactionSummary, SceneReactionType } from "@/types/scene"
import { apiFetch } from "./api"

export const createScene = async (data: {
  title: string
  movieId: string
  actNumber: number
}): Promise<Scene> => {

  return apiFetch("/scenes", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      scriptText: "",
      sceneOrder: 1
    })

  })
}

export const updateScene = async (
  sceneId: string,
  data: any
): Promise<Scene> => {

  return apiFetch(`/scenes/${sceneId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export const deleteScene = async (sceneId: string) => {

  return apiFetch(`/scenes/${sceneId}`, {
    method: "DELETE"
  })
}

export const getSceneReactions = async (
  sceneId: string
): Promise<SceneReactionSummary> => {
  return apiFetch(`/scenes/${sceneId}/reactions`)
}

export const reactToScene = async (
  sceneId: string,
  type: SceneReactionType
): Promise<Pick<SceneReactionSummary, "sceneId" | "counts"> & { reacted: boolean }> => {
  return apiFetch(`/scenes/${sceneId}/react`, {
    method: "POST",
    body: JSON.stringify({ type })
  })
}
