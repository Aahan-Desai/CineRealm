import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import {
  followUser,
  unfollowUser,
} from "../controllers/followController.js"

const router = express.Router()

router.post("/:userId", authenticate, followUser)
router.delete("/:userId", authenticate, unfollowUser)

export default router