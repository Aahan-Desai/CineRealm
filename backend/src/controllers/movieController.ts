import { Response } from "express"
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