"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Film, Home, User } from "lucide-react"

export default function StudioSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Studio", href: "/studio", icon: Film },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-[#262A35]/60 bg-[#0F1115] px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#F1F5F9]">CineRealm</h2>
        <p className="text-sm text-[#6B7280]">Creator platform</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-[#151821] px-3 py-2 text-sm font-medium text-[#E5484D]"
                  : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:bg-[#151821]/50 hover:text-[#F1F5F9]"
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}