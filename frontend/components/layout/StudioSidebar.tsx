"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Compass, User } from "lucide-react"

export default function StudioSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Studio",
      href: "/studio",
      icon: Film,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
    },
    {
      name: "Profile",
      href: "/profile/me",
      icon: User,
    },
  ]

  return (
    <aside className="w-64 border-r bg-background h-screen p-6">

      <div className="mb-10">
        <h2 className="text-xl font-bold">CineRealm</h2>
        <p className="text-sm text-muted-foreground">
          Movie Studio
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                ${isActive
                  ? "bg-muted font-medium"
                  : "text-muted-foreground hover:bg-muted"}
              `}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}