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
    <aside className="w-64 shrink-0 border-r border-white/5 bg-background px-4 py-8 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-primary"
                  : "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/0.03 hover:text-foreground transition-all"
              }
            >
              <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground/70"} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto px-4 pt-8">
        <div className="rounded-2xl bg-linear-to-br from-primary/10 to-transparent p-4 border border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">CineRealm Studio</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">Direct your story. Define your world.</p>
        </div>
      </div>
    </aside>
  )
}