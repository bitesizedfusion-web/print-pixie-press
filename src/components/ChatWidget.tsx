import { useEffect, useRef, useState, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useVoiceInput } from "@/hooks/use-voice-input";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = ["Get a quote", "How do I order?", "দাম জানতে চাই", "मुझे पोस्टर चाहिए"];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! 👋 I'm **PrintBot** — your AI printing assistant. Ask me about prices, sizes, paper types, or how to order.\n\n🎤 Tap the mic to talk, 🔊 toggle voice replies on/off.\n\nI speak English, বাংলা, हिन्दी and 中文.",
};

// Strip markdown so TTS reads cleanly
function stripMarkdown(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~#>]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSpokenRef = useRef<string>("");

  const {
    supported: voiceSupported,
    listening,
    start: startListening,
    stop: stopListening,
  } = useVoiceInput({ lang: "en-AU" });

  // Initial TTS support detection
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const speak = useCallback(
    (text: string) => {
      if (!ttsSupported || !voiceReplies) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(stripMarkdown(text));
        utter.rate = 1.05;
        utter.pitch = 1;
        utter.volume = 1;
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
      } catch {
        /* ignore */
      }
    },
    [ttsSupported, voiceReplies],
  );

  const stopSpeaking = useCallback(() => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [ttsSupported]);

  // When voice replies disabled, kill any in-flight TTS
  useEffect(() => {
    if (!voiceReplies) stopSpeaking();
  }, [voiceReplies, stopSpeaking]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    stopSpeaking();

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/printbot-chat`;
    let assistantBuf = "";
    const upsert = (chunk: string) => {
      assistantBuf += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last !== GREETING) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantBuf } : m));
        }
        return [...prev, { role: "assistant", content: assistantBuf }];
      });
    };

    try {
      const apiHistory = nextMessages.filter((m) => m !== GREETING);
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiHistory }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Too many requests — try again in a moment.");
        else if (resp.status === 402) toast.error("PrintBot is temporarily unavailable.");
        else toast.error("PrintBot couldn't reply. Try again.");
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const r = await reader.read();
        if (r.done) break;
        buf += decoder.decode(r.value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // Speak the final assistant message once streaming completes
      if (assistantBuf && assistantBuf !== lastSpokenRef.current) {
        lastSpokenRef.current = assistantBuf;
        speak(assistantBuf);
      }
    } catch (err) {
      console.error("chat error", err);
      toast.error("Network error — please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleMic = () => {
    if (!voiceSupported) {
      toast.error(
        "Voice input isn't supported in this browser. Try Chrome on Android or Safari on iOS.",
      );
      return;
    }
    if (listening) {
      stopListening();
      return;
    }
    stopSpeaking();
    startListening((finalText) => {
      if (finalText) send(finalText);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl shadow-2xl border border-border mb-4 w-[360px] sm:w-[400px] overflow-hidden flex flex-col"
            style={{ height: "min(560px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="bg-gradient-cta text-cta-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm">PrintBot AI · Voice</div>
                  <div className="text-xs text-cta-foreground/80 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${speaking ? "bg-yellow-300 animate-pulse" : listening ? "bg-red-400 animate-pulse" : "bg-green-400 animate-pulse"}`}
                    />
                    {speaking ? "Speaking…" : listening ? "Listening…" : "Online · 24/7"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {ttsSupported && (
                  <button
                    onClick={() => setVoiceReplies((v) => !v)}
                    aria-label={voiceReplies ? "Mute voice replies" : "Enable voice replies"}
                    title={voiceReplies ? "Mute voice replies" : "Enable voice replies"}
                    className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    {voiceReplies ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    stopSpeaking();
                    setOpen(false);
                  }}
                  aria-label="Close chat"
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-cta text-cta-foreground rounded-br-md"
                        : "bg-accent text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>*]:my-1 [&>p]:leading-relaxed [&_a]:text-cta [&_a]:font-semibold [&_strong]:text-foreground">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-accent rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Starter chips (only show before first reply) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 bg-background">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={isStreaming}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-cta hover:text-cta transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-card flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleMic}
                disabled={isStreaming}
                aria-label={listening ? "Stop listening" : "Start voice input"}
                title={listening ? "Stop listening" : "Talk to PrintBot"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  listening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-accent text-foreground hover:bg-accent/80"
                } disabled:opacity-50`}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening…" : "Type or tap the mic…"}
                disabled={isStreaming}
                className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cta transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Send"
                className="w-9 h-9 rounded-full bg-cta text-cta-foreground flex items-center justify-center hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="bg-gradient-cta text-cta-foreground rounded-full p-4 shadow-cta hover:shadow-cta-hover transition-all hover:scale-110 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
