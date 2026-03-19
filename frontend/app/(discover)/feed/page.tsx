"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getFeed } from "@/lib/movies"
import MovieCard from "@/components/MovieCard"
import MovieCardSkeleton from "@/components/skeletons/MovieCardSkeleton"
import { Movie } from "@/types/movie"

export default function FeedPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [fetchingMore, setFetchingMore] = useState(false)
  
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || fetchingMore) return
      if (observer.current) observer.current.disconnect()
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      
      if (node) observer.current.observe(node)
    },
    [loading, fetchingMore, hasMore]
  )


  useEffect(() => {
    const fetchInitialFeed = async () => {
      setLoading(true)
      try {
        const data = (await getFeed(1, 10)) as Movie[]
        setMovies(data)
        if (data.length < 10) setHasMore(false)
      } catch (error) {
        console.error("FEED ERROR:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialFeed()
  }, [])

  useEffect(() => {
    if (page === 1) return;

    const fetchMore = async () => {
      setFetchingMore(true)
      try {
        const data = (await getFeed(page, 10)) as Movie[]
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const newMovies = data.filter((m) => !existingIds.has(m.id))
          return [...prev, ...newMovies]
        })
        if (data.length < 10) setHasMore(false)
      } catch (error) {
        console.error("More load error:", error)
      } finally {
        setFetchingMore(false)
      }
    }

    fetchMore()
  }, [page])

  const suggestions = useMemo(() => {
    const map = new Map<string, { username: string; avatarUrl?: string }>()
    for (const m of movies) {
      const c = m.creator
      if (!c?.username) continue
      if (!map.has(c.username)) {
        map.set(c.username, { username: c.username, avatarUrl: c.avatarUrl })
      }
      if (map.size >= 5) break
    }
    return Array.from(map.values())
  }, [movies])

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F1F5F9]">Feed</h1>
        <p className="text-[#9CA3AF] mt-1">
          Discover movies from creators you follow
        </p>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <MovieCardSkeleton key={`skeleton-${i}`} />
              ))
            ) : (
              movies.map((movie, index) => (
                <div
                  key={movie.id}
                  ref={movies.length === index + 1 ? lastElementRef : undefined}
                >
                  <MovieCard movie={movie} />
                </div>
              ))
            )}

            {fetchingMore &&
              !loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <MovieCardSkeleton key={`more-skeleton-${i}`} />
              ))}
          </div>

          {!loading && movies.length === 0 && (
            <p className="mt-8 text-sm text-[#6B7280]">
              Follow creators to see their movies here.
            </p>
          )}

          {!loading && !hasMore && movies.length > 0 && (
            <p className="mt-6 text-center text-sm text-[#6B7280]">
              You have caught up with all posts.
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="rounded-2xl border border-[#262A35]/50 bg-[#1A1D26] p-4">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">
              Suggestions for you
            </h2>

            <div className="mt-4 space-y-3">
              {suggestions.map((u) => (
                <div
                  key={u.username}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#262A35]/50 bg-[#151821]">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={`${u.username} avatar`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-sm font-bold text-[#F1F5F9]">
                            {u.username[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${u.username}`}
                        className="block truncate text-sm font-medium text-[#F1F5F9] hover:underline"
                      >
                        {u.username}
                      </Link>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="rounded-xl border border-[#262A35] bg-transparent px-3 py-1.5 text-sm font-medium text-[#9CA3AF] opacity-70"
                  >
                    Follow
                  </button>
                </div>
              ))}

              {suggestions.length === 0 && (
                <p className="text-sm text-[#6B7280]">
                  Suggestions will appear as your feed loads.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}