import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare } from "lucide-react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const PREDEFINED_QA: Record<string, string> = {
  "What is this portal about?": "This is the FRA (Forest Rights Act) portal website. It helps you explore dashboards, features, and find information regarding forest rights.",
  "How to track my application?": "You can track your application by navigating to the 'Track Application' section on the homepage and entering your Application ID.",
  "Where can I find the dashboard?": "The main dashboard can be accessed by clicking 'Dashboard' in the top navigation menu. It provides an overview of all analytics and statistics.",
  "How do I submit a new claim?": "To submit a new claim, go to the 'Services' tab, select 'New Claim', and follow the guided submission process.",
  "Who can I contact for help?": "For further assistance, please visit the 'Contact Us' page."
};

const PREDEFINED_QUESTIONS = Object.keys(PREDEFINED_QA);

type ChatWidgetProps = {
  autoOpenDelayMs?: number;
  welcomeText?: string;
};

export default function ChatWidget({ autoOpenDelayMs = 10000, welcomeText = "Hi! I can help you explore this site. Try asking one of the predefined questions below." }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handleSend = (text: string) => {
    if (!text.trim() || isSending) return;

    const newUserMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsSending(true);

    // Simulate network delay
    setTimeout(() => {
      let replyText = PREDEFINED_QA[text.trim()];

      if (!replyText) {
        // Fallback for custom typing
        replyText = "I am a simple pre-defined chatbot now. Please select one of the suggested questions, or type one exactly as provided.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
      setIsSending(false);
    }, 600);
  };

  const onSend = () => {
    handleSend(input);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white shadow-2xl rounded-2xl border flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </span>
              Site Assistant
            </div>
            <button aria-label="Close chat" className="text-white/80 hover:text-white text-xl leading-none" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-4 text-sm bg-gray-50/50">
            {messages.map((m, idx) => (
              <div key={idx} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "px-3 py-2 max-w-[85%] rounded-2xl shadow-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border text-gray-800 rounded-bl-sm"
                )}>
                  {m.content}
                </div>
              </div>
            ))}

            {!isSending && (
              <div className="flex flex-col gap-2 mt-4 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium ml-1">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-left text-xs bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-3 py-1.5 rounded-full transition-colors shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 max-w-[80%] rounded-2xl bg-white border rounded-bl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-white space-y-2">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Ask about this website..."
                className="flex-1 h-10 min-h-[40px] max-h-[100px] resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <Button disabled={!canSend} onClick={onSend} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0">
                {isSending ? "..." : "Send"}
              </Button>
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
            className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl border border-white/20 flex items-center justify-center transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            <MessageSquare className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </button>
        </div>
      )}
    </div>
  );
}


