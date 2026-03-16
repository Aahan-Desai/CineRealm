import { Character } from "./character"
import { Scene } from "./scene"

export interface Movie {
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
}

export interface MyMoviesResponse {
  drafts: Movie[]
  private: Movie[]
  published: Movie[]
}