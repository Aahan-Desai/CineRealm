export default function MovieSynopsis({ synopsis }: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
      <p className="text-muted-foreground leading-relaxed max-w-3xl">
        {synopsis}
      </p>
    </div>
  );
}