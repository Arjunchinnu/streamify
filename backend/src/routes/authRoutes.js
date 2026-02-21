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

router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user, token });
});

export default router;
