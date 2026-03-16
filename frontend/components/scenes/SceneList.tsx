import { Scene } from "@/types/scene"
import SceneCard from "./SceneCard"

export default function SceneList({
  scenes,
  onDelete
}: {
  scenes: Scene[]
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
          onDelete={onDelete}
        />
      ))}

    </div>
  )
}