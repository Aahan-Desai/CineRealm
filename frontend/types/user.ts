export interface User {
  id?: string;
  username: string;
  email?: string;

  bio?: string;

  avatarUrl?: string;   // 👤 profile pic
  coverUrl?: string;    // 🎬 cover image

  createdAt?: string;
  updatedAt?: string;
};