import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  MessageSquarePlus,
  Loader2,
} from "lucide-react";
import { chatWithAi } from "@/services/aiService";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Suggest 3 post ideas for our SaaS launch",
  "What's the best time to post on LinkedIn?",
  "Draft a subject line for an onboarding email",
  "How can I improve my lead scoring strategy?",
];

const greetingMessage: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm your AI marketing assistant, powered by Gemini 2.5. Ask me anything about campaigns, content, leads, or strategy.",
  timestamp: new Date(),
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const reply = await chatWithAi(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I couldn't reach the AI right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const startNewConversation = () => {
    setMessages([{ ...greetingMessage, timestamp: new Date() }]);
    setInput("");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[150] h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open AI assistant"
        >
          <Bot size={24} />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[150] w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-3rem))] flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <header className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">AI Assistant</p>
                <p className="text-[11px] text-white/70">
                  Powered by Gemini 2.5 · Always learning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={startNewConversation}
                title="Start new conversation"
                className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              >
                <MessageSquarePlus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking…</span>
                </div>
              </div>
            )}

            {messages.length === 1 && !isThinking && (
              <div className="pt-2">
                <p className="text-[11px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-2 px-1">
                  Try asking
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t border-[var(--border)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              disabled={isThinking}
              className="flex-1 enterprise-input"
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
