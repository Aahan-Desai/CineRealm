"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFeed } from "@/lib/movies";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";
import Suggestions from "@/components/ui/suggestions";
import MovieCardSkeleton from "@/components/skeletons/MovieCardSkeleton";

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
    [loading, fetchingMore, hasMore],
  );

  useEffect(() => {
    const fetchInitialFeed = async () => {
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
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-3">
          Feed
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
          Discover cinematic stories from the creators you follow.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* FEED */}
        <div className="flex-1 min-w-0 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {/* movies */}
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                ref={movies.length === index + 1 ? lastElementRef : undefined}
              >
                <MovieCard movie={movie} />
              </div>
            ))}

            {/* initial skeleton */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <MovieCardSkeleton key={`skeleton-${i}`} />
              ))}

            {/* loading more skeletons */}
            {fetchingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <MovieCardSkeleton key={`more-${i}`} />
              ))}
          </div>

          {/* empty state */}
          {!loading && movies.length === 0 && (
            <div className="mt-20 text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-lg font-semibold text-foreground mb-2">Your feed is waiting.</p>
              <p className="text-muted-foreground max-w-sm mx-auto">Follow some creators to see their cinematic worlds unfold here.</p>
            </div>
          )}

          {/* end state */}
          {!loading && !hasMore && movies.length > 0 && (
            <p className="mt-16 text-center text-sm font-semibold tracking-widest uppercase text-muted-foreground/40">
              End of the reel
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-28">
          <Suggestions />
        </aside>
      </div>
    </div>
  );
}
