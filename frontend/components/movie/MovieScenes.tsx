export default function MovieScenes({ scenes }: { scenes: any[] }) {
  if (!scenes?.length) return null;

  return (
    <div className="space-y-12">
      {scenes.map((scene, idx) => (
        <div 
          key={scene.id} 
          className="group relative bg-white/0.01 border border-white/5 rounded-[32px] p-8 md:p-12 hover:bg-white/0.02 transition-colors"
        >
          {/* Scene Number Indicator */}
          <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary/20 group-hover:text-primary transition-colors">
            Scene {idx + 1}
          </div>

          <div className="space-y-6 max-w-2xl">
            <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
              {scene.title}
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Action & Dialogue</span>
              </div>
              <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/70 bg-black/20 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">
                {scene.scriptText || "No script text provided for this scene."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}