export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* sidebar later */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}