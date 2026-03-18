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

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // ✅ LOGIN
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
  },

  // ✅ LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  },

  // ✅ RESTORE STATE
  hydrate: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
      });
    }
  },

  
}));