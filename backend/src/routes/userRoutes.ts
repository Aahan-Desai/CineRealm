import express from "express"
import { getUserProfile } from "../controllers/userController.js"
import { updateProfile } from "../controllers/userController.js"
import { authenticate } from "../middleware/authMiddleware.js"


const router = express.Router()

router.get("/:username", getUserProfile)

router.patch("/me", authenticate, updateProfile)


export default router