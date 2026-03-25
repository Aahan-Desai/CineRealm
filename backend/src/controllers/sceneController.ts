import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"
import { BlockType, Prisma } from "@prisma/client"

const isMissingSceneBlockTable = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2021" &&
  String((error.meta as { table?: unknown } | undefined)?.table || "").includes("SceneBlock")

const isMissingChoiceTable = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2021" &&
  String((error.meta as { table?: unknown } | undefined)?.table || "").includes("Choice")

const buildSceneInclude = ({
  includeBlocks,
  includeChoices
}: {
  includeBlocks: boolean
  includeChoices: boolean
}) => ({
  ...(includeChoices
    ? {
        choices: {
          orderBy: {
            createdAt: "asc" as const
          }
        }
      }
    : {}),
  ...(includeBlocks
    ? {
        blocks: {
          include: {
            character: true
          },
          orderBy: {
            createdAt: "asc" as const
          }
        }
      }
    : {}),
  characters: {
    include: { character: true }
  }
})

const getSceneWithRelations = async (id: string) => {
  try {
    return await prisma.scene.findUnique({
      where: { id },
      include: buildSceneInclude({
        includeBlocks: true,
        includeChoices: true
      })
    })
  } catch (error) {
    const missingBlocks = isMissingSceneBlockTable(error)
    const missingChoices = isMissingChoiceTable(error)

    if (!missingBlocks && !missingChoices) {
      throw error
    }

    const fallbackScene = await prisma.scene.findUnique({
      where: { id },
      include: buildSceneInclude({
        includeBlocks: !missingBlocks,
        includeChoices: !missingChoices
      })
    })

    if (!fallbackScene) {
      return null
    }

    return {
      ...fallbackScene,
      blocks: "blocks" in fallbackScene ? fallbackScene.blocks : [],
      choices: "choices" in fallbackScene ? fallbackScene.choices : []
    }
  }
}


export const createScene = async (req: AuthRequest, res: Response) => {
  try {
    console.log("CREATE SCENE BODY:", req.body)

    const { title, location, movieId } = req.body
    const actNumber = parseInt(req.body.actNumber)
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

    const lastScene = await prisma.scene.findFirst({
      where: { movieId, actNumber },
      orderBy: { sceneOrder: "desc" }
    })

    const nextOrder = (lastScene?.sceneOrder ?? 0) + 1

    const scene = await prisma.scene.create({
      data: {
        title,
        location: location || null,
        scriptText: "",
        actNumber,
        sceneOrder: nextOrder,
        movieId
      }
    })

    res.status(201).json(scene)

  } catch (error) {
    console.error("CREATE SCENE ERROR:", error)
    res.status(500).json({ message: "Failed to create scene" })
  }
}

export const updateScene = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const { title, location, scriptText, mood, characterIds, blocks, choices } = req.body
    const actNumber = req.body.actNumber ? parseInt(req.body.actNumber) : undefined
    const sceneOrder = req.body.sceneOrder ? parseInt(req.body.sceneOrder) : undefined

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

    await prisma.scene.update({
      where: { id },
      data: {
        title,
        location,
        scriptText,
        actNumber,
        sceneOrder,
        mood
      }
    })

    if (Array.isArray(blocks)) {
      try {
        await prisma.sceneBlock.deleteMany({
          where: { sceneId: id }
        })

        const normalizedBlocks: Prisma.SceneBlockCreateManyInput[] = blocks
          .filter(
            (
              block: { content?: unknown }
            ): block is { content: string; type?: unknown; characterId?: unknown } =>
              typeof block?.content === "string"
          )
          .map(block => ({
            type:
              String(block.type).toUpperCase() === "DIALOGUE"
                ? BlockType.DIALOGUE
                : BlockType.ACTION,
            content: block.content.trim(),
            sceneId: id,
            characterId:
              typeof block.characterId === "string" && block.characterId
                ? block.characterId
                : null
          }))
          .filter(block => block.content.length > 0)

        if (normalizedBlocks.length > 0) {
          await prisma.sceneBlock.createMany({
            data: normalizedBlocks
          })
        }
      } catch (error) {
        if (!isMissingSceneBlockTable(error)) {
          throw error
        }

        console.warn("SceneBlock table is not available yet. Skipping block persistence.")
      }
    }

    if (Array.isArray(choices)) {
      try {
        await prisma.choice.deleteMany({
          where: { sceneId: id }
        })

        const normalizedChoices: Prisma.ChoiceCreateManyInput[] = choices
          .filter(
            (
              choice: { text?: unknown; outcomeText?: unknown }
            ): choice is { text: string; outcomeText: string } =>
              typeof choice?.text === "string" &&
              typeof choice?.outcomeText === "string"
          )
          .map(choice => ({
            text: choice.text.trim(),
            outcomeText: choice.outcomeText.trim(),
            sceneId: id
          }))
          .filter(choice => choice.text.length > 0 && choice.outcomeText.length > 0)

        if (normalizedChoices.length > 0) {
          await prisma.choice.createMany({
            data: normalizedChoices
          })
        }
      } catch (error) {
        if (!isMissingChoiceTable(error)) {
          throw error
        }

        console.warn("Choice table is not available yet. Skipping choice persistence.")
      }
    }

    if (Array.isArray(characterIds)) {
      await prisma.sceneCharacter.deleteMany({
        where: { sceneId: id }
      })

      if (characterIds.length > 0) {
        await prisma.sceneCharacter.createMany({
          data: characterIds.map((cid: string) => ({
            sceneId: id,
            characterId: cid
          }))
        })
      }
    }

    const updatedScene = await getSceneWithRelations(id)

    res.json(updatedScene)

  } catch (error) {
    console.error("UPDATE SCENE ERROR:", error)
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
