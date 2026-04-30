import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { products } from "@/lib/pricing";
import { ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/hero-printing.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Printmaster — Considered printing for considered brands" },
      {
        name: "description",
        content:
          "Premium online printing for brands that care. Flyers, posters, brochures and banners — quoted instantly, printed on archival stocks, shipped Australia-wide.",
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

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="overflow-x-clip bg-background">
      {/* ============== HERO — full-bleed video background ============== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-[100svh] flex items-center"
      >
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.55 }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,27,53,0.88) 0%, rgba(13,27,53,0.55) 100%)",
          }}
        />
        <div className="relative z-[2] w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-hero-foreground">
          {/* Eyebrow / floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 mb-12 lg:mb-16 hero-badge-float"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/90">
              🇦🇺 Australia-Wide Printing · Est. 2015
            </span>
          </motion.div>

          {/* Display headline */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="lg:col-span-8"
            >
              <h1 className="hero-headline font-heading font-light tracking-[-0.045em] leading-[0.92] text-[clamp(3rem,9vw,8.5rem)] text-white">
                Considered
                <br />
                printing for
                <br />
                <em className="hero-shimmer not-italic font-light">
                  considered
                </em>{" "}
                brands.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.4 }}
              className="lg:col-span-4 lg:pb-4"
            >
              <p className="text-[15px] lg:text-base text-white/80 leading-relaxed max-w-sm">
                A small studio printing flyers, posters, brochures and banners
                on premium stocks. Instant quotes, free file checks, shipped
                Australia-wide in as little as twenty-four hours.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.6 }}
                className="mt-8 flex items-center gap-6"
              >
                <Link
                  to="/order/$product"
                  params={{ product: "flyers" }}
                  className="hero-cta-pulse group inline-flex items-center h-11 px-6 rounded-full bg-cta text-cta-foreground text-sm font-medium hover:bg-cta-hover transition-all"
                >
                  Get instant quote
                  <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="text-sm text-white underline underline-offset-[6px] decoration-white/40 hover:decoration-white transition-colors"
                >
                  View all products
                </Link>
              </motion.div>
            </motion.div>
          </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="lg:col-span-4 lg:pb-4"
            >
              <p className="text-[15px] lg:text-base text-muted-foreground leading-relaxed max-w-sm">
                A small studio printing flyers, posters, brochures and banners
                on premium stocks. Instant quotes, free file checks, shipped
                Australia-wide in as little as twenty-four hours.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <Link
                  to="/order/$product"
                  params={{ product: "flyers" }}
                  className="group inline-flex items-center h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-all"
                >
                  Get a quote
                  <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="text-sm text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground transition-colors"
                >
                  Browse work
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero image — wide, single, premium */}
          <motion.div
            style={{ y: heroY }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.3 }}
            className="mt-20 lg:mt-28 relative"
          >
            <div className="aspect-[16/8] w-full overflow-hidden rounded-2xl bg-muted">
              <img
                src={heroImage}
                alt="Premium printed materials"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            {/* Caption */}
            <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Fig. 01 — Selected works, 2024
              </span>
              <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Sydney · Melbourne · Brisbane
              </span>
            </div>
          </motion.div>
        </div>
      </section>

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