"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFeed } from "@/lib/movies";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/skeletons/MovieCardSkeleton";
import { Movie } from "@/types/movie";
import Suggestions from "@/components/ui/suggestions";

export default function FeedPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || fetchingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchingMore, hasMore]
  );

  useEffect(() => {
    const fetchInitialFeed = async () => {
      setLoading(true);
      try {
        const data = (await getFeed(1, 8)) as Movie[];
        setMovies(data);
        if (data.length < 8) setHasMore(false);
      } catch (error) {
        console.error("FEED ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialFeed();
  }, []);

  useEffect(() => {
    if (page === 1) return;

    const fetchMore = async () => {
      setFetchingMore(true);
      try {
        const data = (await getFeed(page, 8)) as Movie[];

        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovies = data.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMovies];
        });

        if (data.length < 8) setHasMore(false);
      } catch (error) {
        console.error("LOAD MORE ERROR:", error);
      } finally {
        setFetchingMore(false);
      }
    };

    fetchMore();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-(--text-primary)">
          Feed
        </h1>
        <p className="text-(--text-secondary) mt-1">
          Discover movies from creators you follow
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* FEED */}
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

            {/* loading more skeletons */}
            {fetchingMore &&
              Array.from({ length: 4 }).map((_, i) => (
                <MovieCardSkeleton key={`more-${i}`} />
              ))}
          </div>

          {/* empty state */}
          {!loading && movies.length === 0 && (
            <p className="mt-8 text-sm text-(--text-muted)">
              Follow creators to see their movies here.
            </p>
          )}

          {/* end state */}
          {!loading && !hasMore && movies.length > 0 && (
            <p className="mt-6 text-center text-sm text-(--text-muted)">
              You have caught up with all posts.
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-24">
          <Suggestions />
        </aside>
      </div>
    </div>
  );
}