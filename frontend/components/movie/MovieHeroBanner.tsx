export default function MovieHeroBanner({ movie }: any) {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">

      {/* Background */}
      <img
        src={movie.backdropUrl || movie.posterUrl}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover scale-105 brightness-50"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-12">
        <div className="max-w-xl space-y-5">

          <h1 className="text-6xl font-bold tracking-tight">
            {movie.title}
          </h1>

          <p className="text-muted-foreground">
            {movie.genre} • {movie.runtime} min
          </p>

          <p className="text-sm line-clamp-3">
            {movie.synopsis}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
              ⭐ Rate
            </button>

            <button className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg hover:bg-white/30 transition">
              View Creator
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}