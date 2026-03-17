"use client";

import { useState, useMemo } from "react";
import StarRating from "./StarRating";
import { useAuthStore } from "@/store/authStore";

export default function MovieRating({
  movieId,
  ratings,
  currentUserId,
}: any) {

  const [userRating, setUserRating] = useState<number | null>(() => {
    const existing = ratings.find(
      (r: any) => r.userId === currentUserId
    );
    return existing?.rating || null;
  });

  const [allRatings, setAllRatings] = useState(ratings);

  const { avg, count } = useMemo(() => {
    if (!allRatings.length) return { avg: 0, count: 0 };

    const total = allRatings.reduce(
      (sum: number, r: any) => sum + r.rating,
      0
    );

    return {
      avg: total / allRatings.length,
      count: allRatings.length,
    };
  }, [allRatings]);

  const handleRate = async (value: number) => {
    try {
      setUserRating(value); 

      const res = await fetch("/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, rating: value }),
      });

      const newRating = await res.json();

      setAllRatings((prev: any) => {
        const filtered = prev.filter(
          (r: any) => r.userId !== newRating.userId
        );
        return [...filtered, newRating];
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-12 space-y-4">

      <h2 className="text-xl font-semibold">
        Rate this movie
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">
          {avg.toFixed(1)}
        </span>

        <span className="text-muted-foreground text-sm">
          ({count} ratings)
        </span>
      </div>

      <StarRating
        value={userRating || 0}
        onChange={handleRate}
      />

      {userRating && (
        <p className="text-sm text-muted-foreground">
          You rated this movie {userRating} stars
        </p>
      )}

    </div>
  );
}

const user = useAuthStore((state) => state.user);