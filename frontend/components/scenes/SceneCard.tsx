"use client"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { updateScene, deleteScene } from "@/lib/scenes"

import { Choice, Scene, SceneBlock } from "@/types/scene"
import { Character } from "@/types/character"

export default function SceneCard({
  scene,
  characters,
  onUpdate,
  onDelete
}: {
  scene: Scene
  characters: Character[]
  onUpdate: (scene: Scene) => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState(scene.title || "")
  const [scriptText, setScriptText] = useState(scene.scriptText || "")
  const [mood, setMood] = useState(scene.mood || "")
  const [blocks, setBlocks] = useState<SceneBlock[]>(scene.blocks || [])
  const [choices, setChoices] = useState<Choice[]>(scene.choices || [])
  const [isEditing, setIsEditing] = useState(
    !scene.scriptText &&
      !(scene.blocks && scene.blocks.length > 0) &&
      !(scene.choices && scene.choices.length > 0)
  )
  const [blocksDirty, setBlocksDirty] = useState(false)
  const [choicesDirty, setChoicesDirty] = useState(false)
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    (scene.characters || []).map((entry: Character | { character: Character }) =>
      "character" in entry ? entry.character.id : entry.id
    )
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(scene.title || "")
    setScriptText(scene.scriptText || "")
    setMood(scene.mood || "")
    setBlocks(scene.blocks || [])
    setChoices(scene.choices || [])
    setSelectedCharacterIds(
      (scene.characters || []).map((entry: Character | { character: Character }) =>
        "character" in entry ? entry.character.id : entry.id
      )
    )
  }, [scene])

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedScene = await updateScene(scene.id, {
        title: title.trim() || scene.title,
        scriptText,
        mood: mood || undefined,
        characterIds: selectedCharacterIds,
        ...(blocksDirty ? { blocks } : {}),
        ...(choicesDirty ? { choices } : {})
      })
      onUpdate(updatedScene)
      setIsEditing(false)
      setBlocksDirty(false)
      setChoicesDirty(false)
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

  const addBlock = (type: SceneBlock["type"]) => {
    setBlocksDirty(true)
    setBlocks(prev => [
      ...prev,
      {
        id: `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        content: ""
      }
    ])
  }

  const updateBlock = (blockId: string, content: string) => {
    setBlocksDirty(true)
    setBlocks(prev =>
      prev.map(block =>
        block.id === blockId
          ? { ...block, content }
          : block
      )
    )
  }

  const updateBlockCharacter = (blockId: string, characterId: string) => {
    setBlocksDirty(true)
    setBlocks(prev =>
      prev.map(block =>
        block.id === blockId
          ? {
              ...block,
              characterId: characterId || null,
              character:
                characters.find(character => character.id === characterId) || null
            }
          : block
      )
    )
  }

  const removeBlock = (blockId: string) => {
    setBlocksDirty(true)
    setBlocks(prev => prev.filter(block => block.id !== blockId))
  }

  const addChoice = () => {
    setChoicesDirty(true)
    setChoices(prev => [
      ...prev,
      {
        id: `choice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: "",
        outcomeText: ""
      }
    ])
  }

  const updateChoice = (choiceId: string, field: keyof Choice, value: string) => {
    setChoicesDirty(true)
    setChoices(prev =>
      prev.map(choice =>
        choice.id === choiceId
          ? { ...choice, [field]: value }
          : choice
      )
    )
  }

  const removeChoice = (choiceId: string) => {
    setChoicesDirty(true)
    setChoices(prev => prev.filter(choice => choice.id !== choiceId))
  }

  return (
    <div className="border border-white/10 bg-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-bold text-lg text-white/90">
            {title}
          </p>
          <p className="text-xs text-white/45">
            {scriptText?.trim() || blocks.length > 0 || choices.length > 0
              ? "Scene ready for editing"
              : "New scene. Open editor to add details."}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(prev => !prev)}
          className="border-white/15 bg-transparent text-white hover:bg-white/10"
        >
          {isEditing ? "Close Editor" : "Edit Scene"}
        </Button>
      </div>

      {isEditing ? (
        <>
          <Input
            placeholder="Scene title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/50 border-white/10 text-white placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-[#E5484D]"
          />

          <div className="flex items-center justify-end">
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
                    type="button"
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

          <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white/90">Scene Blocks</p>
                <p className="text-sm text-white/50">
                  Optional structured beats. If left empty, the movie still uses the scene text.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => addBlock("DIALOGUE")}
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                >
                  + Add Dialogue
                </Button>

                <Button
                  type="button"
                  onClick={() => addBlock("ACTION")}
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                >
                  + Add Action
                </Button>
              </div>
            </div>

            {blocks.length > 0 ? (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold tracking-wide text-white/70">
                        {block.type === "DIALOGUE" ? `Dialogue ${index + 1}` : `Action ${index + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="text-xs text-[#E5484D] hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    {block.type === "DIALOGUE" && (
                      <select
                        value={block.characterId || ""}
                        onChange={(e) => updateBlockCharacter(block.id, e.target.value)}
                        className="h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E5484D] transition-colors"
                      >
                        <option value="">Select character</option>
                        {characters.map(character => (
                          <option key={character.id} value={character.id}>
                            {character.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <Textarea
                      placeholder={
                        block.type === "DIALOGUE"
                          ? "Write dialogue..."
                          : "Describe the action..."
                      }
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      className="min-h-[110px] bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-[#E5484D] resize-y"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">
                No blocks yet. You can keep using the regular scene text only.
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white/90">Scene Choices</p>
                <p className="text-sm text-white/50">
                  Optional interactive prompts. Clicking a choice only reveals its outcome text.
                </p>
              </div>

              <Button
                type="button"
                onClick={addChoice}
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
              >
                + Add Choice
              </Button>
            </div>

            {choices.length > 0 ? (
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <div
                    key={choice.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold tracking-wide text-white/70">
                        Choice {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeChoice(choice.id)}
                        className="text-xs text-[#E5484D] hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <Textarea
                      placeholder="Choice text..."
                      value={choice.text}
                      onChange={(e) => updateChoice(choice.id, "text", e.target.value)}
                      className="min-h-[80px] bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-[#E5484D] resize-y"
                    />

                    <Textarea
                      placeholder="Outcome text..."
                      value={choice.outcomeText}
                      onChange={(e) => updateChoice(choice.id, "outcomeText", e.target.value)}
                      className="min-h-[100px] bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-[#E5484D] resize-y"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">
                No choices yet. You can keep this scene fully linear.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-white text-black hover:bg-white/90"
            >
              {loading ? "Saving..." : "Save Scene"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-transparent border border-[#E5484D] text-[#E5484D] hover:bg-[#E5484D] hover:text-white"
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-sm text-white/60 truncate">
            {scriptText?.trim()
              ? scriptText.trim()
              : blocks.length > 0
                ? `${blocks.length} scene block${blocks.length > 1 ? "s" : ""} added`
                : choices.length > 0
                  ? `${choices.length} choice${choices.length > 1 ? "s" : ""} added`
                  : "No scene content added yet."}
          </p>

          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-white text-black hover:bg-white/90"
          >
            Edit Scene
          </Button>
        </div>
      )}
    </div>
  )
}
