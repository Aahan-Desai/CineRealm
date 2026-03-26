const characterAccentPalette = [
  {
    chip: "border-rose-300/30 bg-rose-400/12 text-rose-100",
    avatar: "border-rose-300/30 bg-rose-400/15 text-rose-100",
    name: "text-rose-200",
    glow: "shadow-[0_0_0_1px_rgba(251,113,133,0.12)]",
  },
  {
    chip: "border-sky-300/30 bg-sky-400/12 text-sky-100",
    avatar: "border-sky-300/30 bg-sky-400/15 text-sky-100",
    name: "text-sky-200",
    glow: "shadow-[0_0_0_1px_rgba(56,189,248,0.12)]",
  },
  {
    chip: "border-amber-300/30 bg-amber-400/12 text-amber-100",
    avatar: "border-amber-300/30 bg-amber-400/15 text-amber-100",
    name: "text-amber-200",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.12)]",
  },
  {
    chip: "border-emerald-300/30 bg-emerald-400/12 text-emerald-100",
    avatar: "border-emerald-300/30 bg-emerald-400/15 text-emerald-100",
    name: "text-emerald-200",
    glow: "shadow-[0_0_0_1px_rgba(52,211,153,0.12)]",
  },
  {
    chip: "border-violet-300/30 bg-violet-400/12 text-violet-100",
    avatar: "border-violet-300/30 bg-violet-400/15 text-violet-100",
    name: "text-violet-200",
    glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.12)]",
  },
  {
    chip: "border-cyan-300/30 bg-cyan-400/12 text-cyan-100",
    avatar: "border-cyan-300/30 bg-cyan-400/15 text-cyan-100",
    name: "text-cyan-200",
    glow: "shadow-[0_0_0_1px_rgba(34,211,238,0.12)]",
  },
];

function hashCharacterSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getCharacterAccent(seed?: string | null) {
  if (!seed) {
    return {
      chip: "border-[#E5484D]/30 bg-[#E5484D]/12 text-[#ffd0d1]",
      avatar: "border-[#E5484D]/30 bg-[#E5484D]/15 text-[#ffd0d1]",
      name: "text-[#ffd0d1]",
      glow: "shadow-[0_0_0_1px_rgba(229,72,77,0.16)]",
    };
  }

  return characterAccentPalette[hashCharacterSeed(seed) % characterAccentPalette.length];
}
