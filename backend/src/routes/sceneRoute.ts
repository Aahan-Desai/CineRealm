import express from "express"
import { createScene } from "../controllers/sceneController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createScene)

export default router