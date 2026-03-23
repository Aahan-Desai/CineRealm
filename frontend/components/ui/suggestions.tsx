"use client";

import { useEffect, useState } from "react";
import { getSuggestions } from "@/lib/api";
import { followUser } from "@/lib/follow";

export default function Suggestions() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getSuggestions().then(setUsers);
  }, []);

  return (
    <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl">
      <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-6">
        Discover Creators
      </h3>

      <div className="space-y-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  className="w-9 h-9 rounded-full border border-white/10 group-hover:border-primary/50 transition-colors"
                  alt={user.username}
                />
                <div className="absolute inset-0 rounded-full shadow-inner shadow-white/10" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user.username}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Director</p>
              </div>
            </div>

            <button
              onClick={() => followUser(user.id)}
              className="text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary px-3 py-1.5 rounded-full transition-all active:scale-95"
            >
              Follow
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No suggestions available right now.</p>
        )}
      </div>
    </div>
  );
}