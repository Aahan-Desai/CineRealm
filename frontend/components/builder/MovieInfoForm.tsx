"use client"

import { useEffect, useState } from "react"
import { Movie } from "@/types/movie"
import { updateMovie } from "@/lib/movies"

import PosterUpload from "./PosterUpload";
import BackdropUpload from "./BackdropUpload";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MovieInfoForm({
  movie,
  onUpdate
}: {
  movie: Movie
  onUpdate: (movie: Movie) => void
}) {

  const [title, setTitle] = useState(movie.title)
  const predefinedGenres = ["Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller"];
  const [genreSelect, setGenreSelect] = useState(() => {
    if (!movie.genre) return "";
    return predefinedGenres.includes(movie.genre) ? movie.genre : "Other";
  });
  const [customGenre, setCustomGenre] = useState(() => {
    if (!movie.genre) return "";
    return predefinedGenres.includes(movie.genre) ? "" : movie.genre;
  });
  const [runtime, setRuntime] = useState<number | "">(movie.runtime || "")
  const [synopsis, setSynopsis] = useState(movie.synopsis || "")

  const [posterUrl, setPosterUrl] = useState(movie.posterUrl || "");
  const [backdropUrl, setBackdropUrl] = useState(movie.backdropUrl || "");

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPosterUrl(movie.posterUrl || "");
  }, [movie.posterUrl]);

  useEffect(() => {
    setBackdropUrl(movie.backdropUrl || "");
  }, [movie.backdropUrl]);

  const handleSave = async () => {
    try {

      setLoading(true)

      const finalGenre = genreSelect === "Other" ? customGenre : genreSelect;

      const updated = await updateMovie(movie.id, {
        title,
        genre: finalGenre,
        runtime: runtime || undefined,
        synopsis,
        posterUrl,
        backdropUrl
      })

      onUpdate(updated)

    } catch (error) {
      console.error(error)
      alert("Failed to update movie")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">

      {/* Title */}
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full border rounded-md p-2 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Genre */}
      <div>
        <label className="text-sm font-medium">Genre</label>
        <select
          className="w-full flex h-10 border rounded-md border-input bg-background p-2 mt-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={genreSelect}
          onChange={(e) => setGenreSelect(e.target.value)}
        >
          <option value="" disabled>Select a genre...</option>
          {predefinedGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
          <option value="Other">Other (Custom)</option>
        </select>

        {genreSelect === "Other" && (
          <input
            className="w-full flex h-10 border rounded-md border-input bg-background px-3 py-2 mt-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type your custom genre..."
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
          />
        )}
      </div>

      {/* Runtime */}
      <div>
        <label className="text-sm font-medium">Runtime (min)</label>
        <input
          type="number"
          className="w-full border rounded-md p-2 mt-1"
          value={runtime}
          onChange={(e) => setRuntime(Number(e.target.value))}
        />
      </div>

      {/* Synopsis */}
      <div>
        <label className="text-sm font-medium">Synopsis</label>
        <textarea
          className="w-full border rounded-md p-2 mt-1"
          rows={4}
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </div>

      {/* Poster Upload */}
      <PosterUpload currentUrl={posterUrl} onUpload={setPosterUrl} />

      {/* Backdrop Upload */}
      <BackdropUpload currentUrl={backdropUrl} onUpload={setBackdropUrl} />

      <div className="pt-8 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`
            w-full py-4 rounded-xl font-bold transition-all duration-300
            flex items-center justify-center gap-2
            ${loading
              ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/5"
              : "bg-[#E5484D] text-white hover:bg-[#B7393D] hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-red-500/20"
            }
          `}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

    </div>
  );
}
