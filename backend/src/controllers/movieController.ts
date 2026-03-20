import { Request, Response } from "express"
import prisma from "../config/prisma.js"
import { Genre, Visibility } from "@prisma/client"
import { AuthRequest } from "../middleware/authMiddleware.js"
import { generateUniqueSlug } from "../utils/generateSlug.js"

const validGenres = Object.values(Genre)

export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { title, genre, synopsis, runtime, visibility, posterUrl, backdropUrl } = req.body

    if (!title) {
      return res.status(400).json({ message: "Missing title" })
    }

    let normalizedGenre: Genre | undefined = undefined
    if (genre) {
      normalizedGenre = (genre as string).toUpperCase() as Genre
      if (!validGenres.includes(normalizedGenre)) {
        return res.status(400).json({
          message: `Invalid genre. Must be one of: ${validGenres.join(", ")}`
        })
      }
    }

    const slug = await generateUniqueSlug(title)

    const normalizedVisibility =
      (visibility as string)?.toUpperCase() as Visibility || Visibility.PRIVATE

    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        genre: normalizedGenre,
        synopsis,
        runtime: runtime ?? 120,
        slug,
        creatorId: userId,
        visibility: normalizedVisibility,
        posterUrl,
        backdropUrl
      }
    })

    res.status(201).json(movie)

  } catch (error) {
    console.error("Create movie error:", error)
    res.status(500).json({
      message: "Error creating movie"
    })
  }
}

export const getMovies = async (req: Request, res: Response) => {
  const movies = await prisma.movie.findMany({
    include: {
      creator: {
        select: {
          username: true
        }
      }
    }
  })

  res.json(movies)
}

export const getMovieBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug as string

  const movie = await prisma.movie.findUnique({
    where: { slug },
    include: {
      scenes: true,
      characters: true
    }
  })

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" })
  }

  res.json(movie)
}

export const publishMovie = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const movie = await prisma.movie.findUnique({
      where: { id }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { isPublished: true }
    })

    res.json(updatedMovie)

  } catch (error) {
    res.status(500).json({ message: "Failed to publish movie" })
  }
}

export const getMovieStudio = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        characters: true,
        scenes: {
          orderBy: [
            { actNumber: "asc" },
            { sceneOrder: "asc" }
          ],
          include: {
            characters: {
              include: {
                character: true
              }
            }
          }
        }
      }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(movie)

  } catch (error) {
    res.status(500).json({ message: "Failed to load movie studio data" })
  }
}

export const getFullMovie = async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string
    const userId = req.userId

    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        characters: true,
        scenes: {
          orderBy: [
            { actNumber: "asc" },
            { sceneOrder: "asc" }
          ],
          include: {
            characters: {
              include: {
                character: true
              }
            }
          }
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        likes: true
      }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const isOwner = userId === movie.creatorId
    const isPublic = movie.isPublished && movie.visibility === Visibility.PUBLIC

    if (!isPublic && !isOwner) {
      return res.status(403).json({ message: "Movie not available" })
    }

    const averageRating =
      movie.ratings.length > 0
        ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
          movie.ratings.length
        : null

    const isLiked = userId 
      ? movie.likes.some(like => like.userId === userId)
      : false

    res.json({
      movie: {
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        runtime: movie.runtime,
        synopsis: movie.synopsis,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        creator: movie.creator,
        averageRating
      },
      characters: movie.characters,
      scenes: movie.scenes.map(scene => ({
        id: scene.id,
        title: scene.title,
        location: scene.location,
        actNumber: scene.actNumber,
        sceneOrder: scene.sceneOrder,
        scriptText: scene.scriptText,
        characters: scene.characters.map(sc => sc.character)
      })),
      ratings: movie.ratings,
      likeCount: movie.likes.length,
      isLiked
    })

  } catch (error) {
    console.error("Fetch full movie error:", error)
    res.status(500).json({ message: "Failed to fetch movie screenplay" })
  }
}

export const exploreMovies = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12

    const skip = (page - 1) * limit

    const movies = await prisma.movie.findMany({
      where: {
        isPublished: true,
        visibility: Visibility.PUBLIC
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true
          }
        },
        ratings: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    })

    const formattedMovies = movies.map(movie => {
      const avgRating =
        movie.ratings.length > 0
          ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
            movie.ratings.length
          : null

      return {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        genre: movie.genre,
        runtime: movie.runtime,
        posterUrl: movie.posterUrl,
        synopsis: movie.synopsis,
        creator: movie.creator,
        averageRating: avgRating,
        ratingsCount: movie.ratings.length
      }
    })

    res.json({
      page,
      results: formattedMovies.length,
      movies: formattedMovies
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" })
  }
}

export const getMyMovies = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const movies = await prisma.movie.findMany({
      where: {
        creatorId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const drafts = movies.filter(movie => !movie.isPublished)
    const privateMovies = movies.filter(
      movie => movie.isPublished && movie.visibility === Visibility.PRIVATE
    )
    const published = movies.filter(
      movie => movie.isPublished && movie.visibility === Visibility.PUBLIC
    )

    res.json({
      drafts,
      private: privateMovies,
      published
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your movies" })
  }
}

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const movies = await prisma.movie.findMany({
      where: {
        isPublished: true,
        visibility: Visibility.PUBLIC,
        title: {
          contains: query,
          mode: "insensitive"
        }
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      },
      take: 10
    })

    res.json(movies)

  } catch (error) {
    res.status(500).json({ message: "Failed to search movies" })
  }
}

export const updateMovie = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const { title, synopsis, runtime, visibility, posterUrl } = req.body

    const movie = await prisma.movie.findUnique({
      where: { id }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const normalizedVisibility = visibility 
      ? (visibility as string).toUpperCase() as Visibility 
      : undefined

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        synopsis,
        runtime,
        visibility: normalizedVisibility,
        posterUrl
      }
    })

    res.json(updatedMovie)

  } catch (error) {
    res.status(500).json({ message: "Failed to update movie" })
  }
}