"use client";

import { useState } from "react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { Movie } from "@/types/movie";
import { Character } from "@/types/character";
import { Scene } from "@/types/scene";

import MovieInfoForm from "./MovieInfoForm";
import PosterUpload from "./PosterUpload";

import CharacterForm from "@/components/characters/CharacterForm";
import CharacterList from "@/components/characters/CharacterList";
import ActSection from "@/components/scenes/ActSection";
import PublishMovieButton from "@/components/publish/PublishMovieButton";

export default function BuilderTabs({ movie }: { movie: Movie }) {
  const [movieState, setMovieState] = useState<Movie>(movie);

  const [characters, setCharacters] = useState<Character[]>(
    movie.characters || []
  );

  const [scenes, setScenes] = useState<Scene[]>(movie.scenes || []);

  const handleSceneCreate = (scene: Scene) => {
    setScenes((prev) => [...prev, scene]);
  };

  const handleSceneDelete = (id: string) => {
    setScenes((prev) => prev.filter((scene) => scene.id !== id));
  };

  const handleCharacterCreate = (character: Character) => {
    setCharacters((prev) => [...prev, character]);
  };

  const handleUpdate = (updatedMovie: Movie) => {
    setMovieState(updatedMovie);
  };

  const handlePublish = () => {
    setMovieState((prev) => ({
      ...prev,
      isPublished: true,
    }));
  };

  return (
    <Tabs defaultValue="info" className="space-y-6">
      <TabsList>
        <TabsTrigger value="info">Movie Info</TabsTrigger>
        <TabsTrigger value="characters">Characters</TabsTrigger>
        <TabsTrigger value="scenes">Scenes</TabsTrigger>
        <TabsTrigger value="publish">Publish</TabsTrigger>
      </TabsList>

      {/* MOVIE INFO TAB */}

      <TabsContent value="info">
        <div className="grid md:grid-cols-2 gap-10">
          <PosterUpload movie={movieState} onUpdate={handleUpdate} />

          <MovieInfoForm movie={movieState} onUpdate={handleUpdate} />
        </div>
      </TabsContent>

      {/* CHARACTERS TAB */}

      <TabsContent value="characters">
        <div className="space-y-6">
          <CharacterForm
            movieId={movieState.id}
            onCreate={handleCharacterCreate}
          />

          <CharacterList characters={characters} />
        </div>
      </TabsContent>

      {/* SCENES TAB */}

      <TabsContent value="scenes">
        <div className="space-y-6">
          <ActSection
            movieId={movieState.id}
            actNumber={1}
            scenes={scenes.filter((scene) => scene.actNumber === 1)}
            onCreate={handleSceneCreate}
            onDelete={handleSceneDelete}
          />

          <ActSection
            movieId={movieState.id}
            actNumber={2}
            scenes={scenes.filter((scene) => scene.actNumber === 2)}
            onCreate={handleSceneCreate}
            onDelete={handleSceneDelete}
          />

          <ActSection
            movieId={movieState.id}
            actNumber={3}
            scenes={scenes.filter((scene) => scene.actNumber === 3)}
            onCreate={handleSceneCreate}
            onDelete={handleSceneDelete}
          />
        </div>
      </TabsContent>

      {/* PUBLISH TAB */}

      <TabsContent value="publish">
        <div className="space-y-6 max-w-md">
          <h3 className="text-lg font-semibold">Publish Movie</h3>

          <p className="text-muted-foreground">
            Once published, your movie will appear in the explore page and
            other users will be able to rate it.
          </p>

          <PublishMovieButton
            movieId={movieState.id}
            isPublished={movieState.isPublished}
            onPublish={handlePublish}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}