"use client";

import { useState } from "react";
import { likeMovie, unlikeMovie } from "@/lib/likes";
import { deleteMovie } from "@/lib/movies";
import Link from "next/link";

type Movie = {
  id: string;
  title: string;
  genre?: string;
  runtime?: number;
  posterUrl?: string;
  visibility?: string;
  isLiked?: boolean;
  likeCount?: number;
};

export default function MovieCard({
  movie,
  onDelete,
}: {
  movie: Movie
  onDelete: (movieId: string) => void
}) {
  const [liked, setLiked] = useState(movie.isLiked || false);
  const [count, setCount] = useState(movie.likeCount || 0);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const prevLiked = liked;
    const prevCount = count;

    setLiked(!prevLiked);
    setCount(prevLiked ? count - 1 : count + 1);

    try {
      if (prevLiked) {
        await unlikeMovie(movie.id);
      } else {
        await likeMovie(movie.id);
      }
    } catch (err) {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleting) return;

    const confirmed = window.confirm(`Delete "${movie.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteMovie(movie.id);
      onDelete(movie.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete movie");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Link
      href={`/studio/${movie.id}`}
      className="block rounded-lg border overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-2/3 bg-muted">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No Poster
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{movie.title}</h3>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm"
        >
          <span className={liked ? "text-red-500" : "text-gray-400"}>
            {liked ? "❤️" : "🤍"}
          </span>
          <span>{count}</span>
        </button>

        <p className="text-xs text-muted-foreground">
          {movie.genre || "Genre not set"}
        </p>

        {movie.runtime && (
          <p className="text-xs text-muted-foreground">{movie.runtime} min</p>
        )}
      </div>
    </Link>
  );
}
