import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("CineRealm API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});