import express from "express";
import {
  login,
  logout,
  signup,
  onboard,
} from "../controllers.js/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboard);

import jwt from "jsonwebtoken";

router.get("/me", protectedRoute, (req, res) => {
  try {
    // Generate a new token for the logged-in user
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send user info + token back to frontend
    res.status(200).json({ success: true, user: req.user, token });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
