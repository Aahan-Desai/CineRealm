"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"

export default function Navbar() {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

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
              <Link href="/studio">Studio</Link>

              <Button
                variant="outline"
                onClick={logout}
              >
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
  )
}