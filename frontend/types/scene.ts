export interface Scene {
  id: string
  title: string
  location?: string
  scriptText?: string
  mood?: string
  characters?: { character: import('./character').Character }[]
  actNumber: number
  sceneOrder?: number
  movieId: string
  createdAt: string
}
