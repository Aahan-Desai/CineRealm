"use client";

import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <button
          onClick={() => router.push("/create/simple")}
          className="p-6 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
        >
          <h2 className="text-xl font-medium">Quick Create</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Share a quick movie idea instantly
          </p>
        </button>

        <button
          onClick={() => router.push("/studio")}
          className="p-6 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
        >
          <h2 className="text-xl font-medium">Studio Mode</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Full cinematic storytelling experience
          </p>
        </button>

      </div>
    </div>
  );
}