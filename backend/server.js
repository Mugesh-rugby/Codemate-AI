import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again." },
});

app.use("/api/chat", limiter, chatRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", groqConfigured: Boolean(process.env.GROQ_API_KEY) });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Something went wrong on our end. Please try again." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CodeMate AI backend running on port ${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn("Warning: GROQ_API_KEY is not set. Add it to backend/.env");
  }
});
