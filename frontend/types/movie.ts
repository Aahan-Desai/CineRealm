import { Character } from "./character"
import { Scene } from "./scene"
import { User } from "./user"

export interface Movie {
  year: any
  backdropUrl: string
  id: string
  title: string
  slug: string
  genre?: string
  runtime?: number
  synopsis?: string
  posterUrl?: string
  isPublished: boolean
  createdAt: string
  characters?: Character[]
  scenes?: Scene[]
  creator?: User;
  likeCount: number;
  isLiked: boolean;
}

export interface MyMoviesResponse {
  drafts: Movie[]
  private: Movie[]
  published: Movie[]
}

export type { Character, Scene }
