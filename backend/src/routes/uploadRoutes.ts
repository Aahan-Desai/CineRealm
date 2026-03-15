import express from "express"
import upload from "../middleware/uploadMiddleware.js"
import { uploadImage } from "../controllers/uploadController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authenticate, upload.single("image"), uploadImage)

export default router