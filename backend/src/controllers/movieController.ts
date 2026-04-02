import { Request, Response } from "express"
import prisma from "../config/prisma.js"
import { Visibility, CreationType } from "@prisma/client"
import { AuthRequest } from "../middleware/authMiddleware.js"
import { generateUniqueSlug } from "../utils/generateSlug.js"
import { similarity } from "../services/plagiarismService.js"
import { randomUUID } from "node:crypto"

const isMissingSceneBlockTable = (error: unknown) =>
  error instanceof Error &&
  "code" in error &&
  (error as { code?: string }).code === "P2021" &&
  String((error as { meta?: { table?: unknown } }).meta?.table || "").includes("SceneBlock")

const isMissingChoiceTable = (error: unknown) =>
  error instanceof Error &&
  "code" in error &&
  (error as { code?: string }).code === "P2021" &&
  String((error as { meta?: { table?: unknown } }).meta?.table || "").includes("Choice")

const buildStudioSceneInclude = ({
  includeBlocks,
  includeChoices
}: {
  includeBlocks: boolean
  includeChoices: boolean
}) => ({
  orderBy: [
    { actNumber: "asc" as const },
    { sceneOrder: "asc" as const }
  ],
  include: {
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
      include: {
        character: true
      }
    }
  }
})

const legacyStudioSceneInclude = {
  orderBy: [
    { actNumber: "asc" as const },
    { sceneOrder: "asc" as const }
  ],
  include: {
    characters: {
      include: {
        character: true
      }
    }
  }
}

const mapSceneResponse = (scene: any) => ({
  id: scene.id,
  title: scene.title,
  location: scene.location,
  actNumber: scene.actNumber,
  sceneOrder: scene.sceneOrder,
  scriptText: scene.scriptText,
  mood: scene.mood,
  choices: (scene.choices || []).map((choice: any) => ({
    id: choice.id,
    text: choice.text,
    outcomeText: choice.outcomeText
  })),
  blocks: (scene.blocks || []).map((block: any) => ({
    id: block.id,
    type: block.type,
    content: block.content,
    characterId: block.characterId,
    character: block.character
  })),
  characters: scene.characters.map((sc: any) => sc.character)
})


export const createMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { title, genre, synopsis, runtime, visibility, posterUrl, backdropUrl, creationType } = req.body
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!title) {
      return res.status(400).json({ message: "Missing title" })
    }

    let normalizedGenre: string | undefined = undefined
    if (genre && typeof genre === "string") {
      normalizedGenre = genre.trim()
    }

    const slug = await generateUniqueSlug(title)

    // Plagiarism check
    if (synopsis) {
      const existingMovies = await prisma.movie.findMany({
        where: { isPublished: true },
        select: { id: true, synopsis: true }
      });

      for (const m of existingMovies) {
        if (!m.synopsis) continue;
        const score = similarity(synopsis, m.synopsis);

        if (score > 0.7) {
          return res.status(400).json({
            message: "This content is too similar to an existing movie."
          });
        }
      }
    }

    const normalizedVisibility =
      (visibility as string)?.toUpperCase() as Visibility || Visibility.PRIVATE

    const movie = await prisma.movie.create({
      data: {
        title,
        genre: normalizedGenre,
        synopsis,
        runtime: runtime ?? 120,
        slug,
        creatorId: userId,
        visibility: normalizedVisibility,
        posterUrl,
        backdropUrl,
        creationType: (creationType as string)?.toUpperCase() as CreationType || CreationType.FULL
      }
    })

    res.status(201).json(movie)

  } catch (error) {
    console.error("Create movie error:", error)
    res.status(500).json({
      message: "Error creating movie"
    })
  }
}

export const getMovies = async (req: Request, res: Response) => {
  const movies = await prisma.movie.findMany({
    include: {
      creator: {
        select: {
          username: true
        }
      }
    }
  })

  res.json(movies)
}

export const getMovieBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug as string

  const movie = await prisma.movie.findUnique({
    where: { slug },
    include: {
      scenes: true,
      characters: true
    }
  })

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" })
  }

  res.json(movie)
}

export const publishMovie = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const movie = await prisma.movie.findUnique({
      where: { id }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        isPublished: true,
        visibility: Visibility.PUBLIC
      }
    })

    res.json(updatedMovie)

  } catch (error) {
    res.status(500).json({ message: "Failed to publish movie" })
  }
}

export const getMovieStudio = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    let movie

    try {
      movie = await prisma.movie.findUnique({
        where: { id },
        include: {
          characters: true,
          scenes: buildStudioSceneInclude({
            includeBlocks: true,
            includeChoices: true
          })
        }
      })
    } catch (error) {
      const missingBlocks = isMissingSceneBlockTable(error)
      const missingChoices = isMissingChoiceTable(error)

      if (!missingBlocks && !missingChoices) {
        throw error
      }

      movie = await prisma.movie.findUnique({
        where: { id },
        include: {
          characters: true,
          scenes:
            !missingBlocks || !missingChoices
              ? buildStudioSceneInclude({
                  includeBlocks: !missingBlocks,
                  includeChoices: !missingChoices
                })
              : legacyStudioSceneInclude
        }
      })

      if (movie) {
        movie = {
          ...movie,
          scenes: movie.scenes.map(scene => ({
            ...scene,
            blocks: "blocks" in scene ? scene.blocks : [],
            choices: "choices" in scene ? scene.choices : []
          }))
        }
      }
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(movie)

  } catch (error) {
    res.status(500).json({ message: "Failed to load movie studio data" })
  }
}

export const getFullMovie = async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string
    const userId = req.userId

    let movie

    try {
      movie = await prisma.movie.findUnique({
        where: { slug },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          characters: true,
          scenes: buildStudioSceneInclude({
            includeBlocks: true,
            includeChoices: true
          }),
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true
                }
              }
            }
          },
          likes: true
        }
      })
    } catch (error) {
      const missingBlocks = isMissingSceneBlockTable(error)
      const missingChoices = isMissingChoiceTable(error)

      if (!missingBlocks && !missingChoices) {
        throw error
      }

      movie = await prisma.movie.findUnique({
        where: { slug },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          characters: true,
          scenes:
            !missingBlocks || !missingChoices
              ? buildStudioSceneInclude({
                  includeBlocks: !missingBlocks,
                  includeChoices: !missingChoices
                })
              : legacyStudioSceneInclude,
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true
                }
              }
            }
          },
          likes: true
        }
      })

      if (movie) {
        movie = {
          ...movie,
          scenes: movie.scenes.map(scene => ({
            ...scene,
            blocks: "blocks" in scene ? scene.blocks : [],
            choices: "choices" in scene ? scene.choices : []
          }))
        }
      }
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const isOwner = userId === movie.creatorId
    const isPublic = movie.isPublished && movie.visibility === Visibility.PUBLIC

    if (!isPublic && !isOwner) {
      return res.status(403).json({ message: "Movie not available" })
    }

    const averageRating =
      movie.ratings.length > 0
        ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
          movie.ratings.length
        : null

    const isLiked = userId 
      ? movie.likes.some(like => like.userId === userId)
      : false

    res.json({
      movie: {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        genre: movie.genre,
        runtime: movie.runtime,
        synopsis: movie.synopsis,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        creationType: movie.creationType,
        isPublished: movie.isPublished,
        creator: movie.creator,
        averageRating
      },
      characters: movie.characters,
      scenes: movie.scenes.map(mapSceneResponse),
      ratings: movie.ratings,
      likeCount: movie.likes.length,
      isLiked
    })

  } catch (error) {
    console.error("Fetch full movie error:", error)
    res.status(500).json({ message: "Failed to fetch movie screenplay" })
  }
}

export const saveMovieProgress = async (req: AuthRequest, res: Response) => {
  try {
    const movieId = req.params.id as string
    const userId = req.userId
    const sceneId = typeof req.body.sceneId === "string" ? req.body.sceneId.trim() : ""

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!sceneId) {
      return res.status(400).json({ message: "sceneId is required" })
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: { id: true }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const scene = await prisma.scene.findFirst({
      where: {
        id: sceneId,
        movieId
      },
      select: {
        id: true
      }
    })

    if (!scene) {
      return res.status(404).json({ message: "Scene not found for this movie" })
    }

    await prisma.$executeRaw`
      INSERT INTO "MovieProgress" ("id", "userId", "movieId", "sceneId", "updatedAt")
      VALUES (${randomUUID()}, ${userId}, ${movieId}, ${sceneId}, NOW())
      ON CONFLICT ("userId", "movieId")
      DO UPDATE SET
        "sceneId" = EXCLUDED."sceneId",
        "updatedAt" = NOW()
    `

    const [progress] = await prisma.$queryRaw<Array<{ sceneId: string; updatedAt: Date }>>`
      SELECT "sceneId", "updatedAt"
      FROM "MovieProgress"
      WHERE "userId" = ${userId} AND "movieId" = ${movieId}
      LIMIT 1
    `

    res.json({
      movieId,
      sceneId: progress?.sceneId ?? sceneId,
      updatedAt: progress?.updatedAt ?? new Date()
    })
  } catch (error) {
    console.error("SAVE MOVIE PROGRESS ERROR:", error)
    res.status(500).json({ message: "Failed to save movie progress" })
  }
}

export const getMovieProgress = async (req: AuthRequest, res: Response) => {
  try {
    const movieId = req.params.id as string
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: { id: true }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    const [progress] = await prisma.$queryRaw<Array<{ sceneId: string; updatedAt: Date }>>`
      SELECT "sceneId", "updatedAt"
      FROM "MovieProgress"
      WHERE "userId" = ${userId} AND "movieId" = ${movieId}
      LIMIT 1
    `

    res.json({
      movieId,
      sceneId: progress?.sceneId ?? null,
      updatedAt: progress?.updatedAt ?? null
    })
  } catch (error) {
    console.error("GET MOVIE PROGRESS ERROR:", error)
    res.status(500).json({ message: "Failed to load movie progress" })
  }
}

export const exploreMovies = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12

    const skip = (page - 1) * limit

    const movies = await prisma.movie.findMany({
      where: {
        isPublished: true,
        visibility: Visibility.PUBLIC
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true
          }
        },
        ratings: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    })

    const formattedMovies = movies.map(movie => {
      const avgRating =
        movie.ratings.length > 0
          ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
            movie.ratings.length
          : null

      return {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        genre: movie.genre,
        runtime: movie.runtime,
        posterUrl: movie.posterUrl,
        synopsis: movie.synopsis,
        creator: movie.creator,
        averageRating: avgRating,
        ratingsCount: movie.ratings.length
      }
    })

    res.json({
      page,
      results: formattedMovies.length,
      movies: formattedMovies
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" })
  }
}

export const getMyMovies = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const movies = await prisma.movie.findMany({
      where: {
        creatorId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const drafts = movies.filter(movie => !movie.isPublished)
    const privateMovies = movies.filter(
      movie => movie.isPublished && movie.visibility === Visibility.PRIVATE
    )
    const published = movies.filter(
      movie => movie.isPublished && movie.visibility === Visibility.PUBLIC
    )

    res.json({
      drafts,
      private: privateMovies,
      published
    })

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your movies" })
  }
}

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const movies = await prisma.movie.findMany({
      where: {
        isPublished: true,
        visibility: Visibility.PUBLIC,
        title: {
          contains: query,
          mode: "insensitive"
        }
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      },
      take: 10
    })

    res.json(movies)

  } catch (error) {
    res.status(500).json({ message: "Failed to search movies" })
  }
}

export const updateMovie = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId

    const { title, synopsis, runtime, visibility, posterUrl } = req.body

    const movie = await prisma.movie.findUnique({
      where: { id }
    })

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }

    if (movie.creatorId !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const normalizedVisibility = visibility 
      ? (visibility as string).toUpperCase() as Visibility 
      : undefined

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        genre: typeof req.body.genre === "string" ? req.body.genre.trim() : undefined,
        synopsis,
        runtime,
        visibility: normalizedVisibility,
        posterUrl,
        backdropUrl: req.body.backdropUrl
      }
    })

    res.json(updatedMovie)

  } catch (error) {
    res.status(500).json({ message: "Failed to update movie" })
  }
}

