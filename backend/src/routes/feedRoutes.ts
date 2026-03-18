import { Router } from "express";
import { getFeed } from "../controllers/feedController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/feed", authenticate, getFeed);

export default router;