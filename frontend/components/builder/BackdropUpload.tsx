"use client";

import { uploadImage } from "@/lib/uploads";

export default function BackdropUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const handleFileChange = async (file: File) => {
    try {
      const url = await uploadImage(file);
      onUpload(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Backdrop Image</label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}