"use client"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateMovieButton() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const createMovie = async () => {
    try {

      setLoading(true)

      const movie = await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify({
          title: "Untitled Movie"
        })
      })

      router.push(`/studio/${movie.id}`)

    } catch (error) {

      console.error(error)
      alert("Failed to create movie")

    } finally {

      setLoading(false)

    }
  }

  return (
    <Button onClick={createMovie} disabled={loading}>
      {loading ? "Creating..." : "Create Movie"}
    </Button>
  )
}