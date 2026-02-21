import express from "express";
import {
  login,
  logout,
  signup,
  onboard,
} from "../controllers.js/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboard);


router.get("/me", protectedRoute, async (req, res) => {
  try {
    // Use correct JWT secret from .env
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET_KEY, // <-- fixed here
      { expiresIn: "7d" },
    );

    res.status(200).json({ success: true, user: req.user, token });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
