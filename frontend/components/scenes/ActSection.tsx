import { Scene } from "@/types/scene"
import SceneForm from "./SceneForm"
import SceneList from "./SceneList"

export default function ActSection({
  movieId,
  actNumber,
  scenes,
  onCreate,
  onDelete
}: {
  movieId: string
  actNumber: number
  scenes: Scene[]
  onCreate: (scene: Scene) => void
  onDelete: (id: string) => void
}) {

  return (
    <div className="space-y-4 border p-4 rounded-md">

      <h3 className="font-semibold">
        Act {actNumber}
      </h3>

      <SceneForm
        movieId={movieId}
        actNumber={actNumber}
        onCreate={onCreate}
      />

      <SceneList
        scenes={scenes}
        onDelete={onDelete}
      />

    </div>
  )
}