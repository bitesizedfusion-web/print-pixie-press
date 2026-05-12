import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Check,
  ShoppingCart,
  Trash2,
  Eye,
  Frame,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCart, type CartItem } from "@/lib/cart";
import { products } from "@/lib/pricing";
import { toast } from "sonner";
import wallMockup from "@/assets/wall-mockup.jpg";
import { ARCameraView } from "@/components/ARCameraView";

export const Route = createFileRoute("/poster-designer")({
  head: () => ({
    meta: [
      { title: "Design Your Own Poster — Upload, Preview & Order | PrintHub" },
      {
        name: "description",
        content:
          "Upload your image, choose a poster size (A4, A3, A2, A1), see a live preview and order in minutes. Australia-wide delivery.",
      },
    ],
  }),
  component: PosterDesignerPage,
});

// Poster sizes — width x height in mm. Display ratio drives the preview canvas.
type PosterSize = {
  id: string;
  label: string;
  dims: string; // human-readable
  widthMm: number;
  heightMm: number;
  basePrice: number; // single poster price (AUD)
};

const POSTER_SIZES: PosterSize[] = [
  { id: "A4", label: "A4", dims: "210 × 297 mm", widthMm: 210, heightMm: 297, basePrice: 12 },
  { id: "A3", label: "A3", dims: "297 × 420 mm", widthMm: 297, heightMm: 420, basePrice: 22 },
  { id: "A2", label: "A2", dims: "420 × 594 mm", widthMm: 420, heightMm: 594, basePrice: 39 },
  { id: "A1", label: "A1", dims: "594 × 841 mm", widthMm: 594, heightMm: 841, basePrice: 65 },
];

const PAPER_FINISHES = [
  { id: "matte", label: "Matte 170gsm", multiplier: 1 },
  { id: "gloss", label: "Gloss 200gsm", multiplier: 1.15 },
  { id: "premium", label: "Premium 250gsm Satin", multiplier: 1.35 },
];

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function PosterDesignerPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const [sizeId, setSizeId] = useState<string>("A3");
  const [finishId, setFinishId] = useState<string>("matte");
  const [quantity, setQuantity] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<"flat" | "wall">("flat");
  const [arOpen, setArOpen] = useState(false);

  const selectedSize = useMemo(
    () => POSTER_SIZES.find((s) => s.id === sizeId) ?? POSTER_SIZES[1],
    [sizeId],
  );
  const selectedFinish = useMemo(
    () => PAPER_FINISHES.find((f) => f.id === finishId) ?? PAPER_FINISHES[0],
    [finishId],
  );

  const pricing = useMemo(() => {
    const unit = selectedSize.basePrice * selectedFinish.multiplier;
    const subtotal = Math.round(unit * quantity * 100) / 100;
    const gst = Math.round(subtotal * 0.1 * 100) / 100;
    const delivery = 12.5;
    const total = Math.round((subtotal + gst + delivery) * 100) / 100;
    return { unit: Math.round(unit * 100) / 100, subtotal, gst, delivery, total };
  }, [selectedSize, selectedFinish, quantity]);

  // Compute preview canvas dimensions: cap longest side at 420px, keep aspect ratio.
  const previewBox = useMemo(() => {
    const maxLong = 420;
    const maxShort = 320;
    const ratio = selectedSize.widthMm / selectedSize.heightMm; // portrait < 1
    let w: number;
    let h: number;
    if (selectedSize.heightMm >= selectedSize.widthMm) {
      h = maxLong;
      w = Math.round(h * ratio);
      if (w > maxShort) {
        w = maxShort;
        h = Math.round(w / ratio);
      }
    } else {
      w = maxLong;
      h = Math.round(w / ratio);
    }
    return { w, h };
  }, [selectedSize]);

  // Wall-mockup preview: poster scales relative to the wall scene so A4 looks small and A1 looks large.
  // Reference: A1 (largest) takes ~58% of wall height; A4 (smallest) takes ~22%.
  const wallPosterSize = useMemo(() => {
    const wallW = 520; // visible wall area width (px) in our render
    const wallH = 360;
    const sizeScale: Record<string, number> = { A4: 0.28, A3: 0.4, A2: 0.55, A1: 0.72 };
    const scale = sizeScale[selectedSize.id] ?? 0.4;
    const ratio = selectedSize.widthMm / selectedSize.heightMm;
    let h = Math.round(wallH * scale);
    let w = Math.round(h * ratio);
    if (w > wallW * 0.7) {
      w = Math.round(wallW * 0.7);
      h = Math.round(w / ratio);
    }
    return { w, h };
  }, [selectedSize]);

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large. Maximum size is 10 MB.");
      return;
    }

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setFileName(file.name);
    setUploading(true);
    setUploadedUrl(null);
    setUploadedPath(null);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("poster-uploads").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("poster-uploads").getPublicUrl(path);
      setUploadedUrl(data.publicUrl);
      setUploadedPath(path);
      toast.success("Image uploaded — ready to order!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Please try again.");
      setPreviewUrl(null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setUploadedPath(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddToCart = () => {
    if (!uploadedUrl) {
      toast.error("Please upload your poster image first.");
      return;
    }
    const posterProduct = products.find((p) => p.id === "posters") ?? products[0];
    const item: CartItem = {
      id: "",
      product: posterProduct,
      size: `${selectedSize.label} (${selectedSize.dims}) — Custom`,
      paperType: selectedFinish.label,
      quantity,
      doubleSided: false,
      express: false,
      fileName: fileName || uploadedPath || "custom-poster",
      notes: `Custom poster artwork: ${uploadedUrl}`,
      subtotal: pricing.subtotal,
      gst: pricing.gst,
      delivery: pricing.delivery,
      total: pricing.total,
    };
    addItem(item);
    toast.success("Added to cart!");
    navigate({ to: "/cart" });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-hero-bg text-hero-foreground hero-pattern py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold">
              Design Your <span className="text-cta">Custom Poster</span>
            </h1>
            <p className="mt-4 text-lg text-hero-foreground/70 max-w-2xl mx-auto">
              Upload your image, pick a size, see a live preview, and order. We print, you receive.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT — preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-foreground">Live Preview</h2>
                <div className="inline-flex rounded-lg border border-border overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("flat")}
                    className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                      previewMode === "flat"
                        ? "bg-cta text-cta-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Frame className="h-3.5 w-3.5" /> Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("wall")}
                    className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                      previewMode === "wall"
                        ? "bg-cta text-cta-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" /> Wall Mockup
                  </button>
                  <button
                    type="button"
                    onClick={() => setArOpen(true)}
                    className="px-3 py-1.5 flex items-center gap-1.5 transition-colors bg-gradient-cta text-cta-foreground hover:opacity-90"
                  >
                    <Camera className="h-3.5 w-3.5" /> AR Camera
                  </button>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[520px]">
                {previewUrl && previewMode === "flat" ? (
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      key={`${sizeId}-${previewUrl}`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow-2xl border border-border overflow-hidden"
                      style={{ width: `${previewBox.w}px`, height: `${previewBox.h}px` }}
                    >
                      <img
                        src={previewUrl}
                        alt="Your poster preview"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedSize.label} • {selectedSize.dims}
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <Trash2 className="h-4 w-4" /> Remove image
                    </Button>
                  </div>
                ) : previewUrl && previewMode === "wall" ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="relative w-full max-w-[520px] aspect-[1280/896] rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={wallMockup}
                        alt="Wall mockup"
                        loading="lazy"
                        width={1280}
                        height={896}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <motion.div
                        key={`${sizeId}-wall`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl border-[3px] border-white"
                        style={{
                          width: `${(wallPosterSize.w / 520) * 100}%`,
                          aspectRatio: `${selectedSize.widthMm} / ${selectedSize.heightMm}`,
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt="Your poster on a wall"
                          className="w-full h-full object-cover"
                        />
                        {/* subtle frame shadow */}
                        <div className="absolute -inset-px shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] pointer-events-none" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedSize.label} • {selectedSize.dims} on a typical living room wall
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      <Trash2 className="h-4 w-4" /> Remove image
                    </Button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center text-center gap-3"
                    style={{ width: `${previewBox.w}px`, height: `${previewBox.h}px` }}
                  >
                    <div className="w-full h-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-background/50">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground px-6">
                        Upload your image to see it as{" "}
                        {previewMode === "wall" ? "a wall mockup" : "a poster"}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                        {selectedSize.label} • {selectedSize.dims}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — controls */}
            <div className="space-y-6">
              {/* Upload */}
              <div>
                <h2 className="font-heading text-xl font-bold mb-3 text-foreground">
                  1. Upload your image
                </h2>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="bg-card border-2 border-dashed border-border hover:border-cta/50 rounded-xl p-6 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                    }}
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cta/10 flex items-center justify-center shrink-0">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 text-cta animate-spin" />
                      ) : uploadedUrl ? (
                        <Check className="h-5 w-5 text-cta" />
                      ) : (
                        <Upload className="h-5 w-5 text-cta" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">
                        {uploading
                          ? "Uploading..."
                          : uploadedUrl
                            ? fileName
                            : "Click or drop your image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        JPG, PNG or WEBP — up to 10 MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <h2 className="font-heading text-xl font-bold mb-3 text-foreground">
                  2. Choose poster size
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {POSTER_SIZES.map((s) => {
                    const active = s.id === sizeId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          active
                            ? "border-cta bg-cta/5 shadow-cta"
                            : "border-border bg-card hover:border-cta/40"
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-heading font-bold text-lg text-foreground">
                            {s.label}
                          </span>
                          <span className="font-mono text-sm text-cta font-semibold">
                            ${s.basePrice}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.dims}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish */}
              <div>
                <h2 className="font-heading text-xl font-bold mb-3 text-foreground">
                  3. Paper finish
                </h2>
                <div className="space-y-2">
                  {PAPER_FINISHES.map((f) => {
                    const active = f.id === finishId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFinishId(f.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                          active
                            ? "border-cta bg-cta/5"
                            : "border-border bg-card hover:border-cta/40"
                        }`}
                      >
                        <span className="text-sm font-medium text-foreground">{f.label}</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          ×{f.multiplier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Label
                  htmlFor="qty"
                  className="font-heading text-xl font-bold mb-3 block text-foreground"
                >
                  4. Quantity
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
                  }
                  className="max-w-[160px]"
                />
              </div>

              {/* Pricing */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit price</span>
                  <span className="font-mono">${pricing.unit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({quantity} × poster)</span>
                  <span className="font-mono">${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (10%)</span>
                  <span className="font-mono">${pricing.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-mono">${pricing.delivery.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-foreground">Total</span>
                  <span className="font-mono font-bold text-2xl text-cta">
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="cta"
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!uploadedUrl || uploading}
              >
                <ShoppingCart className="h-5 w-5" />
                {uploading ? "Uploading..." : "Add to Cart"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Need a different size or have questions?{" "}
                <Link to="/contact" className="text-cta font-semibold hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <ARCameraView
        open={arOpen}
        onClose={() => setArOpen(false)}
        imageUrl={previewUrl}
        aspectRatio={selectedSize.widthMm / selectedSize.heightMm}
        sizeLabel={`${selectedSize.label} • ${selectedSize.dims}`}
      />
    </div>
  );
}
