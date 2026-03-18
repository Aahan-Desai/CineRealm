import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"



export const registerUser = async (req: Request, res: Response) => {
  try {
    let { username, email, password } = req.body;

    username = username?.trim().toLowerCase();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    const { password: _password, ...safeUser } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {

    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("LOGIN ATTEMPT:", { email });
    }
    // Find user by email OR username (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { username: { equals: email, mode: 'insensitive' } }
        ]
      }
    });

    if (!user) {
      if (process.env.NODE_ENV === "development") {
        console.log("USER NOT FOUND for:", email);
      }
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("USER FOUND:", { id: user.id, email: user.email, username: user.username });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", validPassword);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    )

    const refreshToken = crypto.randomBytes(40).toString("hex")

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    })
   const { password: _password, ...safeUser } = user;

    res.json({
  user: safeUser,
  accessToken,
  refreshToken,
})

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" })
    }

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!tokenInDb) {
      return res.status(401).json({ message: "Invalid refresh token" })
    }

    if (tokenInDb.expiresAt < new Date()) {
      return res.status(401).json({ message: "Expired refresh token" })
    }

    const newAccessToken = jwt.sign(
      { userId: tokenInDb.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    )

    res.json({ accessToken: newAccessToken })

  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token" })
  }
}