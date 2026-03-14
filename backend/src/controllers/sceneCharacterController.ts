import { Request, Response } from "express"
import prisma from "../config/prisma.js"

export const addCharacterToScene = async (req: Request, res: Response) => {
  try {
    const { sceneId, characterId } = req.body

    const link = await prisma.sceneCharacter.create({
      data: {
        sceneId,
        characterId
      }
    })

    res.status(201).json(link)

  } catch (error) {
    res.status(500).json({ message: "Failed to link character to scene" })
  }
}                                                                                                                                           