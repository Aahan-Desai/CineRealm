import { Request, Response } from "express"
import prisma from "../config/prisma.js"

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        movies: {
          where: {
            isPublished: true,
            visibility: "PUBLIC"
          },
          include: {
            ratings: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const moviesCount = user.movies.length

    const ratings = user.movies.flatMap(movie => movie.ratings)

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null

    res.json({
      username: user.username,
      bio: user.bio,
      moviesCount,
      averageRating,
      movies: user.movies
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to load user profile" })
  }
}