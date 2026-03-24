import express from "express"
import upload from "../middleware/uploadMiddleware.js"
import { uploadImage } from "../controllers/uploadController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", upload.single("file"), authenticate, uploadImage)

export default router