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
    <div className="bg-(--bg-card) p-4 rounded-xl border border-border">
      <h3 className="mb-4 font-semibold">Suggestions</h3>

      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <img
              src={user.avatarUrl || "/avatar.png"}
              className="w-8 h-8 rounded-full"
            />
            <span>{user.username}</span>
          </div>

          <button
            onClick={() => followUser(user.id)}
            className="text-sm text-red-500"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}