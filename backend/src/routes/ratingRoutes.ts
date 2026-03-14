import express from "express"
import { rateMovie } from "../controllers/ratingController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, rateMovie)

export default router