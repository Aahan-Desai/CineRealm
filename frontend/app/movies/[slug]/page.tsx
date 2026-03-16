import { getMovieFull } from "@/lib/movies";

import MovieHeroBanner from "@/components/movie/MovieHeroBanner";
import MovieSynopsis from "@/components/movie/MovieSynopsis";
import MovieCharacters from "@/components/movie/MovieCharacters";
import MovieScenes from "@/components/movie/MovieScenes";
import MovieRating from "@/components/movie/MovieRating";

export default async function MoviePage({ params }: any) {
  const data = await getMovieFull(params.slug);

  return (
    <div className="space-y-12 pb-16">

      <MovieHeroBanner movie={data.movie} />

      <div className="max-w-6xl mx-auto px-6">
        <MovieSynopsis synopsis={data.movie.synopsis} />
        <MovieCharacters characters={data.characters} />
        <MovieScenes scenes={data.scenes} />
        <MovieRating movieId={data.movie.id} />
      </div>

    </div>
  );
}