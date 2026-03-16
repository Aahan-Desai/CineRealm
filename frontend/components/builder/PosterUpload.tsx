"use client"

import { useState } from "react"
import { Movie } from "@/types/movie"
import { updateMovie } from "@/lib/movies"

import { Button } from "@/components/ui/button"

export default function PosterUpload({
  movie,
  onUpdate
}: {
  movie: Movie
  onUpdate: (movie: Movie) => void
}) {

  const [uploading, setUploading] = useState(false)

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return

    try {

      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        {
          method: "POST",
          body: formData
        }
      )

      const data = await res.json()

      const updated = await updateMovie(movie.id, {
        posterUrl: data.url
      })

      onUpdate(updated)

    } catch (error) {
      console.error(error)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">

      {movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt="Poster"
          className="w-48 rounded-md"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {uploading && <p>Uploading...</p>}

    </div>
  )
}