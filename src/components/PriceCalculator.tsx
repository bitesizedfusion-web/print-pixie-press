import { useState } from "react";
import { products, paperTypes, quantities, calculatePrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { useVoiceInput, parseVoiceOrder } from "@/hooks/use-voice-input";
import { toast } from "sonner";

export function PriceCalculator() {
  const [productId, setProductId] = useState("flyers");
  const [size, setSize] = useState("A4");
  const [paper, setPaper] = useState("standard");
  const [quantity, setQuantity] = useState(500);
  const [turnaround, setTurnaround] = useState<"standard" | "express">("standard");
  const [voiceHint, setVoiceHint] = useState<string | null>(null);

  const voice = useVoiceInput({ lang: "en-AU" });

  const product = products.find(p => p.id === productId)!;
  const result = calculatePrice({ productId, size, quantity, paperType: paper, doubleSided: false, express: turnaround === "express" });

  const handleVoiceClick = () => {
    if (!voice.supported) {
      toast.error("Voice input isn't supported in this browser. Try Chrome or Safari.");
      return;
    }
    if (voice.listening) {
      voice.stop();
      return;
    }
    voice.start((finalText) => {
      setVoiceHint(finalText);
      const parsed = parseVoiceOrder(finalText);
      let appliedAny = false;
      const nextProductId = parsed.productId ?? productId;
      if (parsed.productId && parsed.productId !== productId) {
        setProductId(parsed.productId);
        const p = products.find((x) => x.id === parsed.productId);
        if (p) setSize(p.sizes[0]);
        appliedAny = true;
      }
      if (parsed.size) {
        const p = products.find((x) => x.id === nextProductId);
        if (p?.sizes.includes(parsed.size)) {
          setSize(parsed.size);
          appliedAny = true;
        }
      }
      if (parsed.quantity) {
        // Snap to nearest available qty bucket
        const closest = quantities.reduce((prev, curr) =>
          Math.abs(curr - parsed.quantity!) < Math.abs(prev - parsed.quantity!) ? curr : prev,
        );
        setQuantity(closest);
        appliedAny = true;
      }
      if (parsed.express !== undefined) {
        setTurnaround(parsed.express ? "express" : "standard");
        appliedAny = true;
      }
      if (appliedAny) {
        toast.success(`Heard: "${finalText}"`);
      } else {
        toast.info(`Couldn't pick up details from: "${finalText}"`);
      }
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
      {/* Voice search bar */}
      <div className="mb-5 flex items-center gap-3 p-3 rounded-lg bg-cta/5 border border-cta/15">
        <button
          type="button"
          onClick={handleVoiceClick}
          aria-label={voice.listening ? "Stop voice input" : "Start voice input"}
          className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            voice.listening
              ? "bg-cta text-cta-foreground animate-pulse-glow"
              : "bg-cta text-cta-foreground hover:bg-cta-hover hover:scale-110"
          }`}
        >
          {voice.listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cta">
            <Sparkles className="h-3 w-3" />
            <span>Voice Search</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {voice.listening
              ? "Listening… speak now"
              : voiceHint
              ? `Heard: "${voiceHint}"`
              : `Try: "A3 poster 100 copies express"`}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Product</label>
          <select value={productId} onChange={e => { setProductId(e.target.value); const p = products.find(x => x.id === e.target.value); if (p) setSize(p.sizes[0]); }}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none">
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Size</label>
          <select value={size} onChange={e => setSize(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none">
            {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Paper Type</label>
          <select value={paper} onChange={e => setPaper(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none">
            {paperTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Quantity</label>
          <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none">
            {quantities.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1.5">Turnaround</label>
          <div className="flex gap-2">
            {[
              { id: "standard" as const, label: "Standard 3–5 Days" },
              { id: "express" as const, label: "Express 1–2 Days (+30%)" },
            ].map(t => (
              <button key={t.id} onClick={() => setTurnaround(t.id)}
                className={`flex-1 h-10 rounded-md border text-sm font-medium transition-all ${turnaround === t.id ? 'border-cta bg-cta/10 text-cta' : 'border-input bg-background text-foreground hover:border-cta/50'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-sm text-muted-foreground">Total estimate:</span>
          <span className="ml-2 font-mono text-3xl font-bold text-cta">AUD ${result.total.toFixed(2)}</span>
        </div>
        <Button variant="cta" size="lg">Add to Cart</Button>
      </div>
    </div>
  );
}
