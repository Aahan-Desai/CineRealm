import { Request, Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"
import jwt from "jsonwebtoken"

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        followers: true,
        following: true,
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

    const followersCount = user.followers.length
    const followingCount = user.following.length

    let currentUserId = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        currentUserId = decoded.userId
      } catch (err) {}
    }

    let isFollowing = false

    if (currentUserId) {
      isFollowing = user.followers.some(
        (f) => f.followerId === currentUserId
      )
    }

    const moviesCount = user.movies.length

    const ratings = user.movies.flatMap(movie => movie.ratings)

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null

    res.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      moviesCount,
      averageRating,
      movies: user.movies,
      followersCount,
      followingCount,
      isFollowing,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
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

export const getFollowing = async (req: Request, res: Response) => {
  console.log("FOLLOWING ROUTE HIT", req.params.username)
  try {
    const username = req.params.username as string

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const followingList = user.following.map((f) => f.following)

    res.json(followingList)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch following list" })
  }
}

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const followersList = user.followers.map((f) => f.follower)

    res.json(followersList)

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followers" })
  }
}