"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/uploads";
import { ImagePlus, Loader2, Camera } from "lucide-react";

export default function AvatarUpload({ 
  currentUrl, 
  onUpload 
}: { 
  currentUrl?: string; 
  onUpload: (url: string) => void 
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    try {
      setLoading(true);
      const url = await uploadImage(file);
      onUpload(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`
          relative w-20 h-20 rounded-full overflow-hidden cursor-pointer
          border-2 border-dashed transition-all duration-300 group shadow-md shrink-0
          ${loading ? "opacity-50 cursor-wait" : "hover:border-[#E5484D]/50 border-white/10 bg-white/5"}
        `}
      >
        {currentUrl ? (
          <>
            <img 
              src={currentUrl} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Camera className="text-white" size={24} />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/30 group-hover:text-[#E5484D] transition-colors">
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <ImagePlus size={24} />
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />
      </div>
      <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em]">Avatar (1:1)</span>
    </div>
  );
}
