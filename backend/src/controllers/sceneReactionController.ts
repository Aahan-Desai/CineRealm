import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"
import { PrismaClient } from "@prisma/client"

const ALLOWED_REACTION_TYPES = new Set(["like", "wow", "fire", "sad", "funny"])
const db = prisma as PrismaClient

export const reactToScene = async (req: AuthRequest, res: Response) => {
  try {
    const sceneId = req.params.id as string
    const userId = req.userId as string
    const type = typeof req.body.type === "string" ? req.body.type.trim().toLowerCase() : ""

    if (!ALLOWED_REACTION_TYPES.has(type)) {
      return res.status(400).json({ message: "Invalid reaction type" })
    }

    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      select: { id: true }
    })

    if (!scene) {
      return res.status(404).json({ message: "Scene not found" })
    }

    const existingReaction = await db.sceneReaction.findUnique({
      where: {
        sceneId_userId_type: {
          sceneId,
          userId,
          type
        }
      },
      select: { id: true }
    })

    let reacted = false

    if (existingReaction) {
      await db.sceneReaction.delete({
        where: {
          sceneId_userId_type: {
            sceneId,
            userId,
            type
          }
        }
      })
    } else {
      await db.sceneReaction.create({
        data: {
          sceneId,
          userId,
          type
        }
      })
      reacted = true
    }

    const reactions = await db.sceneReaction.groupBy({
      by: ["type"],
      where: { sceneId },
      _count: {
        type: true
      }
    })

    res.status(201).json({
      sceneId,
      reacted,
      counts: reactions.reduce<Record<string, number>>((acc: Record<string, number>, reaction) => {
        acc[reaction.type] = reaction._count.type
        return acc
      }, {})
    })
  } catch (error) {
    console.error("SCENE REACTION ERROR:", error)
    res.status(500).json({ message: "Failed to react to scene" })
  }
}

export const getSceneReactions = async (req: AuthRequest, res: Response) => {
  try {
    const sceneId = req.params.id as string
    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      select: { id: true }
    })

    if (!scene) {
      return res.status(404).json({ message: "Scene not found" })
    }

    const reactions = await db.sceneReaction.groupBy({
      by: ["type"],
      where: { sceneId },
      _count: {
        type: true
      }
    })

    const userReactions = req.userId
      ? await db.sceneReaction.findMany({
          where: {
            sceneId,
            userId: req.userId
          },
          select: {
            type: true
          }
        })
      : []

    res.json({
      sceneId,
      counts: reactions.reduce<Record<string, number>>((acc: Record<string, number>, reaction) => {
        acc[reaction.type] = reaction._count.type
        return acc
      }, {}),
      userReactions: userReactions.map((reaction: { type: string }) => reaction.type)
    })
  } catch (error) {
    console.error("GET SCENE REACTIONS ERROR:", error)
    res.status(500).json({ message: "Failed to load scene reactions" })
  }
}
