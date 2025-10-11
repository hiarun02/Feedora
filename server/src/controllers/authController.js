import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Register user
export const register = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "Email and password are required"});
    }

    const existingUser = await prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {email, password: hashedPassword},
    });
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({message: "Email and password are required"});
    }

    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    const tokenData = {id: user.id, email: user.email};

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("user_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        success: true,
        user,
      });
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
};

// Logout user

export const logout = async (req, res) => {
  try {
    res.clearCookie("user_token");
    return res.status(200).json({message: "Logout successful"});
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
};
