"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // 🚫 Don't do anything until hydrated
    if (!hydrated) return;

    // ❌ No user → go login
    if (!user) {
      router.push("/login");
      return;
    }

    // ✅ User exists → go profile
    router.push(`/profile/${user.username}`);
  }, [hydrated, user, router]);

  // 🛑 Prevent UI + errors before hydration
  if (!hydrated) return null;

  // 🛑 Prevent crash when user is null
  if (!user) return null;

  return null;
}