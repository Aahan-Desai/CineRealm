"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { updateScene, deleteScene } from "@/lib/scenes"

import { Scene } from "@/types/scene"

export default function SceneCard({
  scene,
  onDelete
}: {
  scene: Scene
  onDelete: (id: string) => void
}) {

  const [scriptText, setScriptText] = useState(scene.scriptText || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {

    try {

      setLoading(true)

      await updateScene(scene.id, {
        scriptText
      })

    } catch (error) {

      console.error(error)
      alert("Failed to update scene")

    } finally {

      setLoading(false)

    }
  }

  const handleDelete = async () => {

    try {

      await deleteScene(scene.id)

      onDelete(scene.id)

    } catch (error) {

      console.error(error)
      alert("Failed to delete scene")

    }
  }

  return (
    <div className="border rounded-md p-4 space-y-3">

      <p className="font-medium">
        {scene.title}
      </p>

      <Textarea
        placeholder="Write scene script..."
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
      />

      <div className="flex gap-3">

        <Button
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          Delete
        </Button>

      </div>

    </div>
  )
}