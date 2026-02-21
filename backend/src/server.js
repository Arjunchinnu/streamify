import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import dotenv from "dotenv";
import connectdb from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://streamify-frontend-kvhy.onrender.com", 
    ],
    credentials: false,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/video", videoRoutes);a

const port = process.env.PORT || 5001;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectdb();
});
