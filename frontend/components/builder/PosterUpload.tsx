"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/uploads";
import { ImagePlus, Loader2, Camera } from "lucide-react";

export default function PosterUpload({ 
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
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        Poster Image
      </label>

      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`
          relative w-48 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer
          border-2 border-dashed transition-all duration-300 group
          ${loading ? "opacity-50 cursor-wait" : "hover:border-[#E5484D]/50 border-white/10 bg-white/5"}
        `}
      >
        {currentUrl ? (
          <>
            <img 
              src={currentUrl} 
              alt="Poster Preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Camera className="text-white" size={32} />
              <span className="text-xs font-bold text-white uppercase">Change Poster</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500 group-hover:text-[#E5484D] transition-colors">
            {loading ? (
              <Loader2 className="animate-spin" size={40} />
            ) : (
              <>
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-[#E5484D]/10">
                  <ImagePlus size={32} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-tighter">Add Poster</p>
                  <p className="text-[10px] opacity-60 mt-1">2:3 Aspect Ratio</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Hidden Input */}
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
    </div>
  );
}