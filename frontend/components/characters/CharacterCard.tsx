export default function CharacterCard({
  character
}: {
  character: any
}) {

  return (
    <div className="border rounded-xl p-5 flex gap-5 bg-[#12141A]/50 border-white/5 shadow-xs transition-colors hover:bg-[#1A1D26]">
      {character.avatarUrl ? (
        <img
          src={character.avatarUrl}
          alt={character.name}
          className="w-14 h-14 rounded-full object-cover shrink-0 shadow-md"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black shrink-0 shadow-inner text-white/40">
          ?
        </div>
      )}

      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <p className="font-bold text-lg leading-tight text-white tracking-tight">
            {character.name}
          </p>
          {character.role && (
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 bg-[#E5484D]/10 text-[#E5484D] rounded-full border border-[#E5484D]/20">
              {character.role}
            </span>
          )}
        </div>
        
        {character.actorName && (
          <p className="text-sm text-white/50 font-medium">
            Played by <span className="text-white/80">{character.actorName}</span>
          </p>
        )}

        {character.traits && (
          <p className="text-xs text-white/70 mt-1">
            <span className="font-black text-white/30 uppercase tracking-widest text-[9px] mr-1.5">Traits</span>
            {character.traits}
          </p>
        )}

        {character.shortBio && (
          <p className="text-sm text-white/70 mt-2.5 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed shadow-inner">
            {character.shortBio}
          </p>
        )}
      </div>
    </div>
  )
}