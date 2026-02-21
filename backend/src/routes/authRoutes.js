import express from "express";
import {
  login,
  logout,
  signup,
  onboard,
  me,
} from "../controllers.js/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboard);

router.get("/me", protectedRoute, me);

export default router;
