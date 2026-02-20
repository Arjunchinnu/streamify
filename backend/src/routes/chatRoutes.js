import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { getStreamToken } from "../controllers.js/chatController.js";

const router = express.Router();

router.get("/token", protectedRoute, getStreamToken);

export default router;
