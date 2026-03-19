const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Read response as text FIRST
  const text = await res.text();

  // ❌ Handle errors safely
  if (!res.ok) {
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || "API request failed");
    } catch {
      throw new Error(text || "API request failed");
    }
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const getSuggestions = () => {
  return apiFetch("/users/suggestions");
};