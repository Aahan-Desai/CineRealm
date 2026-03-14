import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const createScene = async (req: AuthRequest, res: Response) => {
  try {
    const { title, location, scriptText, actNumber, sceneOrder, movieId } = req.body
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

    const scene = await prisma.scene.create({
      data: {
        title,
        location,
        scriptText,
        actNumber,
        sceneOrder,
        movieId
      }
    })

    res.status(201).json(scene)

  } catch (error) {
    res.status(500).json({ message: "Failed to create scene" })
  }
};

