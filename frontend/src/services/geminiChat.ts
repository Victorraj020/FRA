export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendChat(messages: ChatMessage[], opts?: { signal?: AbortSignal; system?: string }) {
  const endpoint = import.meta.env.DEV ? "/api/gemini-chat" : "/.netlify/functions/gemini-chat";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system: opts?.system }),
    signal: opts?.signal,
  });
  if (!res.ok) {
    let details: string | undefined;
    try {
      const j = await res.json();
      details = j?.details;
    } catch {}
    throw new Error(`Gemini chat failed: ${res.status} ${details ?? ""}`);
  }
  const data = await res.json();
  return String(data?.reply ?? "");
}


