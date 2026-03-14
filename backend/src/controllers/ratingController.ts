import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const rateMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, rating } = req.body
    const userId = req.userId

    const newRating = await prisma.rating.create({
      data: {
        rating,
        movieId,
        userId: userId!,
      }
    })

    res.status(201).json(newRating)

  } catch (error) {
    res.status(500).json({ message: "Failed to rate movie" })
  }
}