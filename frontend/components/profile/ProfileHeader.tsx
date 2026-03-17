"use client"

import Link from "next/link"
import { useAuthStore } from "@/store/authStore"

interface Props {
  user: {
    username: string
    bio?: string
    avatarUrl?: string
    coverUrl?: string
  }
}

export default function ProfileHeader({ user }: Props) {
  const { user: currentUser } = useAuthStore()

  const isOwner = currentUser?.username === user.username

  return (
    <div className="relative">
      {/* COVER */}
      <div className="h-60 w-full bg-gray-800 rounded-xl overflow-hidden">
        {user.coverUrl && (
          <img
            src={user.coverUrl}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* EDIT BUTTON */}
      {isOwner && (
        <Link
          href="/profile/edit"
          className="absolute top-4 right-4 bg-white text-black px-4 py-1 rounded-lg"
        >
          Edit Profile
        </Link>
      )}

      {/* AVATAR + INFO */}
      <div className="flex items-center gap-4 mt-[-40px] px-4">
        <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-4 border-black">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xl">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-400">{user.bio || "No bio yet."}</p>
        </div>
      </div>
    </div>
  )
}