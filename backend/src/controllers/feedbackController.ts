import { Response } from "express"
import prisma from "../config/prisma.js"
import { AuthRequest } from "../middleware/authMiddleware.js"

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const { type, message, page } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const feedback = await prisma.feedback.create({
      data: {
        type,
        message,
        page,
        userId: userId || null
      }
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};