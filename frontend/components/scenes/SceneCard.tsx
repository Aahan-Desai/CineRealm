"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { updateScene, deleteScene } from "@/lib/scenes"

import { Scene } from "@/types/scene"
import { Character } from "@/types/character"

export default function SceneCard({
  scene,
  characters,
  onDelete
}: {
  scene: Scene
  characters: Character[]
  onDelete: (id: string) => void
}) {

  const [scriptText, setScriptText] = useState(scene.scriptText || "")
  const [mood, setMood] = useState(scene.mood || "")
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    scene.characters?.map(sc => sc.character.id) || []
  )
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      await updateScene(scene.id, {
        scriptText,
        mood: mood || undefined,
        characterIds: selectedCharacterIds
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

  const toggleCharacter = (charId: string) => {
    setSelectedCharacterIds(prev => 
      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
    )
  }

  return (
    <div className="border border-white/10 bg-white/5 rounded-xl p-5 space-y-4">

      <div className="flex items-center justify-between">
        <p className="font-bold text-lg text-white/90">
          {scene.title}
        </p>

        <select 
          className="h-9 rounded-md border border-white/10 bg-black/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E5484D] transition-colors appearance-none"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">No Mood</option>
          <option value="Tense">Tense</option>
          <option value="Calm">Calm</option>
          <option value="Chaos">Chaos</option>
          <option value="Romantic">Romantic</option>
          <option value="Mystery">Mystery</option>
          <option value="Action">Action</option>
        </select>
      </div>

      {characters && characters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {characters.map(char => {
            const isSelected = selectedCharacterIds.includes(char.id)
            return (
              <button
                key={char.id}
                onClick={() => toggleCharacter(char.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected 
                    ? "bg-[#E5484D] text-white" 
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {char.name}
              </button>
            )
          })}
        </div>
      )}

      <Textarea
        placeholder="Write scene script..."
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
        className="min-h-[150px] bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-[#E5484D] resize-y"
      />

      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-white text-black hover:bg-white/90"
        >
          {loading ? "Saving..." : "Save Scene"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="bg-transparent border border-[#E5484D] text-[#E5484D] hover:bg-[#E5484D] hover:text-white"
        >
          Delete
        </Button>
      </div>

    </div>
  )
}