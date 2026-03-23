"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { followUser, unfollowUser } from "@/lib/follow";
import { useState } from "react";

interface Props {
  user: {
    id: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
}

export default function ProfileHeader({ user }: Props) {
  const { user: currentUser } = useAuthStore();

  const isOwner = currentUser?.username === user.username;

  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full group">
      {/* COVER */}
      <div className="relative h-[320px] md:h-[400px] w-full rounded-[40px] overflow-hidden shadow-2xl">
        {user.coverUrl ? (
          <img src={user.coverUrl} className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#12141c] via-card to-background" />
        )}

        {/* GRADIENT OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />

        {/* EDIT BUTTON */}
        {isOwner && (
          <Link
            href="/profile/edit"
            className="absolute top-6 right-6 glass px-5 py-2 rounded-full text-sm font-bold tracking-tight hover:bg-white/10 transition-all active:scale-95"
          >
            Edit Profile
          </Link>
        )}
      </div>

      {/* PROFILE INFO */}
      <div className="relative px-8 md:px-12 -mt-24 md:-mt-32 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
        {/* AVATAR */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-background overflow-hidden bg-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl font-black text-primary/40">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
        </div>

        {/* TEXT & CTAs */}
        <div className="flex-1 text-center md:text-left pb-1 md:pb-5 space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {user.username}
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-bold">
              Cinematic Director
            </p>
          </div>

          <p className="text-foreground/80 max-w-xl text-base md:text-lg leading-relaxed font-medium">
            {user.bio || "Crafting cinematic stories on CineRealm."}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
            <div className="flex gap-6">
              <Link href={`/profile/${user.username}/followers`} className="group/stat">
                <span className="text-foreground font-bold text-lg">{user.followersCount || 0}</span>
                <span className="text-muted-foreground text-sm ml-2 group-hover/stat:text-primary transition-colors">Followers</span>
              </Link>
              <Link href={`/profile/${user.username}/following`} className="group/stat">
                <span className="text-foreground font-bold text-lg">{user.followingCount || 0}</span>
                <span className="text-muted-foreground text-sm ml-2 group-hover/stat:text-primary transition-colors">Following</span>
              </Link>
            </div>

            {!isOwner && currentUser && (
              <button
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  if (isFollowing) {
                    await unfollowUser(user.id!);
                    setIsFollowing(false);
                  } else {
                    await followUser(user.id!);
                    setIsFollowing(true);
                  }
                  setLoading(false);
                }}
                className={`px-8 py-2.5 rounded-full font-bold transition-all active:scale-95 flex items-center gap-2 ${
                  isFollowing 
                  ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                  : "bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20"
                }`}
              >
                {loading ? "..." : isFollowing ? "Following" : "Follow Director"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
