import express from "express"
import { createScene, updateScene, deleteScene } from "../controllers/sceneController.js"
import { getSceneReactions, reactToScene } from "../controllers/sceneReactionController.js"
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, createScene)
router.patch("/:id", authenticate, updateScene)
router.post("/:id/react", authenticate, reactToScene)
router.get("/:id/reactions", optionalAuthenticate, getSceneReactions)

router.delete("/:id", authenticate, deleteScene)

export default router
