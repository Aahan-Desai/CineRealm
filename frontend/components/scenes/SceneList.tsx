import { Scene } from "@/types/scene"
import { Character } from "@/types/character"
import SceneCard from "./SceneCard"

export default function SceneList({
  scenes,
  characters,
  onUpdate,
  onDelete
}: {
  scenes: Scene[]
  characters: Character[]
  onUpdate: (scene: Scene) => void
  onDelete: (id: string) => void
}) {

  if (!scenes.length) {
    return <p className="text-muted-foreground">No scenes yet.</p>
  }

  return (
    <div className="space-y-4">

      {scenes.map(scene => (
        <SceneCard
          key={scene.id}
          scene={scene}
          characters={characters}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

    </div>
  )
}
