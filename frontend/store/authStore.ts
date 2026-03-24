import { create } from "zustand";

type User = {
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  id?: string;
  username: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;

  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,

  // ✅ MERGE USER INFO
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  // ✅ LOGIN
  setAuth: (user, token, refreshToken) => {
    if (token) localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    set({ user, token, refreshToken: refreshToken || null });
  },

  // ✅ LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    set({ user: null, token: null, refreshToken: null });
  },

  // ✅ RESTORE STATE
  hydrate: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      set({
        token,
        refreshToken,
        user: JSON.parse(userString),
      });
    }
  },

  
}));