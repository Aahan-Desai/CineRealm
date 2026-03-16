"use client"

import { useState } from "react"
import { Movie } from "@/types/movie"
import { updateMovie } from "@/lib/movies"

import PosterUpload from "./PosterUpload";
import BackdropUpload from "./BackdropUpload";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MovieInfoForm({
  movie,
  onUpdate
}: {
  movie: Movie
  onUpdate: (movie: Movie) => void
}) {

  const [title, setTitle] = useState(movie.title)
  const [genre, setGenre] = useState(movie.genre || "")
  const [runtime, setRuntime] = useState<number | "">(movie.runtime || "")
  const [synopsis, setSynopsis] = useState(movie.synopsis || "")

  const [posterUrl, setPosterUrl] = useState(movie.posterUrl || "");
  const [backdropUrl, setBackdropUrl] = useState(movie.backdropUrl || "");

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {

      setLoading(true)

      const updated = await updateMovie(movie.id, {
        title,
        genre,
        runtime: runtime || undefined,
        synopsis,
        posterUrl,
        backdropUrl
      })

      onUpdate(updated)

    } catch (error) {
      console.error(error)
      alert("Failed to update movie")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">

      {/* Title */}
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full border rounded-md p-2 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Genre */}
      <div>
        <label className="text-sm font-medium">Genre</label>
        <input
          className="w-full border rounded-md p-2 mt-1"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>

      {/* Runtime */}
      <div>
        <label className="text-sm font-medium">Runtime (min)</label>
        <input
          type="number"
          className="w-full border rounded-md p-2 mt-1"
          value={runtime}
          onChange={(e) => setRuntime(Number(e.target.value))}
        />
      </div>

      {/* Synopsis */}
      <div>
        <label className="text-sm font-medium">Synopsis</label>
        <textarea
          className="w-full border rounded-md p-2 mt-1"
          rows={4}
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </div>

      {/* Poster Upload */}
      <PosterUpload onUpload={setPosterUrl} />

      {posterUrl && (
        <img
          src={posterUrl}
          className="w-32 rounded-lg mt-2"
        />
      )}

      {/* Backdrop Upload 🔥 */}
      <BackdropUpload onUpload={setBackdropUrl} />

      {backdropUrl && (
        <img
          src={backdropUrl}
          className="w-full h-40 object-cover rounded-lg mt-2"
        />
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        Save Changes
      </button>

    </div>
  );
}