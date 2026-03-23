"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SimpleCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !synopsis) return;

    setLoading(true);

    try {
      const movie = await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify({
          title,
          synopsis,
          creationType: "simple"
        })
      });

      router.push(`/movies/${movie.slug}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="max-w-3xl w-full space-y-10 bg-white/[0.03] border border-white/5 rounded-[40px] p-8 md:p-16 shadow-2xl relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Quick Log</h1>
            <p className="text-muted-foreground text-lg font-medium">Capture your cinematic vision instantly.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">The Title</label>
              <input
                autoFocus
                placeholder="Name your cinematic masterpiece..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl md:text-4xl font-bold p-0 bg-transparent border-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none text-white tracking-tight"
              />
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">The Story</label>
              <textarea
                placeholder="Briefly describe the world and characters..."
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full text-lg md:text-xl font-medium p-0 bg-transparent border-none placeholder:text-muted-foreground/40 focus:ring-0 focus:outline-none text-foreground leading-relaxed h-48 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <button
              onClick={() => router.back()}
              className="text-sm font-bold text-muted-foreground hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleCreate}
              disabled={loading || !title || !synopsis}
              className="px-10 py-4 bg-primary text-white rounded-full font-bold text-base hover:opacity-90 shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
            >
              {loading ? "Publishing..." : "Publish Idea"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}