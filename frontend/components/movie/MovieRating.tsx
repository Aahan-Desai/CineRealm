export default function MovieRating({ movieId }: any) {
  const handleRate = async (value: number) => {
    await fetch("/ratings", {
      method: "POST",
      body: JSON.stringify({ movieId, rating: value }),
    });
  };

  return (
    <div className="mt-10">
      <h2 className="mb-2">Rate this movie</h2>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => handleRate(n)}>
            ⭐
          </button>
        ))}
      </div>
    </div>
  );
}