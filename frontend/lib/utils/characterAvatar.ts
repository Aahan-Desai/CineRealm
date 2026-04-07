const characterAvatarThemes = [
  {
    surface: "from-[#5f1d2a] via-[#201017] to-[#09090b]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.3),transparent_48%)]",
    ring: "border-rose-300/20",
    portrait: "text-rose-50/95",
    portraitSoft: "text-rose-200/35",
    accent: "bg-rose-200/80",
    badge: "border-rose-300/20 bg-rose-300/12 text-rose-100",
  },
  {
    surface: "from-[#16304d] via-[#0b1727] to-[#06080e]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.28),transparent_48%)]",
    ring: "border-sky-300/20",
    portrait: "text-sky-50/95",
    portraitSoft: "text-sky-200/35",
    accent: "bg-sky-200/80",
    badge: "border-sky-300/20 bg-sky-300/12 text-sky-100",
  },
  {
    surface: "from-[#4a3310] via-[#191207] to-[#090807]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(253,224,71,0.24),transparent_48%)]",
    ring: "border-amber-300/20",
    portrait: "text-amber-50/95",
    portraitSoft: "text-amber-200/35",
    accent: "bg-amber-200/80",
    badge: "border-amber-300/20 bg-amber-300/12 text-amber-100",
  },
  {
    surface: "from-[#113d33] via-[#0b1615] to-[#060808]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.26),transparent_48%)]",
    ring: "border-emerald-300/20",
    portrait: "text-emerald-50/95",
    portraitSoft: "text-emerald-200/35",
    accent: "bg-emerald-200/80",
    badge: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  },
  {
    surface: "from-[#33205a] via-[#161120] to-[#07070b]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(196,181,253,0.26),transparent_48%)]",
    ring: "border-violet-300/20",
    portrait: "text-violet-50/95",
    portraitSoft: "text-violet-200/35",
    accent: "bg-violet-200/80",
    badge: "border-violet-300/20 bg-violet-300/12 text-violet-100",
  },
  {
    surface: "from-[#0f3c46] via-[#0a1519] to-[#060808]",
    halo: "bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.26),transparent_48%)]",
    ring: "border-cyan-300/20",
    portrait: "text-cyan-50/95",
    portraitSoft: "text-cyan-200/35",
    accent: "bg-cyan-200/80",
    badge: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
  },
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getCharacterInitials(name?: string | null) {
  const normalizedName = name?.trim();

  if (!normalizedName) return "?";

  const parts = normalizedName
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  if (!parts.length) return normalizedName.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getCharacterAvatarVariant(seed?: string | null) {
  const normalizedSeed = seed?.trim();

  if (!normalizedSeed) return 0;

  return hashSeed(normalizedSeed) % 4;
}

export function getCharacterRoleLabel(role?: string | null) {
  switch (role?.trim().toLowerCase()) {
    case "protagonist":
      return "Lead";
    case "antagonist":
      return "Rival";
    case "supporting":
      return "Cast";
    default:
      return "Role";
  }
}

export function getCharacterAvatarTheme(seed?: string | null) {
  const normalizedSeed = seed?.trim();

  if (!normalizedSeed) {
    return characterAvatarThemes[0];
  }

  return characterAvatarThemes[hashSeed(normalizedSeed) % characterAvatarThemes.length];
}
