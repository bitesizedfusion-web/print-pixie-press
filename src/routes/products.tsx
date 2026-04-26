import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/pricing";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Printmaster" },
      {
        name: "description",
        content:
          "Browse our full catalogue: flyers, posters, brochures, banners, calendars and certificates. Premium printing, shipped Australia-wide.",
      },
      { property: "og:title", content: "Products — Printmaster" },
      { property: "og:description", content: "Premium printing for considered brands." },
    ],
  }),
  component: ProductsPage,
});

const categories = ["All", "Flyers", "Posters", "Brochures", "Banners", "Calendars", "Certificates"];
const ease = [0.32, 0.72, 0, 1] as const;

function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Index — Catalogue
          </div>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
            Everything we
            <br />
            <span className="italic text-muted-foreground">print, well.</span>
          </h1>
          <p className="mt-10 max-w-xl text-base text-muted-foreground leading-relaxed">
            A small, focused range. Each product made on archival stocks,
            checked by hand, shipped tracked.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-[72px] z-30 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-4 flex gap-1 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                filter === c
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-20">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              >
                <Link to="/order/$product" params={{ product: p.id }} className="group block">
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
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                  <div className="mt-5 pt-5 border-t border-border flex items-baseline justify-between">
                    <span className="text-[13px] text-muted-foreground">
                      {p.sizes.join(" · ")}
                    </span>
                    <span className="font-heading text-lg font-light text-foreground">
                      ${p.startingPrice}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}