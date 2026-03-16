export default function MovieDetailsPage({ params }: { params: { slug: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Movie Details</h1>
      <p className="text-muted-foreground">Viewing: {params.slug}</p>
    </div>
  );
}
