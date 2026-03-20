import express from "express"
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js"
import { createMovie, getMovies, getMovieBySlug, publishMovie, getMovieStudio, getFullMovie, exploreMovies, getMyMovies, searchMovies, updateMovie } from "../controllers/movieController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)

router.get("/", getMovies)
router.get("/explore", exploreMovies)
router.get("/search", searchMovies)
router.get("/my", authenticate, getMyMovies)
router.get("/:slug/full", optionalAuthenticate, getFullMovie)
router.get("/:slug", getMovieBySlug)
router.get("/:id/studio", authenticate, getMovieStudio)


router.patch("/:id/publish", authenticate, publishMovie)
router.patch("/:id", authenticate, updateMovie)

export default router