// Netlify serverless function to proxy requests to Google Gemini API
// Expects: POST { messages: Array<{ role: string; content: string }> }
// Reads API key from environment: GEMINI_API_KEY

export const config = {
  path: "/.netlify/functions/gemini-chat",
};

type ChatMessage = {
  role: "user" | "model" | string;
  content: string;
};

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
};

type NetlifyContext = unknown;

export async function handler(event: NetlifyEvent, _context: NetlifyContext) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAKciTYe4DzZeLth6sDW8M6cJjjsIb4nqk";
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
    };
  }

  try {
    const parsed = event.body ? JSON.parse(event.body) : {};
    const messages: ChatMessage[] = Array.isArray(parsed.messages)
      ? parsed.messages
      : [];

    // Transform to Gemini content parts
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role || "user",
      parts: [{ text: m.content ?? "" }],
    }));

    // Safety: prepend brief system guidance about the site if provided
    const systemInstruction = parsed.system ||
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
      return {
        statusCode: resp.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Gemini request failed", details: text }),
      };
    }

    const data = await resp.json();
    // Extract plain text from Gemini response
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const answer = parts.map((p: any) => p?.text).filter(Boolean).join("\n\n") || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: answer }),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid request", details: err?.message || String(err) }),
    };
  }
}


