import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3001;

app.use(express.json({ limit: "1mb" }));

// Fallback key so you don't need to set env vars during local dev
const HARDCODED_GEMINI_API_KEY = "AIzaSyAKciTYe4DzZeLth6sDW8M6cJjjsIb4nqk"; // Replace if needed

app.post("/api/gemini-chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || HARDCODED_GEMINI_API_KEY;
  try {
    const { messages = [], system } = req.body || {};
    const contents = (Array.isArray(messages) ? messages : []).map((m) => ({
      role: m.role === "assistant" ? "model" : m.role || "user",
      parts: [{ text: m.content ?? "" }],
    }));

    const systemInstruction = system ||
      "You are a helpful assistant for the FRA portal website. Answer questions about features, dashboards, and how to use the site. Keep responses concise and friendly.";

    const geminiRequest = {
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    };

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + encodeURIComponent(apiKey);

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiRequest),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: "Gemini request failed", details: text });
    }

    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const answer = parts.map((p) => p?.text).filter(Boolean).join("\n\n") || "";
    return res.json({ reply: answer });
  } catch (err) {
    return res.status(400).json({ error: "Invalid request", details: err?.message || String(err) });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`);
});


