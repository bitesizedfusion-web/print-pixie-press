import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import aboutFacility from "@/assets/about-facility.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Studio — Printmaster" },
      {
        name: "description",
        content:
          "A small Sydney studio printing for considered brands. Quality, speed and reliability since 2015.",
      },
      { property: "og:title", content: "Studio — Printmaster" },
      { property: "og:description", content: "A small studio with high standards." },
      { property: "og:image", content: aboutFacility },
    ],
  }),
  component: AboutPage,
});

const ease = [0.32, 0.72, 0, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};

function AboutPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Studio
          </div>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
            A small studio
            <br />
            <span className="italic text-muted-foreground">
              with high standards.
            </span>
          </h1>
        </div>
      </section>

      {/* Image */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
          <motion.div {...fadeUp}>
            <div className="aspect-[16/8] w-full overflow-hidden rounded-2xl bg-muted">
              <img
                src={aboutFacility}
                alt="Printmaster studio facility"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Fig. 02 — The studio, Sydney
              </span>
              <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Established 2015
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story — two columns */}
      <section className="border-b border-border py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12">
          <motion.div {...fadeUp} className="lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Letter from the studio
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-light tracking-[-0.03em] text-foreground leading-[1.1]">
              We started Printmaster
              <br />
              <span className="italic text-muted-foreground">
                because we kept being disappointed.
              </span>
            </h2>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="lg:col-span-7 lg:col-start-6 space-y-6 text-base text-muted-foreground leading-[1.7] max-w-2xl"
          >
            <p>
              Most online printers treat their work like a commodity — fast,
              cheap, forgettable. We wanted something different. A studio
              where every job is reviewed by a human, every stock is chosen
              with care, and every parcel arrives looking exactly the way you
              imagined it.
            </p>
            <p>
              Ten years on, we still print the way we started: small batches,
              archival inks, considered finishes. Brands we love use us
              because we treat their print like our own.
            </p>
            <p className="text-foreground">— The Printmaster studio, Sydney</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {[
              { kpi: "10+", label: "Years operating", note: "Est. 2015" },
              { kpi: "10K+", label: "Brands served", note: "Australia-wide" },
              { kpi: "1.2M", label: "Items printed", note: "Per month" },
              { kpi: "100%", label: "Carbon neutral", note: "Every parcel" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
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

      {/* Values */}
      <section className="border-b border-border py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="mb-16 max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Principles
            </div>
            <h2 className="font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light tracking-[-0.04em] leading-[1.05] text-foreground">
              What we believe.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden">
            {[
              { title: "Quality", desc: "Premium materials and precision printing on every order." },
              { title: "Speed", desc: "Express turnaround when you need it. Standard when you don't." },
              { title: "Reliability", desc: "Consistent results you can count on, every single time." },
              { title: "Care", desc: "A friendly Sydney team that picks up the phone." },
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

      {/* CTA */}
      <section className="py-24 lg:py-32 text-center">
        <Link
          to="/order/$product"
          params={{ product: "flyers" }}
          className="group inline-flex items-center h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-all"
        >
          Start your first order
          <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  );
}