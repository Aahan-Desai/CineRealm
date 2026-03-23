export default function MovieCharacters({ characters }: { characters: any[] }) {
  if (!characters?.length) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Cast</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {characters.map((char: any) => (
          <div key={char.id} className="group space-y-4">
            <div className="aspect-3/4 rounded-3xl overflow-hidden border border-white/10 relative group">
              <img
                src={char.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${char.name}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                alt={char.name}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#070809] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                {char.name}
              </p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                {char.actorName || "Uncast Role"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}