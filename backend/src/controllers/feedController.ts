import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    })

    const followingIds = following.map((f) => f.followingId)

    if (followingIds.length === 0) {
      return res.json([])
    }

    const movies = await prisma.movie.findMany({
      where: {
        creatorId: {
          in: followingIds,
        },
        isPublished: true,
      },
      include: {
        creator: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        likes: true, 
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const parsedMovies = movies.map(movie => {
      const { likes, ...rest } = movie;
      return {
        ...rest,
        likeCount: likes.length,
        isLiked: likes.some(like => like.userId === userId),
      }
    })

    res.json(parsedMovies)

  } catch (error) {
    console.error("FEED ERROR:", error)
    res.status(500).json({ message: "Failed to fetch feed" })
  }
}