import { Character } from "@/types/character"
import CharacterCard from "./CharacterCard"

export default function CharacterList({
  characters
}: {
  characters: Character[]
}) {

  if (!characters || characters.length === 0) {
    return (
      <p className="text-muted-foreground">
        No characters yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">

      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
        />
      ))}

    </div>
  )
}