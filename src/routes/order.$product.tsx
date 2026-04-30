import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products, paperTypes, quantities, calculatePrice } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { ArtworkUpload, emptyArtwork, type ArtworkResult } from "@/components/ArtworkUpload";
import { ARCameraView } from "@/components/ARCameraView";
import {
  CheckCircle, ShieldCheck, Package, FileCheck, ShoppingCart,
  Info, HelpCircle, ChevronDown, ChevronLeft, ChevronRight, Truck,
  Calendar, Sparkles, RotateCcw, MessageCircle, Phone, AlertTriangle, Camera,
} from "lucide-react";

export const Route = createFileRoute("/order/$product")({
  head: ({ params }) => {
    const product = products.find(p => p.id === params.product);
    const title = product ? `${product.name} Printing — Instant Quote | PrintHub Australia` : "Configure Your Order — PrintHub Australia";
    const description = product
      ? `Print custom ${product.name.toLowerCase()} online. Instant quote calculator, premium paper stocks, fast Australia-wide delivery.`
      : "Configure size, quantity, paper, upload artwork — get your instant printing quote.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(product ? [{ property: "og:image", content: product.image }, { name: "twitter:image", content: product.image }] : []),
      ],
    };
  },
  component: OrderPage,
});

const faqs = [
  { q: "How do I start an order?", a: "Configure your specifications using the Instant Quote Calculator on the right, click Add to Cart, then upload your artwork files in the next step. You can place orders without an account, but signing up earns rewards on every order." },
  { q: "How do I design my files?", a: "You can use Adobe Photoshop, InDesign, Illustrator, Canva, or Affinity Publisher. Download our free PDF templates from the calculator to ensure your artwork is print-ready." },
  { q: "What is bleed, and why do I need it?", a: "Bleed is a 3mm extension of artwork beyond the trim edge that prevents unprinted white edges when we cut your prints. Most items require 3mm bleed on every side." },
  { q: "Which file types can I upload?", a: "PDF, AI, PSD, JPG, PNG, TIFF and more. We recommend print-ready PDFs at 300 DPI in CMYK colour mode for best results." },
  { q: "When can I expect my order?", a: "Standard turnaround is 3–5 business days. Express turnaround is 1–2 business days for an additional 30%. Cut-off for confirmed orders is 4pm AEST every workday." },
  { q: "What is lamination, and why do I need it?", a: "Lamination is a transparent plastic coating that protects, preserves and enhances your prints. It minimises marking, smudging, fading and tearing — choose Gloss, Matt or Soft-Touch." },
];

const quickHelp = [
  "Which paper feels more premium?",
  "How should I prepare my files?",
  "Is there a minimum order?",
  "Ask another question",
];

function OrderPage() {
  const { product: productId } = Route.useParams();
  const product = products.find(p => p.id === productId) || products[0];

  // Configuration state
  const [size, setSize] = useState(product.sizes[0]);
  const [paper, setPaper] = useState("standard");
  const [quantity, setQuantity] = useState(500);
  const [doubleSided, setDoubleSided] = useState(true);
  const [colourMode, setColourMode] = useState<"colour" | "greyscale">("colour");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [finish, setFinish] = useState<"none" | "gloss" | "matt" | "soft">("gloss");
  const [turnaround, setTurnaround] = useState<"standard" | "express">("standard");
  const [artwork, setArtwork] = useState<ArtworkResult>(emptyArtwork());
  const [notes, setNotes] = useState("");

  // UI state
  const [tab, setTab] = useState<"info" | "faq">("info");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeImage, setActiveImage] = useState(0);

  const result = calculatePrice({
    productId: product.id, size, quantity, paperType: paper, doubleSided,
    express: turnaround === "express",
  });

  // Estimated dispatch date
  const dispatchDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (turnaround === "express" ? 2 : 5));
    return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
  }, [turnaround]);

  const resetConfig = () => {
    setSize(product.sizes[0]);
    setPaper("standard");
    setQuantity(500);
    setDoubleSided(true);
    setColourMode("colour");
    setOrientation("portrait");
    setFinish("gloss");
    setTurnaround("standard");
    setArtwork(emptyArtwork());
    setNotes("");
  };

  const fileName = artwork.file?.name ?? "";
  const artworkBlocked = artwork.status === "checking" || artwork.status === "invalid";

  // AR preview — only when uploaded artwork is an image
  const [arOpen, setArOpen] = useState(false);
  const artworkImageUrl = useMemo(() => {
    if (!artwork.file || !artwork.file.type.startsWith("image/")) return null;
    return URL.createObjectURL(artwork.file);
  }, [artwork.file]);

  // Gallery images — reuse product image varied
  const gallery = [product.image, product.image, product.image, product.image];

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-muted-foreground flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-cta transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-cta transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* === TOP: Hero (left) + Calculator (right) === */}
          <div className="grid lg:grid-cols-12 gap-8">

            {/* LEFT — Product showcase + Info/FAQ */}
            <div className="lg:col-span-7 space-y-8">
              {/* Title + Tabs */}
              <div>
                <p className="text-sm font-mono uppercase tracking-wider text-cta mb-2">{product.category}</p>
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                  {product.name} <span className="text-gradient">Printing</span>
                </h1>

                {/* Info / FAQ Tabs */}
                <div className="mt-6 flex gap-2">
                  {([
                    ["info", "Info", Info],
                    ["faq", "FAQ", HelpCircle],
                  ] as const).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                        tab === id
                          ? "bg-cta text-cta-foreground border-cta shadow-cta"
                          : "bg-card border-border text-foreground hover:border-cta/40 hover:text-cta"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {tab === "info" ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5"
                    >
                      <p className="text-foreground/80 leading-relaxed">
                        Print custom {product.name.toLowerCase()} online with PrintHub Australia. Our clever Instant Quote Calculator only displays the best options for your prints — saving you time and money. Premium paper stocks, professional finishes, and Australia-wide delivery on every order.
                      </p>

                      {/* Quick Help */}
                      <div className="mt-6 bg-gradient-to-br from-accent/40 to-card border border-border rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-cta" />
                          <h3 className="font-heading font-bold text-foreground">Quick Help</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2.5">
                          {quickHelp.map((q, i) => (
                            <button
                              key={q}
                              onClick={() => setTab("faq")}
                              className={`text-left text-sm px-4 py-3 rounded-xl border transition-all hover:-translate-y-0.5 ${
                                i === quickHelp.length - 1
                                  ? "bg-gradient-cta text-cta-foreground border-transparent shadow-cta hover:shadow-cta-hover"
                                  : "bg-card border-border text-foreground hover:border-cta/40"
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="faq"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 space-y-2"
                    >
                      {faqs.map((f, i) => (
                        <div key={f.q} className="bg-card border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/30 transition-colors"
                          >
                            <span className="font-medium text-foreground text-sm">{f.q}</span>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image gallery */}
              <div className="rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-accent/20 to-card relative group">
                <div className="aspect-[4/3] relative">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={gallery[activeImage]}
                      alt={`${product.name} preview ${activeImage + 1}`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Arrows */}
                  <button
                    onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((activeImage + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 glass-dark text-white text-xs font-mono px-3 py-1.5 rounded-full">
                    {activeImage + 1} / {gallery.length}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 p-3 bg-card/50 border-t border-border">
                  {gallery.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? "border-cta shadow-cta" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={g} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Truck, label: "Free Shipping", note: "Orders over $99" },
                  { icon: ShieldCheck, label: "Print Guarantee", note: "100% satisfaction" },
                  { icon: FileCheck, label: "Free File Check", note: "Pre-press review" },
                  { icon: Phone, label: "Expert Support", note: "1300 555 123" },
                ].map(t => (
                  <div key={t.label} className="bg-card border border-border rounded-xl p-3 text-center hover:border-cta/40 transition-colors">
                    <t.icon className="h-5 w-5 text-cta mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-foreground">{t.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Instant Quote Calculator (Mixam-style stepped) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-hero text-hero-foreground p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-hero-foreground/60">Instant Quote Calculator</p>
                      <h2 className="font-heading text-xl font-bold mt-1">Create your {product.name}</h2>
                    </div>
                    <button
                      onClick={resetConfig}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass-dark text-white hover:bg-white/10 transition-colors"
                      title="Reset all options"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                  </div>

                  <div className="p-5 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">
                    <Step n={1} label="Quantity">
                      <div className="grid grid-cols-4 gap-2">
                        {quantities.map(q => (
                          <button key={q} onClick={() => setQuantity(q)}
                            className={chipCls(quantity === q)}>{q}</button>
                        ))}
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                        className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-mono focus:ring-2 focus:ring-cta/40 focus:border-cta outline-none"
                      />
                    </Step>

                    <Step n={2} label="Colour Printing">
                      <div className="grid grid-cols-2 gap-2">
                        {([["colour", "Full Colour"], ["greyscale", "Greyscale"]] as const).map(([id, label]) => (
                          <button key={id} onClick={() => setColourMode(id)} className={chipCls(colourMode === id)}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </Step>

                    <Step n={3} label="Orientation">
                      <div className="grid grid-cols-2 gap-2">
                        {([["portrait", "Portrait"], ["landscape", "Landscape"]] as const).map(([id, label]) => (
                          <button key={id} onClick={() => setOrientation(id)} className={chipCls(orientation === id)}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </Step>

                    <Step n={4} label="Size">
                      <div className="grid grid-cols-3 gap-2">
                        {product.sizes.map(s => (
                          <button key={s} onClick={() => setSize(s)} className={chipCls(size === s)}>{s}</button>
                        ))}
                      </div>
                    </Step>

                    <Step n={5} label="Paper Type">
                      <div className="space-y-1.5">
                        {paperTypes.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setPaper(p.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                              paper === p.id
                                ? "border-cta bg-cta/10 text-cta"
                                : "border-input bg-background text-foreground hover:border-cta/40"
                            }`}
                          >
                            <span>{p.name}</span>
                            {p.multiplier > 1 && (
                              <span className="text-[10px] font-mono opacity-70">+{Math.round((p.multiplier - 1) * 100)}%</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </Step>

                    <Step n={6} label="Print Sides">
                      <div className="grid grid-cols-2 gap-2">
                        {([[false, "Single Sided"], [true, "Double Sided"]] as const).map(([ds, label]) => (
                          <button key={String(ds)} onClick={() => setDoubleSided(ds)} className={chipCls(doubleSided === ds)}>
                            {label}{ds ? <span className="text-[10px] opacity-70 ml-1">+20%</span> : null}
                          </button>
                        ))}
                      </div>
                    </Step>

                    <Step n={7} label="Cover Finish">
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          ["none", "None"],
                          ["gloss", "Gloss Lamination"],
                          ["matt", "Matt Lamination"],
                          ["soft", "Soft-Touch"],
                        ] as const).map(([id, label]) => (
                          <button key={id} onClick={() => setFinish(id)} className={chipCls(finish === id)}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </Step>

                    <Step n={8} label="Turnaround & Dispatch">
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          ["standard", "Standard 3–5 days"],
                          ["express", "Express 1–2 days"],
                        ] as const).map(([id, label]) => (
                          <button key={id} onClick={() => setTurnaround(id)} className={chipCls(turnaround === id)}>
                            {label}{id === "express" ? <span className="text-[10px] opacity-70 ml-1">+30%</span> : null}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs bg-success/10 text-success px-3 py-2 rounded-lg">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Estimated dispatch: <strong>{dispatchDate}</strong></span>
                      </div>
                    </Step>

                    <Step n={9} label="Upload Artwork">
                      <ArtworkUpload value={artwork} onChange={setArtwork} />
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Design notes (optional)..."
                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-cta/40 focus:border-cta outline-none resize-none"
                      />
                    </Step>

                    {/* Price summary */}
                    <div className="bg-gradient-to-br from-accent/40 to-card border border-border rounded-2xl p-4">
                      <div className="space-y-1.5 text-xs">
                        <Row label="Subtotal" value={`$${result.subtotal.toFixed(2)}`} />
                        <Row label="GST (10%)" value={`$${result.gst.toFixed(2)}`} />
                        <Row label="Delivery" value={`$${result.delivery.toFixed(2)}`} />
                      </div>
                      <div className="border-t border-border mt-3 pt-3 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total inc. GST</p>
                          <p className="font-heading text-3xl font-extrabold text-cta leading-none mt-1">
                            ${result.total.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">AUD</p>
                      </div>
                    </div>

                    {artworkBlocked && (
                      <div className="flex items-start gap-2 text-[11px] text-warning-foreground bg-warning/15 border border-warning/30 rounded-lg px-3 py-2">
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>
                          {artwork.status === "checking"
                            ? "Running pre-flight check on your artwork…"
                            : "Please upload a valid PDF, PNG or JPG before adding to cart."}
                        </span>
                      </div>
                    )}

                    <AddToCartButton
                      product={product}
                      size={size}
                      paperType={paper}
                      quantity={quantity}
                      doubleSided={doubleSided}
                      express={turnaround === "express"}
                      fileName={fileName}
                      notes={notes}
                      result={result}
                      disabled={artworkBlocked}
                    />

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-success" />
                      Secure checkout · Visa · Mastercard · Afterpay · PayPal
                    </div>
                  </div>
                </motion.div>

                {/* Help card */}
                <div className="mt-4 bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cta/10 text-cta flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Need help with your order?</p>
                    <p className="text-xs text-muted-foreground">Chat with a print expert · 1300 555 123</p>
                  </div>
                  <Link to="/contact">
                    <Button size="sm" variant="outline">Chat</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* === BOTTOM: Other products === */}
          <div className="mt-20">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-cta">More from PrintHub</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">Explore other products</h2>
              </div>
              <Link to="/products" className="text-sm font-medium text-cta hover:underline hidden sm:inline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {products.filter(p => p.id !== product.id).map(p => (
                <Link
                  key={p.id}
                  to="/order/$product"
                  params={{ product: p.id }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-cta/40 hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-accent/30">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-[10px] font-mono text-cta mt-1">From ${p.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====== Helpers ====== */

function chipCls(active: boolean) {
  return `h-10 px-3 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center justify-center text-center ${
    active
      ? "border-cta bg-cta/10 text-cta shadow-sm"
      : "border-input bg-background text-foreground hover:border-cta/40"
  }`;
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="h-5 w-5 rounded-full bg-cta/10 text-cta text-[10px] font-bold font-mono flex items-center justify-center">
          {n}
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{label}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

function AddToCartButton({ product, size, paperType, quantity, doubleSided, express, fileName, notes, result, disabled }: {
  product: typeof products[0]; size: string; paperType: string; quantity: number; doubleSided: boolean; express: boolean; fileName: string; notes: string;
  result: { subtotal: number; gst: number; delivery: number; total: number };
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: "",
      product,
      size,
      paperType,
      quantity,
      doubleSided,
      express,
      fileName: fileName || undefined,
      notes: notes || undefined,
      ...result,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Button variant="cta" size="lg" className="w-full text-base" onClick={handleAdd} disabled={added || disabled}>
        {added ? (
          <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Added to Cart!</span>
        ) : (
          <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Add to Cart · ${result.total.toFixed(2)}</span>
        )}
      </Button>
      {added && (
        <Link to="/cart">
          <Button variant="outline" size="sm" className="w-full">View Cart & Checkout →</Button>
        </Link>
      )}
    </div>
  );
}
