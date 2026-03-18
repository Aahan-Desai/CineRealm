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
    <div className="relative w-full">

      {/* COVER */}
      <div className="relative h-[280px] w-full rounded-xl overflow-hidden">
        {user.coverUrl ? (
          <img
            src={user.coverUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-800 to-black" />
        )}

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

        {/* EDIT BUTTON */}
        {isOwner && (
          <Link
            href="/profile/edit"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black px-4 py-1 rounded-lg text-sm transition"
          >
            Edit Profile
          </Link>
        )}
      </div>

      {/* PROFILE INFO */}
      <div className="relative px-6 -mt-16 flex items-end gap-5">

        {/* AVATAR */}
        <div className="w-28 h-28 rounded-full border-4 border-black overflow-hidden bg-gray-700 shadow-lg">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-3xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="pb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {user.username}
          </h1>

          <p className="text-gray-300 mt-1 max-w-xl text-sm leading-relaxed">
            {user.bio || "No bio yet."}
          </p>
        </div>
      </div>
    </div>
  )
}