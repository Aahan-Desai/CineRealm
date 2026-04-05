const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

export function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      "App configuration is incomplete. Set NEXT_PUBLIC_API_URL for the frontend deployment."
    );
  }

  return API_URL.replace(/\/+$/, "");
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const apiUrl = getApiUrl();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  if (!res.ok) {
    // Check if we should try refreshing the token
    if (res.status === 401 && token) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const { accessToken } = await refreshRes.json();
            localStorage.setItem("token", accessToken);
            
            // Retry the original request
            return apiFetch(endpoint, options);
          } else {
            console.error("Token refresh response NOT ok. Status:", refreshRes.status);
            // Refresh failed! clear session and redirect
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }
            throw new Error("Session expired. Please log in again.");
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      } else {
        // No refresh token available! clear session and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        throw new Error("Session expired. Please log in again.");
      }
    }

    console.error(`apiFetch FAILED: ${apiUrl}${endpoint} Status: ${res.status}`);
    let errorMessage = text || "API request failed";
    try {
      const errorData = JSON.parse(text);
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Not JSON, use original text or default
    }
    throw new Error(errorMessage);
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
