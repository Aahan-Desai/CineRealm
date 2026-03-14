import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const createScene = async (req: AuthRequest, res: Response) => {
  try {
    const { title, location, scriptText, actNumber, sceneOrder, movieId } = req.body
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

    const scene = await prisma.scene.create({
      data: {
        title,
        location,
        scriptText,
        actNumber,
        sceneOrder,
        movieId
      }
    })

    res.status(201).json(scene)

  } catch (error) {
    res.status(500).json({ message: "Failed to create scene" })
  }
};

export const updateScene = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const { title, location, scriptText, actNumber, sceneOrder } = req.body

    const scene = await prisma.scene.findUnique({
      where: { id },
      include: { movie: true }
    })

    if (!scene) {
      return res.status(404).json({ message: "Scene not found" })
    }

    if (scene.movie.creatorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedScene = await prisma.scene.update({
      where: { id },
      data: {
        title,
        location,
        scriptText,
        actNumber,
        sceneOrder
      }
    })

    res.json(updatedScene)

  } catch (error) {
    res.status(500).json({ message: "Failed to update scene" })
  }
}

export const deleteScene = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const scene = await prisma.scene.findUnique({
      where: { id },
      include: { movie: true }
    })

    if (!scene) {
      return res.status(404).json({ message: "Scene not found" })
    }

    if (scene.movie.creatorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await prisma.scene.delete({
      where: { id }
    })

    res.json({ message: "Scene deleted" })

  } catch (error) {
    res.status(500).json({ message: "Failed to delete scene" })
  }
}