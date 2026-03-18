import { Response } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const likeMovie = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const movieId = req.params.movieId as string;

  try {
    const like = await prisma.like.create({
      data: {
        userId,
        movieId,
      },
    });

    res.json(like);
  } catch (error) {
    res.status(400).json({ message: "Already liked or error occurred" });
  }
};

export const unlikeMovie = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const movieId = req.params.movieId as string;

  try {
    await prisma.like.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    res.json({ message: "Unliked successfully" });
  } catch (error) {
    res.status(400).json({ message: "Like not found" });
  }
};