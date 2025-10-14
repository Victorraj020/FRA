import { useEffect, useMemo, useRef, useState } from "react";
import { sendChat, type ChatMessage } from "@/services/geminiChat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

type ChatWidgetProps = {
  autoOpenDelayMs?: number;
  welcomeText?: string;
};

export default function ChatWidget({ autoOpenDelayMs = 10000, welcomeText = "Hi! I can help you explore this site. Ask me anything." }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Auto open after delay on first mount of a page
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), autoOpenDelayMs);
    return () => clearTimeout(t);
  }, [autoOpenDelayMs]);

  // Seed a welcome message when opened first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && welcomeText) {
      setMessages([{ role: "assistant", content: welcomeText }]);
    }
  }, [isOpen, messages.length, welcomeText]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  async function onSend() {
    if (!canSend) return;
    const newUser: ChatMessage = { role: "user", content: input.trim() };
    const next = [...messages, newUser];
    setMessages(next);
    setInput("");
    setIsSending(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const reply = await sendChat(next, { signal: abortRef.current.signal, system: "You are a helpful assistant for the FRA portal website. Guide users to dashboards, features, and how to find information." });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't get a response just now." }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white shadow-2xl rounded-2xl border flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <Bot className="h-4 w-4" />
              </span>
              Site Assistant
            </div>
            <button aria-label="Close chat" className="text-white/80 hover:text-white" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={cn("whitespace-pre-wrap", m.role === "assistant" ? "bg-gray-50 border text-gray-900 p-2 rounded-md" : "text-gray-800")}>{m.content}</div>
            ))}
          </div>
          <div className="p-3 border-t space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this website..."
              className="w-full h-16 resize-none border rounded-md px-2 py-2 focus:outline-none focus:ring"
            />
            <div className="flex justify-end">
              <Button disabled={!canSend} onClick={onSend}>{isSending ? "Sending..." : "Send"}</Button>
            </div>
          </div>
        </div>
      )}
      {!isOpen && (
        <div className="relative group">
          <button
            aria-label="Open chat assistant"
            title="Chat with assistant"
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl border border-white/20 flex items-center justify-center transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            <Bot className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </button>
          <div className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition">
            <div className="px-3 py-1 rounded-full bg-white shadow-lg text-gray-900 text-xs font-semibold border">Ask AI</div>
          </div>
        </div>
      )}
    </div>
  );
}


