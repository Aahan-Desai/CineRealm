export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p className="text-muted-foreground">Viewing profile of: @{params.username}</p>
    </div>
  );
}
