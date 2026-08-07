"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Provider = "grok" | "gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAgentPanelProps {
  // Nama data yang sedang dilihat, dikirim sebagai konteks ke AI nanti
  // (misal "Scorecard — Waste Management") supaya user tidak perlu
  // jelaskan ulang datanya tiap tanya.
  context: string;
}

export function AiAgentPanel({ context }: AiAgentPanelProps) {
  const [provider, setProvider] = useState<Provider>("grok");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  function handleSend() {
    if (!input.trim() || isSending) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    // TODO: ganti bagian ini dengan fetch ke /api/ai, body: { provider, context, messages }.
    // Endpoint itu yang nanti proxy ke Grok/Gemini di server (API key tidak boleh
    // ada di client). Untuk sekarang masih placeholder supaya UI-nya bisa dites.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `(Placeholder) Belum terhubung ke ${
            provider === "grok" ? "Grok" : "Gemini"
          }. Jawaban asli akan muncul di sini setelah backend AI disambungkan.`,
        },
      ]);
      setIsSending(false);
    }, 500);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Tanya AI</CardTitle>
        </div>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as Provider)}
          className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground"
          aria-label="Pilih provider AI"
        >
          <option value="grok">Grok</option>
          <option value="gemini">Gemini</option>
        </select>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-56 space-y-2 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Tanyakan sesuatu tentang data {context} di atas, misalnya &quot;kenapa
              skornya turun kuartal ini?&quot;
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-xs ${
                m.role === "user"
                  ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                  : "mr-auto max-w-[80%] bg-muted text-foreground"
              }`}
            >
              {m.content}
            </div>
          ))}
          {isSending && (
            <div className="mr-auto max-w-[80%] rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Mengetik...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tulis pertanyaan..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
          <button
            onClick={handleSend}
            className="flex items-center justify-center rounded-lg bg-primary px-3 text-primary-foreground disabled:opacity-50"
            aria-label="Kirim pertanyaan"
            disabled={isSending}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
