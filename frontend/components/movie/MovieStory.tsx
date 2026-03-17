export default function MovieScenes({ scenes }: { scenes: any[] }) {
  const acts = [1, 2, 3];

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-xl font-semibold">Story</h2>

      {acts.map((act) => (
        <div key={act}>
          <h3 className="font-semibold mb-2">ACT {act}</h3>

          <div className="space-y-4">
            {scenes
              ?.filter((s: any) => s.actNumber === act)
              .map((scene: any) => (
                <div key={scene.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{scene.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {scene.scriptText}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}