import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { products } from "@/lib/pricing";
import { ArrowUpRight, Camera, Upload } from "lucide-react";
import heroImage from "@/assets/hero-printing.jpg";
import { ARCameraView } from "@/components/ARCameraView";
import { VexHero } from "@/components/hero/VexHero";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "S&S Printing and Packaging — Custom printing & packaging made easy" },
      {
        name: "description",
        content:
          "Custom printing and packaging made easy. Flyers, business cards, brochures, paper bags, boxes, labels, stickers and more — premium quality with fast Australia-wide delivery.",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease },
};

const FRAME_SIZES = [
  { id: "a4", label: "A4 Frame", sizeLabel: "A4 • 210 × 297 mm", aspect: 210 / 297 },
  { id: "a3", label: "A3 Poster", sizeLabel: "A3 • 297 × 420 mm", aspect: 297 / 420 },
  { id: "a2", label: "A2 Poster", sizeLabel: "A2 • 420 × 594 mm", aspect: 420 / 594 },
  { id: "square", label: "Square Print", sizeLabel: "Square • 500 × 500 mm", aspect: 1 },
  { id: "landscape", label: "Landscape", sizeLabel: "Landscape • 16:9", aspect: 16 / 9 },
] as const;

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const [arOpen, setArOpen] = useState(false);
  const [arPickerOpen, setArPickerOpen] = useState(false);
  const [arImageUrl, setArImageUrl] = useState<string | null>(null);
  const [arFrame, setArFrame] = useState<(typeof FRAME_SIZES)[number]>(FRAME_SIZES[1]);

  const handleArUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setArImageUrl(url);
    setArPickerOpen(false);
    setArOpen(true);
  };

  const handleArSample = () => {
    setArImageUrl(heroImage);
    setArPickerOpen(false);
    setArOpen(true);
  };

  return (
    <div className="overflow-x-clip bg-background">
      {/* ============== HERO — VEX-style with bg video ============== */}
      <VexHero />

      {/* ============== AR FRAME PICKER MODAL ============== */}
      {arPickerOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setArPickerOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-cta" />
              <h3 className="font-heading text-2xl font-light tracking-tight text-foreground">
                See it on your wall
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Pick a frame size, then point your camera at the wall to preview before ordering.
            </p>

            <div className="mb-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
                Frame size
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FRAME_SIZES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setArFrame(f)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      arFrame.id === f.id
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-cta text-cta-foreground text-sm font-semibold hover:bg-cta-hover transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload your artwork
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleArUpload(file);
                  }}
                />
              </label>
              <button
                onClick={handleArSample}
                className="w-full h-12 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Try with a sample image
              </button>
              <button
                onClick={() => setArPickerOpen(false)}
                className="w-full h-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ARCameraView
        open={arOpen}
        onClose={() => setArOpen(false)}
        imageUrl={arImageUrl}
        aspectRatio={arFrame.aspect}
        sizeLabel={arFrame.sizeLabel}
      />

      {/* ============== INDEX — quiet stats ============== */}
      <section className="border-t border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {[
              { kpi: "10K+", label: "Brands served", note: "Since 2015" },
              { kpi: "1.2M", label: "Items printed", note: "Per month" },
              { kpi: "4.9", label: "Avg. rating", note: "Trustpilot" },
              { kpi: "24h", label: "Turnaround", note: "Express tier" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.7, ease, delay: i * 0.06 }}
              >
                <div className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-light tracking-[-0.04em] leading-none text-foreground">
                  {s.kpi}
                </div>
                <div className="mt-4 text-sm text-foreground">{s.label}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.note}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CATALOGUE — minimal grid ============== */}
      <section className="border-t border-border bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            {...fadeUp}
            className="flex items-end justify-between mb-16 lg:mb-20"
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
                Index — Catalogue
              </div>
              <h2 className="font-heading text-[clamp(2.25rem,5vw,4.25rem)] font-light tracking-[-0.04em] leading-[1.02] text-foreground max-w-2xl">
                Six things we print
                <br />
                <span className="italic text-muted-foreground">
                  exceptionally well.
                </span>
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground transition-colors"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-20">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                {...fadeUp}
                transition={{ duration: 0.7, ease, delay: i * 0.05 }}
              >
                <Link
                  to="/order/$product"
                  params={{ product: p.id }}
                  className="group block"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted mb-5">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                    />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        № {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-2 font-heading text-2xl font-light tracking-[-0.02em] text-foreground">
                        {p.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        From
                      </div>
                      <div className="font-heading text-xl font-light text-foreground mt-1">
                        ${p.startingPrice}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PROCESS — editorial list ============== */}
      <section className="border-t border-border bg-secondary py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-20 max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Process — Four steps
            </div>
            <h2 className="font-heading text-[clamp(2.25rem,5vw,4.25rem)] font-light tracking-[-0.04em] leading-[1.02] text-foreground">
              From your idea
              <br />
              <span className="italic text-muted-foreground">
                to your doorstep.
              </span>
            </h2>
          </motion.div>

          <div className="space-y-px bg-border rounded-xl overflow-hidden border border-border">
            {[
              {
                num: "01",
                title: "Choose",
                desc: "Select from our catalogue of premium products and finishes.",
              },
              {
                num: "02",
                title: "Upload",
                desc: "Drop your artwork — we'll review it for press readiness, free.",
              },
              {
                num: "03",
                title: "Approve",
                desc: "Receive a digital proof. Sign off when you're happy.",
              },
              {
                num: "04",
                title: "Receive",
                desc: "Tracked, carbon-neutral shipping anywhere in Australia.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.num}
                {...fadeUp}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                className="bg-background grid grid-cols-12 items-baseline gap-6 px-6 sm:px-10 py-10 lg:py-14 hover:bg-muted/40 transition-colors"
              >
                <div className="col-span-2 lg:col-span-1 font-mono text-xs text-muted-foreground tracking-[0.14em]">
                  {s.num}
                </div>
                <div className="col-span-10 lg:col-span-3">
                  <h3 className="font-heading text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground">
                    {s.title}
                  </h3>
                </div>
                <div className="col-span-12 lg:col-span-7 lg:col-start-6 text-base text-muted-foreground leading-relaxed max-w-xl">
                  {s.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIAL — single, large ============== */}
      <section className="border-t border-border bg-background py-24 lg:py-40">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-10">
              In their words
            </div>
            <blockquote className="font-heading text-[clamp(1.75rem,3.6vw,3rem)] font-light leading-[1.2] tracking-[-0.025em] text-foreground">
              "Ordered five hundred flyers at two in the afternoon. They
              arrived the next morning, the colours exact, the card stock
              substantial.{" "}
              <span className="italic text-muted-foreground">
                Completely changed how we think about print.
              </span>
              "
            </blockquote>
            <div className="mt-12 flex items-center justify-center gap-3 text-sm">
              <span className="font-medium text-foreground">Sarah M.</span>
              <span className="h-px w-6 bg-border" />
              <span className="text-muted-foreground">
                Hartwood Café, Melbourne
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== VALUES — restrained grid ============== */}
      <section className="border-t border-border bg-background py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-20 max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Principles
            </div>
            <h2 className="font-heading text-[clamp(2.25rem,5vw,4.25rem)] font-light tracking-[-0.04em] leading-[1.02] text-foreground">
              Quietly obsessed
              <br />
              <span className="italic text-muted-foreground">
                with the details.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden">
            {[
              {
                title: "Archival stocks",
                desc: "90 to 350gsm. Gloss, matte, recycled, uncoated.",
              },
              {
                title: "Free file check",
                desc: "Every order reviewed by a human before press.",
              },
              {
                title: "Express tier",
                desc: "Submit by 10am, ship the same day. No surcharge for care.",
              },
              {
                title: "Carbon neutral",
                desc: "Tracked, insured, climate-positive shipping.",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                className="bg-background p-8 lg:p-10"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-6">
                  0{i + 1}
                </div>
                <h3 className="font-heading text-xl font-normal tracking-[-0.02em] text-foreground">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA — dark, restrained ============== */}
      <section className="bg-hero-bg text-hero-foreground py-32 lg:py-48">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-hero-foreground/50 mb-10">
              Ready when you are
            </div>
            <h2 className="font-heading text-[clamp(2.5rem,7vw,6rem)] font-light tracking-[-0.045em] leading-[0.96] text-hero-foreground">
              Print something
              <br />
              <span className="italic text-hero-foreground/60">
                worth keeping.
              </span>
            </h2>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/order/$product"
                params={{ product: "flyers" }}
                className="group inline-flex items-center h-12 px-7 rounded-full bg-hero-foreground text-hero-bg text-sm font-medium hover:bg-hero-foreground/90 transition-all"
              >
                Get a quote
                <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="text-sm text-hero-foreground underline underline-offset-[6px] decoration-hero-foreground/30 hover:decoration-hero-foreground transition-colors"
              >
                Talk to a printer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}