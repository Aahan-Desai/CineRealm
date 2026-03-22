"use client";

import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full space-y-10">

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Create a Movie
          </h1>
          <p className="text-zinc-400">
            Start fast or build something cinematic
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* QUICK */}
          <div
            onClick={() => router.push("/create/simple")}
            className="group cursor-pointer p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-white/20 hover:bg-zinc-900 transition-all duration-300"
          >
            <h2 className="text-2xl font-medium mb-2">
              Quick Create
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Share a movie idea instantly
            </p>

            <div className="text-xs text-zinc-500 space-y-1">
              <p>• title</p>
              <p>• short synopsis</p>
              <p>• instant publish</p>
            </div>

            <div className="mt-6 text-sm opacity-0 group-hover:opacity-100 transition">
              → Start quickly
            </div>
          </div>

          {/* FULL */}
          <div
            onClick={() => router.push("/studio")}
            className="group cursor-pointer p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-white/20 hover:bg-zinc-900 transition-all duration-300"
          >
            <h2 className="text-2xl font-medium mb-2">
              Full Creation
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Build a complete cinematic story
            </p>

            <div className="text-xs text-zinc-500 space-y-1">
              <p>• scenes & acts</p>
              <p>• characters & casting</p>
              <p>• structured storytelling</p>
            </div>

            <div className="mt-6 text-sm opacity-0 group-hover:opacity-100 transition">
              → Enter studio
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}