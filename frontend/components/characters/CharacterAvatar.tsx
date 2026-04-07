import { cn } from "@/lib/utils";
import {
  getCharacterAvatarTheme,
  getCharacterRoleLabel,
  getCharacterAvatarVariant,
} from "@/lib/utils/characterAvatar";

type CharacterAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
  seed?: string | null;
  shape?: "circle" | "poster";
  className?: string;
  imageClassName?: string;
  showRoleBadge?: boolean;
};

function CharacterFallbackArtwork({
  variant,
  shape,
  toneClassName,
  softToneClassName,
}: {
  variant: number;
  shape: "circle" | "poster";
  toneClassName: string;
  softToneClassName: string;
}) {
  const baseClassName = cn(
    "absolute inset-0 h-full w-full",
    shape === "poster" ? "scale-[1.02]" : "scale-[1.14]"
  );

  switch (variant) {
    case 0:
      return (
        <svg viewBox="0 0 160 220" className={baseClassName} aria-hidden="true">
          <ellipse cx="76" cy="84" rx="34" ry="40" className={softToneClassName} />
          <path d="M32 208c12-40 36-60 48-60s35 19 48 60H32Z" className={toneClassName} />
          <path d="M44 93c0-31 16-52 43-52 19 0 36 11 43 28-12-6-21-8-31-8-22 0-38 15-55 32Z" className={toneClassName} />
          <path d="M50 111c6-17 20-30 36-30 16 0 28 12 32 31 1 5 2 10 2 16 0 24-15 46-34 46-22 0-40-24-36-63Z" className={toneClassName} />
          <path d="M58 161c8 8 18 13 28 13 11 0 21-5 29-14 12 7 21 18 28 35H25c8-18 20-28 33-34Z" className={softToneClassName} />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 160 220" className={baseClassName} aria-hidden="true">
          <path d="M28 205c8-32 28-53 47-58 2 10 11 18 22 18 10 0 20-8 21-18 21 5 40 26 47 58H28Z" className={toneClassName} />
          <path d="M80 36c31 0 48 24 48 57 0 13-1 23-5 34l-12-8-9 15-9-11-13 10-12-11-13 11-8-15-15 11c-4-11-5-23-5-36 0-34 18-57 53-57Z" className={toneClassName} />
          <ellipse cx="80" cy="105" rx="34" ry="42" className={softToneClassName} />
          <path d="M48 87c5-27 20-43 44-43 21 0 37 12 43 33-8-4-18-5-27-5-20 0-39 7-60 15Z" className={toneClassName} />
          <path d="M57 150c8 7 15 10 23 10 10 0 18-4 28-13 14 8 26 20 35 39H18c11-19 24-30 39-36Z" className={softToneClassName} />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 160 220" className={baseClassName} aria-hidden="true">
          <path d="M26 206c11-31 31-49 55-49 24 0 44 18 55 49H26Z" className={toneClassName} />
          <path d="M46 92c0-28 16-49 40-49 26 0 42 20 42 49 0 9-2 18-5 28-7 20-20 35-37 35-23 0-40-26-40-63Z" className={toneClassName} />
          <path d="M48 85c4-19 16-32 34-38 19-6 36-1 50 15-6-1-12-1-17 0-17 2-28 9-43 22-8 7-16 14-24 20V85Z" className={softToneClassName} />
          <path d="M32 92c4-21 18-37 42-47 26-10 52-4 67 15-11 0-22 3-31 8-12 6-23 14-34 24-13-2-26-2-44 0Z" className={toneClassName} />
          <path d="M60 161c8 6 16 9 26 9 9 0 18-4 28-11 12 8 23 18 32 33H18c11-16 25-25 42-31Z" className={softToneClassName} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 160 220" className={baseClassName} aria-hidden="true">
          <path d="M21 205c9-20 20-34 34-43 10-6 18-9 25-9 5 9 12 13 21 13s16-4 21-13c7 0 15 3 24 9 14 9 26 23 34 43H21Z" className={toneClassName} />
          <path d="M47 100c0-34 14-57 40-57s40 23 40 57c0 14-3 27-8 38-7 16-19 29-32 29-25 0-40-33-40-67Z" className={softToneClassName} />
          <path d="M34 102c0-19 4-36 13-49 10-15 25-24 42-24 30 0 53 25 53 60-11-10-26-17-43-17-23 0-45 12-65 30Z" className={toneClassName} />
          <path d="M41 92c8-8 15-14 23-18 11-7 23-10 37-10 15 0 27 4 39 11-8-28-26-43-51-43-27 0-46 20-48 60Z" className={softToneClassName} />
          <path d="M59 160c7 8 16 12 27 12 9 0 18-3 27-10 12 8 24 18 35 36H16c10-18 23-29 43-38Z" className={softToneClassName} />
        </svg>
      );
  }
}

export default function CharacterAvatar({
  name,
  avatarUrl,
  role,
  seed,
  shape = "circle",
  className,
  imageClassName,
  showRoleBadge = false,
}: CharacterAvatarProps) {
  const theme = getCharacterAvatarTheme(seed || name);
  const variant = getCharacterAvatarVariant(seed || name);
  const roleLabel = getCharacterRoleLabel(role);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border bg-black/20",
        shape === "poster" ? "rounded-[22px]" : "rounded-full",
        theme.ring,
        className
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <>
          <div className={cn("absolute inset-0 bg-gradient-to-br", theme.surface)} />
          <div className={cn("absolute inset-0 opacity-90", theme.halo)} />
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
          <div
            className={cn(
              "relative flex h-full w-full items-center justify-center overflow-hidden",
              shape === "poster" ? "px-3 pb-8 pt-4" : "p-0"
            )}
          >
            <div
              className={cn(
                "absolute left-1/2 top-[18%] h-[34%] w-[68%] -translate-x-1/2 rounded-full blur-2xl",
                theme.accent
              )}
            />
            <CharacterFallbackArtwork
              variant={variant}
              shape={shape}
              toneClassName={theme.portrait}
              softToneClassName={theme.portraitSoft}
            />
          </div>
          {showRoleBadge ? (
            <div
              className={cn(
                "absolute bottom-2.5 left-2.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.24em]",
                theme.badge
              )}
            >
              {roleLabel}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
