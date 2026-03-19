export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="p-6 md:p-8">
        {children}
    </main>
  )
}