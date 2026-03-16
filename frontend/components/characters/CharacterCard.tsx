export default function CharacterCard({
  character
}: {
  character: any
}) {

  return (
    <div className="border rounded-md p-4 flex items-center gap-4">

      {character.avatarUrl ? (
        <img
          src={character.avatarUrl}
          alt={character.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm">
          ?
        </div>
      )}

      <div>

        <p className="font-medium">
          {character.name}
        </p>

        {character.actorName && (
          <p className="text-sm text-muted-foreground">
            Actor: {character.actorName}
          </p>
        )}

      </div>

    </div>
  )
}