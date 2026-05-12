import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — S&S Printers" },
      {
        name: "description",
        content:
          "Explore our portfolio of high-quality custom printing and packaging projects in Australia.",
      },
    ],
  }),
  component: GalleryPage,
});

const galleryItems = [
  {
    title: "Premium Business Cards",
    category: "Branding",
    image: "/products/cards.png",
    size: "small",
  },
  {
    title: "Luxury Retail Paper Bags",
    category: "Packaging",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
    size: "large",
  },
  {
    title: "Custom Pizza Boxes",
    category: "Food Packaging",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
    size: "medium",
  },
  {
    title: "Promotional Flyers",
    category: "Marketing",
    image: "/products/flyers.png",
    size: "medium",
  },
  {
    title: "Custom Mailer Boxes",
    category: "Packaging",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
    size: "small",
  },
  {
    title: "Professional Brochures",
    category: "Marketing",
    image: "/products/brochures.png",
    size: "large",
  },
  {
    title: "Die-cut Stickers",
    category: "Labels",
    image: "/products/stickers.png",
    size: "medium",
  },
  {
    title: "Restaurant Menus",
    category: "Hospitality",
    image:
      "https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=1000&auto=format&fit=crop",
    size: "small",
  },
  {
    title: "Branded Carry Bags",
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    size: "medium",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
};

function GalleryPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Our Portfolio
            </div>
            <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-4xl">
              Selected{" "}
              <span className="italic text-muted-foreground text-gradient-brand font-serif">
                works.
              </span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeUp}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="break-inside-avoid group relative overflow-hidden rounded-[2rem] border border-border bg-muted cursor-pointer"
              >
                <div className="aspect-square sm:aspect-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-heading text-white">{item.title}</h3>
                    <div className="pt-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-secondary/30 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp} className="space-y-8 max-w-2xl mx-auto">
            <h2 className="font-heading text-4xl lg:text-5xl font-light">Inspired by our work?</h2>
            <p className="text-muted-foreground text-lg">
              Let's create something exceptional for your business. Get a tailored quote for your
              project today.
            </p>
            <div className="pt-6">
              <Link
                to="/quote"
                className="inline-flex items-center h-14 px-10 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all shadow-xl gap-3"
              >
                Start a Quote Request <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
