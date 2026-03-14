import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { createMovie, getMovies, getMovieBySlug, publishMovie, getMovieStudio, getFullMovie  } from "../controllers/movieController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)

router.get("/", getMovies)
router.get("/:slug", getMovieBySlug)
router.get("/:id/studio", authenticate, getMovieStudio)
router.get("/:slug/full", getFullMovie)

router.patch("/:id/publish", authenticate, publishMovie)

export default router