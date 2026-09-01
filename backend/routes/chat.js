import { Router } from "express";
import { askCodeMate } from "../services/groqService.js";

const router = Router();

router.post("/", async (req, res) => {
  const { question, history } = req.body || {};

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Please enter a coding question." });
  }

  if (question.length > 4000) {
    return res.status(400).json({ error: "That question is too long. Please shorten it." });
  }

  try {
    const result = await askCodeMate(question.trim(), Array.isArray(history) ? history : []);
    return res.json(result);
  } catch (err) {
    const status = err?.status ?? err?.error?.status ?? 0;
    const msg = err?.message || err?.error?.message || String(err);
    console.error("Groq request failed [status=%d]:", status, msg);

    if (status === 401 || status === 400 || status === 404 || /api.?key|auth|invalid|unauthorized|model.*not.*found/i.test(msg)) {
      return res.status(500).json({
        error: "The AI service is not configured correctly. Please contact the administrator.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "CodeMate AI is receiving too many requests right now. Please try again shortly.",
      });
    }

    return res.status(500).json({
      error: "Unable to generate a response right now. Please try again.",
    });
  }
});

export default router;
