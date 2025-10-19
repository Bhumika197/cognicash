"use client";
import { useEffect, useState } from "react";

export default function ChatWidget() {
  type Message = { role: "user" | "bot"; text: string };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I’m Finmate. How can I help today?" },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    function openHandler() {
      setOpen(true);
    }
    window.addEventListener("finmate:open-chat", openHandler as EventListener);
    return () => window.removeEventListener("finmate:open-chat", openHandler as EventListener);
  }, []);

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const next: Message[] = [...messages, userMsg];
    setMessages(next);
    setInput("");
    void handleBotTurn(userMsg.text);
  }

  function reply(text: string) {
    const botMsg: Message = { role: "bot", text };
    setMessages((m) => [...m, botMsg]);
  }

  async function handleBotTurn(userText: string) {
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      if (data?.ok && data.reply) reply(data.reply as string);
      else reply("I couldn’t process that right now. Please try again.");
    } catch {
      reply("I couldn’t process that right now. Please try again.");
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open && (
        <div className="w-80 h-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 text-sm font-semibold">Finmate Assistant</div>
          <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "bot" ? "text-neutral-700 dark:text-neutral-200" : "text-right"}>
                <span className={
                  "inline-block px-2 py-1 rounded-md " +
                  (m.role === "bot"
                    ? "bg-neutral-100 dark:bg-neutral-800"
                    : "bg-black text-white dark:bg-white dark:text-black")
                }>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
            <input
              className="flex-1 text-sm px-2 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Finmate..."
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button onClick={send} className="px-3 py-2 rounded-md bg-black text-white text-sm dark:bg-white dark:text-black">Send</button>
          </div>
          <div className="px-3 py-1 text-[10px] text-neutral-500">Privacy-first. Your data stays local unless you consent.</div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Finmate Assistant"
        className="rounded-full w-14 h-14 shadow-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm"
      >
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
}
