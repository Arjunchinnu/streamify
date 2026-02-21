// backend/routes/videoRoutes.js
import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { generateStreamVideoToken } from "../lib/stream.js";

const router = express.Router();

router.get("/token", protectedRoute, async (req, res) => {
  try {
    const token = generateStreamVideoToken(req.user._id);
    res.json({ token });
  } catch (err) {
    console.error("Failed to generate token:", err);
    res.status(500).json({ message: "Could not generate token" });
  }
});

export default router;
