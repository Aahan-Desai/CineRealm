import { apiFetch } from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const data = await apiFetch("/uploads", {
    method: "POST",
    body: formData,
  });

  // 🔥 Normalize here
  return data.url;
};