"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  if (!mounted) return null;

  const isActive = (href: string) => {
    if (href === "/feed") return pathname?.startsWith("/feed");
    if (href === "/explore") return pathname?.startsWith("/explore");
    if (href === "/studio") return pathname?.startsWith("/studio");
    return pathname === href;
  };

  const navLinkClass = (active: boolean) =>
    active
      ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
      : "rounded-full px-4 py-2 text-sm font-medium text-white/62 transition-colors hover:text-white";

  return (
    <header className="sticky top-0 z-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/45 to-transparent" />
      <div className="flex h-[76px] items-center gap-4 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-[1.55rem] font-black uppercase tracking-[-0.08em] text-white transition-opacity hover:opacity-85"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="CineRealm logo"
            className="h-9 w-9 rounded-[10px] object-cover shadow-[0_8px_22px_rgba(0,0,0,0.35)]"
          />
          Cine<span className="text-[#E5484D]">Realm</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/35 p-1.5 backdrop-blur-xl">
            <Link
              href="/explore"
              className={navLinkClass(isActive("/explore"))}
            >
              Explore
            </Link>

            {token && (
              <>
                <Link href="/feed" className={navLinkClass(isActive("/feed"))}>
                  Feed
                </Link>
                <Link
                  href="/studio"
                  className={navLinkClass(isActive("/studio"))}
                >
                  Studio
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {token ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-muted">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={`${user.username} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs font-bold text-foreground">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-white/82 sm:block">
                  {user?.username || "Profile"}
                </span>
                <ChevronDown size={14} className="mr-1 text-muted-foreground" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-white/10 bg-[#101217]/96 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
                  <Link
                    href={`/profile/${user?.username || "me"}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
                  >
                    Profile
                  </Link>

                  <div className="my-1.5 h-px bg-white/5" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
