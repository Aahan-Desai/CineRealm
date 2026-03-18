import { getMovieFull } from "@/lib/movies";
import MovieHeroBanner from "@/components/movie/MovieHeroBanner";
import MovieSynopsis from "@/components/movie/MovieSynopsis";
import MovieCharacters from "@/components/movie/MovieCharacters";
import MovieScenes from "@/components/movie/MovieScenes";
import MovieRating from "@/components/movie/MovieRating";
import MovieLikeButton from "@/components/movie/MovieLikeButton";
import { MovieFullResponse } from "@/types/movieFull";

export default async function MoviePage({ params }: any) {
  const data: MovieFullResponse = await getMovieFull(params.slug);
  const user = null;

  return (
    <div className="space-y-12 pb-16">
      <MovieHeroBanner movie={data.movie} ratings={data.ratings} />

      <div className="max-w-6xl mx-auto px-6">
        <MovieLikeButton movie={data.movie} />
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <MovieSynopsis synopsis={data.movie.synopsis} />

        <MovieCharacters characters={data.characters} />

        <MovieScenes scenes={data.scenes} />

        <MovieRating movieId={data.movie.id} ratings={data.ratings} />
      </div>
    </div>
  );
}
