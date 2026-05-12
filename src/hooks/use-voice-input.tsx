import { useEffect, useRef, useState, useCallback } from "react";

// Minimal types for the Web Speech API (not in TS lib by default).
type SpeechRecognitionEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } } & {
    length: number;
  };
};
type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceInput(opts?: { lang?: string }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setSupported(getRecognition() !== null);
  }, []);

  const start = useCallback(
    (onFinal?: (text: string) => void) => {
      const Ctor = getRecognition();
      if (!Ctor) return;
      const rec = new Ctor();
      rec.lang = opts?.lang ?? "en-AU";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const text = e.results[0]?.[0]?.transcript ?? "";
        setTranscript(text);
        if (onFinal) onFinal(text);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
      setTranscript("");
      setListening(true);
      rec.start();
    },
    [opts?.lang],
  );

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, transcript, start, stop };
}

/** Parse a free-form voice command into calculator fields. */
export function parseVoiceOrder(text: string): {
  productId?: string;
  size?: string;
  quantity?: number;
  express?: boolean;
} {
  const lower = text.toLowerCase();
  const out: ReturnType<typeof parseVoiceOrder> = {};

  // Product
  if (/poster/.test(lower)) out.productId = "posters";
  else if (/flyer|leaflet/.test(lower)) out.productId = "flyers";
  else if (/brochure/.test(lower)) out.productId = "brochures";
  else if (/banner/.test(lower)) out.productId = "banners";
  else if (/calendar/.test(lower)) out.productId = "calendars";
  else if (/certificate/.test(lower)) out.productId = "certificates";

  // Size — look for A0-A5 or DL
  const sizeMatch = lower.match(/\b(a[0-5]|dl)\b/);
  if (sizeMatch) out.size = sizeMatch[1].toUpperCase();

  // Quantity — first number found, prefer ones followed by "copies"/"copy"/"x"/"pieces"
  const qtyExplicit = lower.match(/(\d{1,5})\s*(?:copies|copy|pieces|pcs|x)/);
  if (qtyExplicit) {
    out.quantity = Number(qtyExplicit[1]);
  } else {
    const anyNum = lower.match(/\b(\d{2,5})\b/);
    if (anyNum) out.quantity = Number(anyNum[1]);
  }

  // Express
  if (/express|urgent|rush|24\s*hr|next day|fast/.test(lower)) out.express = true;

  return out;
}
