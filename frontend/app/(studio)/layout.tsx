import StudioSidebar from "@/components/layout/StudioSidebar"

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">

      <StudioSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>

    </div>
  )
}