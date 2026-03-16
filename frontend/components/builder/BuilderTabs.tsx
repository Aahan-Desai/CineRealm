"use client"

import { useState } from "react"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"

import { Movie } from "@/types/movie"

import MovieInfoForm from "./MovieInfoForm"
import PosterUpload from "./PosterUpload"

export default function BuilderTabs({
  movie
}: {
  movie: Movie
}) {

  const [movieState, setMovieState] = useState(movie)

  const handleUpdate = (updatedMovie: Movie) => {
    setMovieState(updatedMovie)
  }

  return (
    <Tabs defaultValue="info" className="space-y-6">

      <TabsList>

        <TabsTrigger value="info">
          Movie Info
        </TabsTrigger>

        <TabsTrigger value="characters">
          Characters
        </TabsTrigger>

        <TabsTrigger value="scenes">
          Scenes
        </TabsTrigger>

        <TabsTrigger value="publish">
          Publish
        </TabsTrigger>

      </TabsList>

      {/* MOVIE INFO TAB */}

      <TabsContent value="info">

        <div className="grid md:grid-cols-2 gap-10">

          <PosterUpload
            movie={movieState}
            onUpdate={handleUpdate}
          />

          <MovieInfoForm
            movie={movieState}
            onUpdate={handleUpdate}
          />

        </div>

      </TabsContent>

      {/* CHARACTERS TAB */}

      <TabsContent value="characters">

        <p className="text-muted-foreground">
          Character manager coming soon.
        </p>

      </TabsContent>

      {/* SCENES TAB */}

      <TabsContent value="scenes">

        <p className="text-muted-foreground">
          Scene editor coming soon.
        </p>

      </TabsContent>

      {/* PUBLISH TAB */}

      <TabsContent value="publish">

        <p className="text-muted-foreground">
          Publish settings coming soon.
        </p>

      </TabsContent>

    </Tabs>
  )
}