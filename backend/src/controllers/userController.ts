import { Request, Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

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

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    const { bio, avatarUrl, coverUrl } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(coverUrl !== undefined && { coverUrl }),
      },
    })

    res.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
}