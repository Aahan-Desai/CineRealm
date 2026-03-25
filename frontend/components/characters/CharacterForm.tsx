"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { createCharacter } from "@/lib/characters"
import { Character } from "@/types/character"
import AvatarUpload from "./AvatarUpload"

export default function CharacterForm({
  movieId,
  onCreate
}: {
  movieId: string
  onCreate: (character: Character) => void
}) {

  const [name, setName] = useState("")
  const [actorName, setActorName] = useState("")
  const [role, setRole] = useState("")
  const [traits, setTraits] = useState("")
  const [shortBio, setShortBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {

    if (!name) return

    try {

      setLoading(true)

      const character = await createCharacter({
        name,
        actorName,
        role: role || undefined,
        traits: traits || undefined,
        shortBio: shortBio || undefined,
        avatarUrl: avatarUrl || undefined,
        movieId
      })

      onCreate(character)

      setName("")
      setActorName("")
      setRole("")
      setTraits("")
      setShortBio("")
      setAvatarUrl("")

    } catch (error) {

      console.error(error)
      alert("Failed to create character")

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="flex gap-6 bg-white/0.02 border border-white/5 rounded-xl p-6 items-start">
      <div className="shrink-0">
        <AvatarUpload currentUrl={avatarUrl} onUpload={setAvatarUrl} />
      </div>

      <div className="flex flex-col gap-4 w-full">
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
        </div>
        
        <div className="flex gap-3">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Protagonist">Protagonist</option>
            <option value="Antagonist">Antagonist</option>
            <option value="Supporting">Supporting</option>
          </select>
          <Input
            placeholder="Traits (e.g. Brave, Cunning)"
            value={traits}
            onChange={(e) => setTraits(e.target.value)}
          />
        </div>

        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Short Bio..."
          value={shortBio}
          onChange={(e) => setShortBio(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end"
        >
          {loading ? "Adding..." : "Add Character"}
        </Button>
      </div>
    </div>
  )
}