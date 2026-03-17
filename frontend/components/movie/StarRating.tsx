"use client";

import { useState } from "react";

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 text-2xl cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover || value;

        return (
          <span
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className={
              star <= active
                ? "text-yellow-400"
                : "text-gray-500"
            }
          >
            ★
          </span>
        );
      })}
    </div>
  );
}