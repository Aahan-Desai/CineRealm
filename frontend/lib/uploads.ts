import { apiFetch } from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();

  // 🔥 Normalize here
  return data.url;
};