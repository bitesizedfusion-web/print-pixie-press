import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Type, Square, Circle as CircleIcon, Minus, Image as ImageIcon, Trash2,
  Undo2, Redo2, Download, ShoppingCart, Layers, Loader2, Bold, Italic,
  AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart, type CartItem } from "@/lib/cart";
import { products } from "@/lib/pricing";
import type Konva from "konva";
import type { DesignElement } from "@/components/designer/DesignerCanvas";

// Konva uses window — load only on the client
const DesignerCanvas = lazy(() =>
  import("@/components/designer/DesignerCanvas").then((m) => ({ default: m.DesignerCanvas })),
);

export const Route = createFileRoute("/designer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Free Online Print Designer — Create Flyers, Posters & Cards | S&S Printing and Packaging" },
      { name: "description", content: "Design your own flyers, posters, business cards and banners in your browser. Drag-and-drop editor, free templates, instant PDF export, fast Australia-wide printing." },
    ],
  }),
  component: DesignerPage,
});

// ============== Templates / formats ==============
type Format = {
  id: string;
  label: string;
  productId: string; // links to /lib/pricing product
  size: string; // size key in pricing
  widthMm: number;
  heightMm: number;
};

const FORMATS: Format[] = [
  { id: "flyer-a5", label: "Flyer A5", productId: "flyers", size: "A5", widthMm: 148, heightMm: 210 },
  { id: "flyer-a4", label: "Flyer A4", productId: "flyers", size: "A4", widthMm: 210, heightMm: 297 },
  { id: "poster-a3", label: "Poster A3", productId: "posters", size: "A3", widthMm: 297, heightMm: 420 },
  { id: "poster-a2", label: "Poster A2", productId: "posters", size: "A2", widthMm: 420, heightMm: 594 },
  { id: "card", label: "Business Card", productId: "flyers", size: "DL", widthMm: 90, heightMm: 55 },
  { id: "banner", label: "Pull-up Banner", productId: "banners", size: "850×2000mm", widthMm: 850, heightMm: 2000 },
];

const FONTS = [
  "Inter Tight",
  "Fraunces",
  "Georgia",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Impact",
  "Arial Black",
];

const PALETTE = [
  "#000000", "#ffffff", "#e8365d", "#0d1b35", "#f5f1e8",
  "#1a73e8", "#34a853", "#fbbc04", "#9c27b0", "#ff7043",
];

const uid = () => Math.random().toString(36).slice(2, 10);

function templateFor(formatId: string, w: number, h: number): DesignElement[] {
  // Simple printable starter layouts that look intentional
  if (formatId === "card") {
    return [
      { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: "#0d1b35" },
      { id: uid(), type: "rect", x: 0, y: h - 14, width: w, height: 14, fill: "#e8365d" },
      { id: uid(), type: "text", x: 24, y: 24, text: "Your Name", fontSize: 28, fontFamily: "Fraunces", fill: "#ffffff", fontStyle: "bold" },
      { id: uid(), type: "text", x: 24, y: 60, text: "Job title", fontSize: 14, fontFamily: "Inter Tight", fill: "#e8365d" },
      { id: uid(), type: "text", x: 24, y: h - 60, text: "hello@example.com\n+61 400 000 000", fontSize: 12, fontFamily: "Inter Tight", fill: "#ffffff" },
    ];
  }
  if (formatId === "banner") {
    return [
      { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: "#f5f1e8" },
      { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h * 0.18, fill: "#0d1b35" },
      { id: uid(), type: "text", x: w * 0.08, y: h * 0.06, text: "GRAND OPENING", fontSize: Math.round(w * 0.05), fontFamily: "Fraunces", fill: "#ffffff", fontStyle: "bold" },
      { id: uid(), type: "text", x: w * 0.08, y: h * 0.32, text: "Save 30%\nthis weekend", fontSize: Math.round(w * 0.11), fontFamily: "Fraunces", fill: "#0d1b35", fontStyle: "bold" },
      { id: uid(), type: "rect", x: w * 0.08, y: h * 0.72, width: w * 0.45, height: h * 0.06, fill: "#e8365d", cornerRadius: 999 },
      { id: uid(), type: "text", x: w * 0.13, y: h * 0.735, text: "Visit us today", fontSize: Math.round(w * 0.035), fontFamily: "Inter Tight", fill: "#ffffff", fontStyle: "bold" },
    ];
  }
  // Default poster / flyer template
  const titleSize = Math.round(w * 0.13);
  return [
    { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h, fill: "#f5f1e8" },
    { id: uid(), type: "rect", x: 0, y: 0, width: w, height: h * 0.55, fill: "#0d1b35" },
    { id: uid(), type: "text", x: w * 0.08, y: h * 0.08, text: "EVENT 2026", fontSize: Math.round(w * 0.04), fontFamily: "Inter Tight", fill: "#e8365d", fontStyle: "bold" },
    { id: uid(), type: "text", x: w * 0.08, y: h * 0.16, text: "Your Big\nHeadline\nHere.", fontSize: titleSize, fontFamily: "Fraunces", fill: "#ffffff", fontStyle: "bold", width: w * 0.84 },
    { id: uid(), type: "text", x: w * 0.08, y: h * 0.62, text: "Sat 14 March · 7pm\nSydney Town Hall", fontSize: Math.round(w * 0.04), fontFamily: "Inter Tight", fill: "#0d1b35" },
    { id: uid(), type: "rect", x: w * 0.08, y: h * 0.82, width: w * 0.45, height: h * 0.07, fill: "#e8365d", cornerRadius: 999 },
    { id: uid(), type: "text", x: w * 0.14, y: h * 0.835, text: "Get Tickets", fontSize: Math.round(w * 0.04), fontFamily: "Inter Tight", fill: "#ffffff", fontStyle: "bold" },
  ];
}

function DesignerPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [formatId, setFormatId] = useState<string>("poster-a3");
  const format = FORMATS.find((f) => f.id === formatId)!;

  // Canvas pixel size — capped, preserving aspect ratio from mm
  const CANVAS = useMemo(() => {
    const maxLong = 720;
    const ratio = format.widthMm / format.heightMm;
    if (format.heightMm >= format.widthMm) {
      const h = maxLong;
      return { w: Math.round(h * ratio), h };
    }
    const w = maxLong;
    return { w, h: Math.round(w / ratio) };
  }, [format]);

  const [elements, setElements] = useState<DesignElement[]>(() => templateFor("poster-a3", 720 * (297 / 420), 720));
  const [bgColor, setBgColor] = useState("#f5f1e8");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<DesignElement[][]>([]);
  const [future, setFuture] = useState<DesignElement[][]>([]);
  const [exporting, setExporting] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = elements.find((e) => e.id === selectedId) ?? null;

  // ---- mutators with history ----
  const commit = (next: DesignElement[]) => {
    setHistory((h) => [...h.slice(-49), elements]);
    setFuture([]);
    setElements(next);
  };
  const updateEl = (el: DesignElement) => commit(elements.map((e) => (e.id === el.id ? el : e)));
  const addEl = (el: DesignElement) => {
    commit([...elements, el]);
    setSelectedId(el.id);
  };
  const removeSelected = () => {
    if (!selectedId) return;
    commit(elements.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  };
  const move = (dir: "up" | "down") => {
    if (!selectedId) return;
    const idx = elements.findIndex((e) => e.id === selectedId);
    if (idx < 0) return;
    const next = [...elements];
    const swap = dir === "up" ? Math.min(elements.length - 1, idx + 1) : Math.max(0, idx - 1);
    [next[idx], next[swap]] = [next[swap], next[idx]];
    commit(next);
  };
  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [elements, ...f].slice(0, 50));
    setElements(prev);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, elements]);
    setElements(next);
  };

  // Reload template when format changes
  const applyFormat = (id: string) => {
    const f = FORMATS.find((x) => x.id === id)!;
    const maxLong = 720;
    const ratio = f.widthMm / f.heightMm;
    const w = f.heightMm >= f.widthMm ? Math.round(maxLong * ratio) : maxLong;
    const h = f.heightMm >= f.widthMm ? maxLong : Math.round(maxLong / ratio);
    setFormatId(id);
    setHistory([]);
    setFuture([]);
    setSelectedId(null);
    setElements(templateFor(id, w, h));
    setBgColor("#f5f1e8");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          e.preventDefault();
          removeSelected();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, future, elements, selectedId]);

  // ---- toolbox actions ----
  const addText = () =>
    addEl({
      id: uid(),
      type: "text",
      x: CANVAS.w / 2 - 100,
      y: CANVAS.h / 2 - 20,
      text: "Double-click to edit",
      fontSize: 32,
      fontFamily: "Inter Tight",
      fill: "#0d1b35",
    });
  const addRect = () =>
    addEl({ id: uid(), type: "rect", x: CANVAS.w / 2 - 80, y: CANVAS.h / 2 - 50, width: 160, height: 100, fill: "#e8365d" });
  const addCircle = () =>
    addEl({ id: uid(), type: "circle", x: CANVAS.w / 2, y: CANVAS.h / 2, radius: 60, fill: "#0d1b35" });
  const addLine = () =>
    addEl({ id: uid(), type: "line", x: CANVAS.w / 2 - 80, y: CANVAS.h / 2, points: [0, 0, 160, 0], stroke: "#0d1b35", strokeWidth: 4 });

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const img = new window.Image();
      img.onload = () => {
        const max = Math.min(CANVAS.w, CANVAS.h) * 0.6;
        const r = img.width / img.height;
        const w = r >= 1 ? max : max * r;
        const h = r >= 1 ? max / r : max;
        addEl({ id: uid(), type: "image", x: (CANVAS.w - w) / 2, y: (CANVAS.h - h) / 2, width: w, height: h, src });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // ---- export ----
  const exportPNG = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setSelectedId(null);
    setTimeout(() => {
      const url = stage.toDataURL({ pixelRatio: 3 });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${format.label}-design.png`;
      a.click();
    }, 50);
  };

  const exportPDF = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);
    setSelectedId(null);
    try {
      // Wait a tick so transformer clears before export
      await new Promise((r) => setTimeout(r, 60));
      const dataUrl = stage.toDataURL({ pixelRatio: 4 });
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        unit: "mm",
        format: [format.widthMm, format.heightMm],
        orientation: format.widthMm > format.heightMm ? "landscape" : "portrait",
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, format.widthMm, format.heightMm);
      pdf.save(`${format.label}-print-ready.pdf`);
      toast.success("PDF exported — print-ready at actual size!");
    } catch (e) {
      console.error(e);
      toast.error("PDF export failed.");
    } finally {
      setExporting(false);
    }
  };

  // ---- order this design ----
  const orderDesign = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);
    setSelectedId(null);
    try {
      await new Promise((r) => setTimeout(r, 60));
      const dataUrl = stage.toDataURL({ pixelRatio: 3 });
      const blob = await (await fetch(dataUrl)).blob();
      const path = `designs/${crypto.randomUUID()}.png`;
      const { error } = await supabase.storage.from("poster-uploads").upload(path, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/png",
      });
      if (error) throw error;
      const { data } = supabase.storage.from("poster-uploads").getPublicUrl(path);

      const product = products.find((p) => p.id === format.productId) ?? products[0];
      const item: CartItem = {
        id: "",
        product,
        size: `${format.label} (${format.widthMm}×${format.heightMm}mm) — Custom design`,
        paperType: "Premium 130gsm Gloss",
        quantity: 100,
        doubleSided: false,
        express: false,
        fileName: `${format.label}-design.png`,
        notes: `Custom design from in-browser editor: ${data.publicUrl}`,
        subtotal: product.startingPrice,
        gst: Math.round(product.startingPrice * 0.1 * 100) / 100,
        delivery: 12.5,
        total: Math.round((product.startingPrice * 1.1 + 12.5) * 100) / 100,
      };
      addItem(item);
      toast.success("Design saved — added to cart!");
      navigate({ to: "/cart" });
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save your design. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Top bar */}
      <header className="border-b border-border bg-card sticky top-16 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-xl font-bold text-foreground mr-2">Designer</h1>
          <select
            value={formatId}
            onChange={(e) => applyFormat(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} — {f.widthMm}×{f.heightMm}mm
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!history.length} title="Undo (⌘Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!future.length} title="Redo (⌘⇧Z)">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportPNG}>
              <Download className="h-4 w-4" /> PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} PDF
            </Button>
            <Button variant="cta" size="sm" onClick={orderDesign} disabled={exporting}>
              <ShoppingCart className="h-4 w-4" /> Order this design
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Left toolbox */}
        <aside className="col-span-12 lg:col-span-2 space-y-2">
          <div className="bg-card border border-border rounded-xl p-3 grid grid-cols-3 lg:grid-cols-2 gap-2">
            <ToolBtn icon={<Type className="h-4 w-4" />} label="Text" onClick={addText} />
            <ToolBtn icon={<Square className="h-4 w-4" />} label="Rect" onClick={addRect} />
            <ToolBtn icon={<CircleIcon className="h-4 w-4" />} label="Circle" onClick={addCircle} />
            <ToolBtn icon={<Minus className="h-4 w-4" />} label="Line" onClick={addLine} />
            <ToolBtn icon={<ImageIcon className="h-4 w-4" />} label="Image" onClick={() => fileRef.current?.click()} />
            <ToolBtn icon={<Trash2 className="h-4 w-4" />} label="Delete" onClick={removeSelected} disabled={!selectedId} />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageFile(f);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Background</Label>
            <Swatches value={bgColor} onChange={setBgColor} />
          </div>
        </aside>

        {/* Canvas */}
        <main className="col-span-12 lg:col-span-7">
          <div className="bg-[#e9e6df] rounded-xl border border-border p-6 flex items-center justify-center min-h-[600px]">
            <div className="bg-white shadow-2xl" style={{ width: CANVAS.w, height: CANVAS.h }}>
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
                <DesignerCanvas
                  width={CANVAS.w}
                  height={CANVAS.h}
                  bgColor={bgColor}
                  elements={elements}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onChange={updateEl}
                  stageRef={stageRef}
                />
              </Suspense>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono text-center">
            {format.label} · {format.widthMm}×{format.heightMm}mm · Click an item to edit · Delete to remove · ⌘Z to undo
          </p>
        </main>

        {/* Right panel — properties + layers */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-card border border-border rounded-xl p-3">
            <h3 className="font-heading font-semibold text-sm mb-3">Properties</h3>
            {!selected && <p className="text-xs text-muted-foreground">Select an item on the canvas to edit it.</p>}
            {selected && (
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => move("up")} title="Bring forward">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => move("down")} title="Send back">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={removeSelected} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {selected.type === "text" && (
                  <>
                    <div>
                      <Label className="text-xs">Text</Label>
                      <textarea
                        rows={3}
                        value={selected.text}
                        onChange={(e) => updateEl({ ...selected, text: e.target.value })}
                        className="w-full mt-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Font</Label>
                        <select
                          value={selected.fontFamily}
                          onChange={(e) => updateEl({ ...selected, fontFamily: e.target.value })}
                          className="w-full mt-1 h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          {FONTS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Size</Label>
                        <Input
                          type="number"
                          min={8}
                          max={400}
                          value={selected.fontSize}
                          onChange={(e) => updateEl({ ...selected, fontSize: Number(e.target.value) || 12 })}
                          className="mt-1 h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant={selected.fontStyle?.includes("bold") ? "default" : "outline"} size="icon" onClick={() => updateEl({ ...selected, fontStyle: selected.fontStyle?.includes("bold") ? (selected.fontStyle.includes("italic") ? "italic" : "normal") : (selected.fontStyle?.includes("italic") ? "bold italic" : "bold") })}>
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant={selected.fontStyle?.includes("italic") ? "default" : "outline"} size="icon" onClick={() => updateEl({ ...selected, fontStyle: selected.fontStyle?.includes("italic") ? (selected.fontStyle.includes("bold") ? "bold" : "normal") : (selected.fontStyle?.includes("bold") ? "bold italic" : "italic") })}>
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button variant={selected.align === "left" ? "default" : "outline"} size="icon" onClick={() => updateEl({ ...selected, align: "left" })}>
                        <AlignLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant={selected.align === "center" ? "default" : "outline"} size="icon" onClick={() => updateEl({ ...selected, align: "center" })}>
                        <AlignCenter className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant={selected.align === "right" ? "default" : "outline"} size="icon" onClick={() => updateEl({ ...selected, align: "right" })}>
                        <AlignRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <Swatches value={selected.fill} onChange={(c) => updateEl({ ...selected, fill: c })} />
                    </div>
                  </>
                )}

                {(selected.type === "rect" || selected.type === "circle") && (
                  <div>
                    <Label className="text-xs">Fill</Label>
                    <Swatches value={selected.fill} onChange={(c) => updateEl({ ...selected, fill: c })} />
                  </div>
                )}

                {selected.type === "line" && (
                  <>
                    <div>
                      <Label className="text-xs">Stroke</Label>
                      <Swatches value={selected.stroke} onChange={(c) => updateEl({ ...selected, stroke: c })} />
                    </div>
                    <div>
                      <Label className="text-xs">Thickness</Label>
                      <Input
                        type="number"
                        min={1}
                        max={40}
                        value={selected.strokeWidth}
                        onChange={(e) => updateEl({ ...selected, strokeWidth: Number(e.target.value) || 1 })}
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Layers */}
          <div className="bg-card border border-border rounded-xl p-3">
            <h3 className="font-heading font-semibold text-sm mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4" /> Layers
            </h3>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {[...elements].reverse().map((el) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full text-left text-xs px-2 py-1.5 rounded-md border ${
                    selectedId === el.id ? "border-cta bg-cta/10 text-cta" : "border-border bg-background hover:border-cta/40"
                  }`}
                >
                  {el.type === "text" ? `T · ${(el as { text: string }).text.slice(0, 22)}` : el.type === "image" ? "🖼 Image" : `${el.type[0].toUpperCase()} · ${el.type}`}
                </button>
              ))}
              {!elements.length && <p className="text-xs text-muted-foreground">No layers yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 px-2 py-2 rounded-md border border-border bg-background hover:border-cta/40 hover:text-cta transition-colors text-[11px] disabled:opacity-40"
    >
      {icon}
      {label}
    </button>
  );
}

function Swatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-1.5">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`h-6 rounded-md border ${value.toLowerCase() === c ? "ring-2 ring-cta" : "border-border"}`}
            style={{ background: c }}
            aria-label={c}
          />
        ))}
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-7 rounded cursor-pointer"
      />
    </div>
  );
}
