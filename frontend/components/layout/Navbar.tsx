"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [mounted, setMounted] = useState(false);

  // 🔥 Hydrate Zustand
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // 🔥 Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="font-bold text-xl">
          CineRealm
        </Link>

        <div className="flex gap-6 items-center">

          <Link href="/explore">Explore</Link>

          {token ? (
            <>
              <Link href="/feed">Feed</Link>
              <Link href="/studio">Studio</Link>

              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

        </div>
      </div>
    </header>
  );
}