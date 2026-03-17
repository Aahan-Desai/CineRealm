import { getUserProfile } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMovies from "@/components/profile/ProfileMovies";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (username === "me") {
    redirect("/profile");
  }

  try {
    const data = await getUserProfile(username);

    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <ProfileHeader user={data.user} />
        <ProfileMovies movies={data.movies} />
      </div>
    );

  } catch {
    notFound();
  }
}