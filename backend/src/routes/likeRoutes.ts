import { Router } from "express";
import { likeMovie, unlikeMovie } from "../controllers/likeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:movieId/like", authenticate, likeMovie);
router.delete("/:movieId/like", authenticate, unlikeMovie);

export default router;