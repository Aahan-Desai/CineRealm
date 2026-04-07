import { cn } from "@/lib/utils";
import {
  getCharacterAvatarTheme,
  getCharacterInitials,
  getCharacterRoleLabel,
} from "@/lib/utils/characterAvatar";

type CharacterAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
  seed?: string | null;
  shape?: "circle" | "poster";
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
  showRoleBadge?: boolean;
};

export default function CharacterAvatar({
  name,
  avatarUrl,
  role,
  seed,
  shape = "circle",
  className,
  imageClassName,
  initialsClassName,
  showRoleBadge = false,
}: CharacterAvatarProps) {
  const theme = getCharacterAvatarTheme(seed || name);
  const initials = getCharacterInitials(name);
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
            <div
              className={cn(
                "relative font-black uppercase tracking-[0.08em] drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]",
                theme.initial,
                shape === "poster" ? "text-3xl md:text-[2rem]" : "text-sm",
                initialsClassName
              )}
            >
              {initials}
            </div>
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
