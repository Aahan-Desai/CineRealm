"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { createCharacter } from "@/lib/characters"
import { Character } from "@/types/character"

export default function CharacterForm({
  movieId,
  onCreate
}: {
  movieId: string
  onCreate: (character: Character) => void
}) {

  const [name, setName] = useState("")
  const [actorName, setActorName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {

    if (!name) return

    try {

      setLoading(true)

      const character = await createCharacter({
        name,
        actorName,
        movieId
      })

      onCreate(character)

      setName("")
      setActorName("")

    } catch (error) {

      console.error(error)
      alert("Failed to create character")

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="flex gap-3">

      <Input
        placeholder="Character Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Actor Name"
        value={actorName}
        onChange={(e) => setActorName(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Character"}
      </Button>

    </div>
  )
}