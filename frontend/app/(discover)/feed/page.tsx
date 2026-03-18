"use client"

import { useEffect, useState } from "react"
import { getFeed } from "@/lib/movies"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import ExploreMovieCard from "@/components/discover/ExploreMovieCard"

export default function FeedPage() {
  const router = useRouter();
    const user = useAuthStore((s) => s.user);
  
    const [hydrated, setHydrated] = useState(false);
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await getFeed()
        setMovies(data)
      } catch (error) {
        console.error("FEED ERROR:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [])

  if (loading) {
    return <div className="p-6">Loading feed...</div>
  }

  return (
  <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">

    {/* HEADER */}
    <div>
      <h1 className="text-3xl font-bold">
        Your Feed
      </h1>
      <p className="text-gray-400 mt-1">
        Movies from creators you follow
      </p>
    </div>

    {/* CONTENT */}
    {movies.length === 0 ? (
      <div className="text-gray-400 text-sm">
        Follow creators to see their movies here.
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <ExploreMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    )}

  </div>
)
}