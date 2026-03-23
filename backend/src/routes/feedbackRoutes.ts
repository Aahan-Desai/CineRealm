import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import { optionalAuthenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", optionalAuthenticate, submitFeedback);

export default router;