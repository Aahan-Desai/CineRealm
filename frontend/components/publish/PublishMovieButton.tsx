"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { publishMovie } from "@/lib/movies"

export default function PublishMovieButton({
  movieId,
  isPublished,
  onPublish
}: {
  movieId: string
  isPublished: boolean
  onPublish: () => void
}) {

  const [loading, setLoading] = useState(false)

  const handlePublish = async () => {
    try {

      setLoading(true)

      await publishMovie(movieId)

      onPublish()

    } catch (error) {

      console.error(error)
      alert("Failed to publish movie")

    } finally {

      setLoading(false)

    }
  }

  if (isPublished) {
    return (
      <p className="text-green-600 font-medium">
        This movie is published.
      </p>
    )
  }

  return (
    <Button
      onClick={handlePublish}
      disabled={loading}
    >
      {loading ? "Publishing..." : "Publish Movie"}
    </Button>
  )
}