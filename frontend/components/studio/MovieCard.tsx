"use client"

import { Movie } from "@/types/movie"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link href={`/studio/${movie.id}`}>
      <Card className="hover:shadow-lg transition cursor-pointer">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">
            {movie.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {movie.genre || "No genre"}
          </p>

          <p className="text-xs text-muted-foreground">
            {movie.isPublished ? "Published" : "Draft"}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}