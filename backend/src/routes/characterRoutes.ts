import express from "express"
import { createCharacter } from "../controllers/characterController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createCharacter)

export default router