import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — S&S Printing and Packaging" },
      {
        name: "description",
        content: "High-quality custom printing and packaging solutions in Australia. We print flyers, business cards, boxes, and more.",
      },
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

const services = [
  "Flyers and leaflets",
  "Business cards",
  "Brochures and booklets",
  "Stickers and labels",
  "Paper bags",
  "Pizza boxes",
  "Packaging boxes",
  "Books and magazines",
  "Posters and banners",
  "Custom printing",
  "Custom packaging"
];

function AboutPage() {
  return (
    <div className="bg-background">
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Who we are
            </div>
            <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
              Your trusted partner for
              <br />
              <span className="italic text-muted-foreground">printing & packaging.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12">
          <motion.div {...fadeUp} className="lg:col-span-6 space-y-8 text-lg text-muted-foreground leading-[1.7]">
            <p className="text-foreground text-2xl font-light">
              S&S Printing and Packaging is a printing and packaging service business in Australia.
            </p>
            <p>
              We help businesses, shops, restaurants, events and individuals with high-quality custom printing and packaging solutions.
            </p>
            <p>
              Our focus is to provide good quality, professional finishing, affordable pricing and fast service. Whether you need a small order or bulk printing, we are ready to help.
            </p>
          </motion.div>

          <motion.div 
            {...fadeUp} 
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 lg:col-start-8"
          >
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <CheckCircle2 className="w-32 h-32" />
              </div>
              <h3 className="font-heading text-2xl mb-8">What we can print:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {services.map(s => (
                  <li key={s} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-brand" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border py-24 lg:py-32 text-center bg-secondary/30">
        <motion.div {...fadeUp}>
            <p className="font-heading text-3xl lg:text-4xl text-foreground mb-12">
                "S&S Printing and Packaging — Your trusted partner for printing and packaging."
            </p>
            <Link
                to="/quote"
                className="group inline-flex items-center h-12 px-7 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-all"
            >
                Get a Quote
                <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
        </motion.div>
      </section>
    </div>
  );
}
