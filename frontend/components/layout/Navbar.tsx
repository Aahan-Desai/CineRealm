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
    <header className="sticky top-0 z-40 border-b border-[#262A35]/60 bg-[#0F1115]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#F1F5F9]">
          CineRealm
        </Link>

        <nav className="flex items-center gap-2">
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
                className="flex items-center gap-2 rounded-xl border border-[#262A35]/60 bg-[#151821]/40 px-2.5 py-1.5 hover:bg-[#151821]/60"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full border border-[#262A35]/60 bg-[#151821]">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={`${user.username} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm font-bold text-[#F1F5F9]">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronDown size={16} className="text-[#9CA3AF]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#262A35]/50 bg-[#151821] backdrop-blur p-2 shadow-sm">
                  <Link
                    href={`/profile/${user?.username || "me"}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[#F1F5F9] hover:bg-[#0F1115]/50"
                  >
                    <span>Profile</span>
                  </Link>

                  <div className="h-px bg-[#262A35]/50 my-2" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#9CA3AF] hover:bg-[#0F1115]/50 hover:text-[#F1F5F9]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#E5484D] px-4 py-2 text-sm font-semibold text-[#ffffff] hover:bg-[#E5484D]/80"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}