"use client";

import { useState } from "react";
import { likeMovie, unlikeMovie } from "@/lib/likes";
import { Movie } from "@/types/movie";

export default function MovieLikeButton({ movie }: { movie: any }) {
  const [liked, setLiked] = useState(movie.isLiked);
  const [count, setCount] = useState(movie.likeCount);
  const [loading, setLoading] = useState(false);

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

  return (
    <button onClick={handleLike} className="flex items-center gap-2 text-sm z-10 relative">
      <span className={liked ? "text-red-500" : "text-gray-400"}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span>{count}</span>
    </button>
  );
}
