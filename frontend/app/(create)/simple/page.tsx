"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SimpleCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !synopsis) return;

    setLoading(true);

    try {
      const movie = await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify({
          title,
          synopsis,
          creationType: "simple"
        })
      });

      router.push(`/movies/${movie.slug}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Quick Create</h1>

      <input
        placeholder="Movie title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-zinc-900 rounded-lg"
      />

      <textarea
        placeholder="What's the story?"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        className="w-full p-3 bg-zinc-900 rounded-lg h-40"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-white text-black rounded-lg"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}