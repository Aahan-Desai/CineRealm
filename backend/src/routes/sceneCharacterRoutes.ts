import express from "express"
import { addCharacterToScene } from "../controllers/sceneCharacterController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, addCharacterToScene)

export default router