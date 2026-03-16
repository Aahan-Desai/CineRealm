import Link from "next/link";

export default function ExploreMovieCard({ movie }: any) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <div className="space-y-2 cursor-pointer hover:opacity-90">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="rounded-lg aspect-2/3 object-cover"
        />

        <div>
          <h3 className="font-semibold">{movie.title}</h3>

          <p className="text-sm text-muted-foreground">
            {movie.genre} • {movie.runtime} min
          </p>
        </div>
      </div>
    </Link>
  );
}