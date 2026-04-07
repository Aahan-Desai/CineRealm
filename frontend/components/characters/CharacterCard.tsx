"use client"

import { useEffect, useState } from "react"
import { Character } from "@/types/character"
import { deleteCharacter, updateCharacter } from "@/lib/characters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AvatarUpload from "./AvatarUpload"
import CharacterAvatar from "./CharacterAvatar"

export default function CharacterCard({
  character,
  onUpdate,
  onDelete,
}: {
  character: Character
  onUpdate: (character: Character) => void
  onDelete: (characterId: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(character.name)
  const [actorName, setActorName] = useState(character.actorName || "")
  const [role, setRole] = useState(character.role || "")
  const [traits, setTraits] = useState(character.traits || "")
  const [shortBio, setShortBio] = useState(character.shortBio || "")
  const [avatarUrl, setAvatarUrl] = useState(character.avatarUrl || "")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setName(character.name)
    setActorName(character.actorName || "")
    setRole(character.role || "")
    setTraits(character.traits || "")
    setShortBio(character.shortBio || "")
    setAvatarUrl(character.avatarUrl || "")
  }, [character])

  const resetForm = () => {
    setName(character.name)
    setActorName(character.actorName || "")
    setRole(character.role || "")
    setTraits(character.traits || "")
    setShortBio(character.shortBio || "")
    setAvatarUrl(character.avatarUrl || "")
  }

  const handleSave = async () => {
    if (!name.trim()) return

    try {
      setSaving(true)

      const updatedCharacter = await updateCharacter(character.id, {
        name: name.trim(),
        actorName: actorName || undefined,
        role: role || undefined,
        traits: traits || undefined,
        shortBio: shortBio || undefined,
        avatarUrl: avatarUrl || undefined,
      })

      onUpdate(updatedCharacter)
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      alert("Failed to update character")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    setIsEditing(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${character.name}?`)
    if (!confirmed) return

    try {
      setDeleting(true)
      await deleteCharacter(character.id)
      onDelete(character.id)
    } catch (error) {
      console.error(error)
      alert("Failed to delete character")
    } finally {
      setDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="border rounded-xl p-5 flex gap-5 bg-[#12141A]/50 border-white/5 shadow-xs">
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Character"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-xl p-5 flex gap-5 bg-[#12141A]/50 border-white/5 shadow-xs transition-colors hover:bg-[#1A1D26]">
      <CharacterAvatar
        name={character.name}
        avatarUrl={character.avatarUrl}
        role={character.role}
        seed={character.id || character.name}
        className="h-14 w-14 shrink-0 shadow-md"
        initialsClassName="text-base"
      />

      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-lg leading-tight text-white tracking-tight">
                {character.name}
              </p>
              {character.role && (
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 bg-[#E5484D]/10 text-[#E5484D] rounded-full border border-[#E5484D]/20">
                  {character.role}
                </span>
              )}
            </div>

            {character.actorName && (
              <p className="text-sm text-white/50 font-medium">
                Played by <span className="text-white/80">{character.actorName}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-[#E5484D]/85 hover:bg-[#E5484D]"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {character.traits && (
          <p className="text-xs text-white/70 mt-1">
            <span className="font-black text-white/30 uppercase tracking-widest text-[9px] mr-1.5">Traits</span>
            {character.traits}
          </p>
        )}

        {character.shortBio && (
          <p className="text-sm text-white/70 mt-2.5 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed shadow-inner">
            {character.shortBio}
          </p>
        )}
      </div>
    </div>
  )
}
