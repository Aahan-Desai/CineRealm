import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { createMovie, getMovies, getMovieBySlug, publishMovie, getMovieStudio, getFullMovie, exploreMovies, getMyMovies, searchMovies } from "../controllers/movieController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)

router.get("/", getMovies)
router.get("/explore", exploreMovies)
router.get("/search", searchMovies)
router.get("/my", authenticate, getMyMovies)
router.get("/:slug/full", getFullMovie)
router.get("/:slug", getMovieBySlug)
router.get("/:id/studio", authenticate, getMovieStudio)


router.patch("/:id/publish", authenticate, publishMovie)

export default router