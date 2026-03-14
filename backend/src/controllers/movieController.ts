import { Request, Response } from "express"
import prisma from "../config/prisma.js"
import { Genre } from "@prisma/client"
import { AuthRequest } from "../middleware/authMiddleware.js"

const validGenres = Object.values(Genre)

export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { title, genre, synopsis, runtime } = req.body

    if (!title || !genre || !synopsis) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const normalizedGenre = (genre as string).toUpperCase() as Genre

    if (!validGenres.includes(normalizedGenre)) {
      return res.status(400).json({
        message: `Invalid genre. Must be one of: ${validGenres.join(", ")}`
      })
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-")

    const movie = await prisma.movie.create({
      data: {
        title,
        genre: normalizedGenre,
        synopsis,
        runtime: runtime ?? 120,
        slug,
        creatorId: req.userId!
      }
    })

    res.status(201).json(movie)

  } catch (error: any) {
    console.error("Create movie error:", error)
    res.status(500).json({
      message: "Error creating movie",

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
          include: {
            characters: {
              include: {
                character: true
              }
            }
          },
          orderBy: {
            sceneOrder: "asc"
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

export const getFullMovie = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string

    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            username: true
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
        ratings: true
      }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (!movie.isPublished) {
      return res.status(403).json({ message: "Movie not published yet" })
    }

    const acts = {
      act1: movie.scenes.filter(s => s.actNumber === 1),
      act2: movie.scenes.filter(s => s.actNumber === 2),
      act3: movie.scenes.filter(s => s.actNumber === 3)
    }

    const averageRating =
      movie.ratings.length > 0
        ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
        movie.ratings.length
        : null

    res.json({
      movie: {
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        runtime: movie.runtime,
        synopsis: movie.synopsis,
        posterUrl: movie.posterUrl,
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
      }))
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie screenplay" })
  }
}