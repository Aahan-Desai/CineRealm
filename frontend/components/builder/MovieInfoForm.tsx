"use client"

import { useState } from "react"
import { Movie } from "@/types/movie"
import { updateMovie } from "@/lib/movies"

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

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {

      setLoading(true)

      const updated = await updateMovie(movie.id, {
        title,
        genre,
        runtime: runtime || undefined,
        synopsis
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

      <Input
        placeholder="Movie Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Runtime (minutes)"
        value={runtime}
        onChange={(e) =>
          setRuntime(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <Textarea
        placeholder="Synopsis"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
      />

      <Button
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

    </div>
  )
}