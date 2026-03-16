export default function MovieCharacters({ characters }: any) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Characters</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {characters.map((char: any) => (
          <div key={char.id}>
            <img
              src={char.avatarUrl}
              className="rounded-lg aspect-square object-cover"
            />
            <p className="font-medium">{char.name}</p>
            <p className="text-sm text-muted-foreground">
              {char.actorName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}