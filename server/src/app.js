import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Salesforce CRUD backend is running",
  });
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});