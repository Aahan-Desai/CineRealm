import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { createMovie } from "../controllers/movieController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)

export default router