import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { products, quantities, getPricingTable } from "@/lib/pricing";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — S&S Printing and Packaging" },
      {
        name: "description",
        content:
          "Transparent pricing for every product. Flyers from $35, posters from $45. All prices include GST.",
      },
      { property: "og:title", content: "Pricing — S&S Printing and Packaging" },
      { property: "og:description", content: "Transparent printing pricing." },
    ],
  }),
  component: PricingPage,
});

const tabs = products.slice(0, 4);
const ease = [0.32, 0.72, 0, 1] as const;

function PricingPage() {
  const [active, setActive] = useState("flyers");
  const table = getPricingTable(active);
  const product = products.find((p) => p.id === active);

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Index — Pricing
          </div>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
            Transparent
            <br />
            <span className="italic text-muted-foreground">to the cent.</span>
          </h1>
          <p className="mt-10 max-w-xl text-base text-muted-foreground leading-relaxed">
            No quote forms, no hidden setup fees. All prices include GST and a
            free file check. Express tier available on every product.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-[72px] z-30 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                active === t.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.category}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {product?.category}
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl font-light tracking-[-0.02em] text-foreground mt-1">
                  {product?.name}
                </h2>
              </div>
              <p className="hidden sm:block text-sm text-muted-foreground max-w-xs text-right">
                {product?.description}
              </p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground font-normal">
                      Size
                    </th>
                    {quantities.map((q) => (
                      <th
                        key={q}
                        className="text-right px-4 py-5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground font-normal"
                      >
                        Qty {q}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-foreground">
                        {row.size}
                      </td>
                      {quantities.map((q) => (
                        <td
                          key={q}
                          className="text-right px-4 py-5 font-heading text-base font-light text-foreground"
                        >
                          ${row.prices[q]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
              {[
                { label: "Express tier", value: "+30% surcharge" },
                { label: "GST", value: "Included in all prices" },
                { label: "Bulk orders", value: "Custom quote on 1000+" },
              ].map((n) => (
                <div key={n.label} className="bg-card p-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {n.label}
                  </div>
                  <div className="mt-2 text-sm text-foreground">{n.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6">
              <Link
                to="/order/$product"
                params={{ product: active }}
                className="group inline-flex items-center h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-all"
              >
                Get a quote
                <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="text-sm text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground transition-colors"
              >
                Need 1000+? Contact us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}