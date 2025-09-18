import { Router, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();

// ===== Signup =====
router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password, type } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    await new User({ name, email, password, type }).save();

    // ✅ No token here — just confirm success, frontend redirects to login
    return res.status(201).json({
      success: true,
      message: "Signup successful, please login",
    });
  } catch (err: any) {
    console.log("Signup error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ message: "Server error during signup" });
  }
});

// ===== Login =====
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // const valid = await user.comparePassword(password);
    // if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    if(user.password !== password)
      return res.status(400).json({message: "Invalid credentials"});



    // ✅ Cast _id to string
    const userId = user._id.toString();

    if(user) {
      const token = jwt.sign(
        { id: userId, type: user.type },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      res.json({
          token:token,
          user: {
          id: userId, // ✅ string, not ObjectId
          name: user.name,
          email: user.email,
          type: user.type,
        },
      })

      return;
    }

    return res.status(401).json({message: "Invalid email or password"})
  } catch (err: any) {
    console.log("Login failed:" + (err.response?.data || err.message));
    return res
      .status(500)
      .json({ message: "Server error during login" });
  }
});


export default router;
