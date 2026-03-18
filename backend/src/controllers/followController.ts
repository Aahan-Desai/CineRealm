import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!

    const { userId } = req.params

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: "Invalid userId" })
    }

    if (followerId === userId) {
      return res.status(400).json({ message: "Cannot follow yourself" })
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId: userId,
      },
    })

    res.json({ message: "Followed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to follow user" })
  }
}

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!

    const { userId } = req.params

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: "Invalid userId" })
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
    })

    res.json({ message: "Unfollowed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to unfollow user" })
  }
}