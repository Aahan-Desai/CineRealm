import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { createMovie, getMovies, getMovieBySlug, publishMovie } from "../controllers/movieController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)
router.patch("/:id/publish", authenticate, publishMovie)

router.get("/", getMovies)
router.get("/:slug", getMovieBySlug)

export default router