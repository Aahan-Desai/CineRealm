import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const createCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { name, actorName, avatarUrl, role, traits, shortBio, movieId } = req.body
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

    const character = await prisma.character.create({
      data: {
        name,
        actorName,
        avatarUrl,
        role,
        traits,
        shortBio,
        movieId
      }
    })

    res.status(201).json(character)

  } catch (error) {
    res.status(500).json({ message: "Failed to create character" })
  }
}

export const updateCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId
    const { name, actorName, avatarUrl, role, traits, shortBio } = req.body

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            creatorId: true
          }
        }
      }
    })

    if (!character) {
      return res.status(404).json({ message: "Character not found" })
    }

    if (character.movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        name,
        actorName,
        avatarUrl,
        role,
        traits,
        shortBio
      }
    })

    res.json(updatedCharacter)
  } catch (error) {
    res.status(500).json({ message: "Failed to update character" })
  }
}

export const deleteCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            creatorId: true
          }
        }
      }
    })

    if (!character) {
      return res.status(404).json({ message: "Character not found" })
    }

    if (character.movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await prisma.$transaction([
      prisma.sceneCharacter.deleteMany({
        where: {
          characterId: id
        }
      }),
      prisma.sceneBlock.updateMany({
        where: {
          characterId: id
        },
        data: {
          characterId: null
        }
      }),
      prisma.character.delete({
        where: { id }
      })
    ])

    res.json({ success: true, id })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete character" })
  }
}
