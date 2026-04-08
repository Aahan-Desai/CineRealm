import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import sceneCharacterRoutes from "./routes/sceneCharacterRoutes.js";
import sceneRoutes from "./routes/sceneRoute.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: true, // Allows all origins, including your Vercel frontend
    credentials: true,
  })
)
app.use(express.json());

app.use(apiLimiter)

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/characters", characterRoutes);
app.use("/scenes", sceneRoutes);
app.use("/scene-characters", sceneCharacterRoutes);
app.use("/ratings", ratingRoutes)
app.use("/users", userRoutes)
app.use("/uploads", uploadRoutes)
app.use("/feedback", feedbackRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("CineRealm API Running");
});

// server starting
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});