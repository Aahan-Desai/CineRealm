import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

    const { password: _, ...safeUser } = user;

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

    console.log("LOGIN ATTEMPT:", { email });

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
      console.log("USER NOT FOUND for:", email);
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    console.log("USER FOUND:", { id: user.id, email: user.email, username: user.username });

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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;

    res.json({
      token,
      user: safeUser
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};