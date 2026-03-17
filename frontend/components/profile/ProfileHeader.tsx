import { User } from "@/types/user";

export default function ProfileHeader({ user }: any) {
  return (
    <div className="relative">

      {/* 🎬 COVER */}
      {user.coverUrl ? (
        <img
          src={user.coverUrl}
          className="w-full h-48 object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-48 bg-gray-800 rounded-xl" />
      )}

      {/* 👤 AVATAR */}
      <div className="absolute left-6 -bottom-10">
        <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden bg-gray-700 flex items-center justify-center text-2xl">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            user.username[0].toUpperCase()
          )}
        </div>
      </div>

      {/* TEXT */}
      <div className="mt-12 px-6">
        <h1 className="text-2xl font-bold">
          @{user.username}
        </h1>

        {user.bio && (
          <p className="text-muted-foreground mt-1">
            {user.bio}
          </p>
        )}
      </div>

    </div>
  );
}