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
      ? "rounded-xl bg-[#151821] px-3 py-2 text-sm font-medium text-[#E5484D]"
      : "rounded-xl px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:bg-[#151821]/50 hover:text-[#F1F5F9]";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-foreground tracking-tighter hover:opacity-80 transition-opacity">
          CineRealm
        </Link>

        <nav className="flex items-center gap-1">
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
        </nav>

        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 hover:bg-white/10 transition-colors"
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
                <ChevronDown size={14} className="text-muted-foreground mr-1" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#12141a] p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <Link
                    href={`/profile/${user?.username || "me"}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
                  >
                    Profile
                  </Link>

                  <div className="h-px bg-white/5 my-1.5" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}