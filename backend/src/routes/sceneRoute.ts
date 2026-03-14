import express from "express"
import { createScene, updateScene, deleteScene } from "../controllers/sceneController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createScene)
router.patch("/:id", authenticate, updateScene)

router.delete("/:id", authenticate, deleteScene)

export default router