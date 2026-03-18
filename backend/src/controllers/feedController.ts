import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!

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
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(movies)

  } catch (error) {
    console.error("FEED ERROR:", error)
    res.status(500).json({ message: "Failed to fetch feed" })
  }
}