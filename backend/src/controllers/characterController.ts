import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const createCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { name, actorName, avatarUrl, movieId } = req.body
    const userId = req.userId

    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const character = await prisma.character.create({
      data: {
        name,
        actorName,
        avatarUrl,
        movieId
      }
    })

    res.status(201).json(character)

  } catch (error) {
    res.status(500).json({ message: "Failed to create character" })
  }
}