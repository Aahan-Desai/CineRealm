"use client";

import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 animate-in fade-in duration-1000">
      <div className="max-w-5xl w-full space-y-16 py-12">

        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Direct Your Story
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Choose your production path. Start fast or build a complete cinematic world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* QUICK */}
          <div
            onClick={() => router.push("/create/simple")}
            className="group cursor-pointer p-10 rounded-[32px] bg-white/0.03 border border-white/5 hover:border-primary/30 hover:bg-white/0.05 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">⚡</span>
              </div>
              
              <h2 className="text-3xl font-black mb-3 tracking-tight text-white">
                Quick Idea
              </h2>
              <p className="text-muted-foreground text-base mb-8 font-medium leading-relaxed">
                Log a quick movie concept. Share your idea with the world instantly.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span>Title & Synopsis</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span>Instant Publish</span>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 text-sm font-black text-white bg-white/5 px-5 py-2.5 rounded-full border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all active:scale-95">
                Start Quickly
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </div>

          {/* FULL */}
          <div
            onClick={() => router.push("/studio")}
            className="group cursor-pointer p-10 rounded-[32px] bg-white/3 border border-white/5 hover:border-primary/30 hover:bg-white/0.05 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">🎬</span>
              </div>

              <h2 className="text-3xl font-black mb-3 tracking-tight text-white">
                Cinematic Studio
              </h2>
              <p className="text-muted-foreground text-base mb-8 font-medium leading-relaxed">
                Enter the full production studio. Design scenes, define characters, and direct your world.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span>Full World Building</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-muted-foreground/60 group-hover:text-primary/70 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span>Structured Scripts</span>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 text-sm font-black text-white bg-white/5 px-5 py-2.5 rounded-full border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all active:scale-95">
                Enter Studio
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}