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
}

export interface MyMoviesResponse {
  drafts: Movie[]
  private: Movie[]
  published: Movie[]
}