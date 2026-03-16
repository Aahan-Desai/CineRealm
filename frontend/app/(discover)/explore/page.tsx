import { getExploreMovies } from "@/lib/movies";
import ExploreGrid from "@/components/discover/ExploreGrid";
import ExploreHeader from "@/components/discover/ExploreHeader";

export default async function ExplorePage() {
  const movies = await getExploreMovies();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <ExploreHeader />
      <ExploreGrid movies={movies} />
    </div>
  );
}