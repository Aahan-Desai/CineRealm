import express from "express"
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js"
import { createMovie, getMovies, getMovieBySlug, publishMovie, getMovieStudio, getFullMovie, exploreMovies, getMyMovies, searchMovies, updateMovie, getMovieProgress, saveMovieProgress, deleteMovie } from "../controllers/movieController.js"
import { getFeed } from "../controllers/feedController.js"

const router = express.Router()

// Protected route
router.post("/", authenticate, createMovie)

router.get("/", getMovies)
router.get("/feed", authenticate, getFeed)
router.get("/explore", exploreMovies)
router.get("/search", searchMovies)
router.get("/my", authenticate, getMyMovies)
router.get("/:id/progress", authenticate, getMovieProgress)
router.post("/:id/progress", authenticate, saveMovieProgress)
router.get("/:slug/full", optionalAuthenticate, getFullMovie)
router.get("/:slug", getMovieBySlug)
router.get("/:id/studio", authenticate, getMovieStudio)


router.patch("/:id/publish", authenticate, publishMovie)
router.patch("/:id", authenticate, updateMovie)
router.delete("/:id", authenticate, deleteMovie)

export default router
