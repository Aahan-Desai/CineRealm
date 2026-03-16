export default function MovieBuilderPage({ params }: { params: { movieId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Movie Builder</h1>
      <p className="text-muted-foreground">Editing movie: {params.movieId}</p>
    </div>
  );
}
