import express from "express"
import { getUserProfile,getFollowing,getFollowers } from "../controllers/userController.js"
import { updateProfile } from "../controllers/userController.js"
import { authenticate } from "../middleware/authMiddleware.js"


const router = express.Router()


router.get("/:username/following", getFollowing)
router.get("/:username/followers", getFollowers)
router.get("/:username", getUserProfile)

router.patch("/me", authenticate, updateProfile)


export default router