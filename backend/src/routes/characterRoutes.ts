import express from "express"
import { createCharacter, deleteCharacter, updateCharacter } from "../controllers/characterController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createCharacter)
router.patch("/:id", authenticate, updateCharacter)
router.delete("/:id", authenticate, deleteCharacter)

export default router
