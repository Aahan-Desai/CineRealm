"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { createScene } from "@/lib/scenes"

import { Scene } from "@/types/scene"

export default function SceneForm({
  movieId,
  actNumber,
  onCreate
}: {
  movieId: string
  actNumber: number
  onCreate: (scene: Scene) => void
}) {

  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {

    if (!title) return

    try {

      setLoading(true)

      const scene = await createScene({
        title,
        actNumber,
        movieId
      })

      onCreate(scene)

      setTitle("")

    } catch (error) {

      console.error(error)
      alert("Failed to create scene")

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="flex gap-3">

      <Input
        placeholder="Scene Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Button
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Scene"}
      </Button>

    </div>
  )
}