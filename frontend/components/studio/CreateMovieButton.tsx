"use client"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function CreateMovieButton() {
  const router = useRouter()

  const createMovie = async () => {
    try {
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
    }
  }

  return (
    <Button onClick={createMovie}>
      Create Movie
    </Button>
  )
}