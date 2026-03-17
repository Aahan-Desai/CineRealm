import { getUserProfile } from "@/lib/users";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMovies from "@/components/profile/ProfileMovies";

export default async function ProfilePage({ params }: any) {
  const data = await getUserProfile(params.username);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      <ProfileHeader user={data.user} />

      <ProfileMovies movies={data.movies} />

    </div>
  );
}
