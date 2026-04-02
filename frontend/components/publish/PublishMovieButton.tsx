"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { publishMovie } from "@/lib/movies"

export default function PublishMovieButton({
  movieId,
  movieSlug,
  visibility,
  isPublished,
  onPublish
}: {
  movieId: string
  movieSlug: string
  visibility?: string
  isPublished: boolean
  onPublish: () => void
}) {

  const [loading, setLoading] = useState(false)
  const isViewerAccessible =
    isPublished && visibility?.toUpperCase() === "PUBLIC"

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

  if (isViewerAccessible) {
    return (
      <div className="space-y-3">
        <p className="text-green-600 font-medium">
          This movie is published.
        </p>

        <Button asChild variant="outline">
          <Link href={`/movies/${movieSlug}`} target="_blank" rel="noreferrer">
            View as viewer
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {isPublished && (
        <p className="text-amber-500 font-medium">
          This movie is published, but it is still private to viewers.
        </p>
      )}

      <Button
        onClick={handlePublish}
        disabled={loading}
      >
        {loading
          ? "Publishing..."
          : isPublished
            ? "Make Public"
            : "Publish Movie"}
      </Button>
    </div>
  )
}
