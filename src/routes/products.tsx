import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7 },
};

const categorizedProducts = [
  {
    category: "Printing Products",
    items: [
      {
        name: "Flyers & Leaflets",
        desc: "Promote your business, event or offer with high-quality flyers and leaflets. Available in different sizes, paper types and finishes.",
        suitable: ["Business promotion", "Events", "Restaurant offers", "Real estate", "Education"],
        options: [
          "A6, A5, A4, DL size",
          "Single or double side printing",
          "Glossy, matte or standard paper",
        ],
        image: "/products/flyers.png",
      },
      {
        name: "Business Cards",
        desc: "Make a strong first impression with professional business cards for your brand or company.",
        suitable: ["Professionals", "Sales teams", "Consultants", "Contractors"],
        options: [
          "Standard or premium cards",
          "Matte, glossy or laminated finish",
          "Single or double side printing",
        ],
        image: "/products/cards.png",
      },
      {
        name: "Brochures / Pamphlets",
        desc: "Show your products, services or company information with professionally printed brochures and booklets.",
        suitable: ["Company profiles", "Product catalogues", "Service guides"],
        options: [
          "Bi-fold, tri-fold or booklet style",
          "Different page numbers",
          "Stapled or folded finish",
        ],
        image: "/products/brochures.png",
      },
      {
        name: "Stickers & Labels",
        desc: "Custom stickers and labels for packaging, branding, products and promotions.",
        suitable: ["Product branding", "Bottle labels", "Logo stickers", "Packaging seals"],
        options: [
          "Round, square, rectangle or custom shape",
          "Glossy or matte finish",
          "Paper or waterproof material",
        ],
        image: "/products/stickers.png",
      },
      {
        name: "NCR / Carbonless Forms",
        desc: "Professional invoice books, receipt books, and purchase order books for your business operations.",
        suitable: ["Invoices", "Receipts", "Delivery dockets", "Purchase orders"],
        options: [
          "Duplicate, Triplicate, Quadruplicate",
          "A4, A5, A6 sizes",
          "Numbered and perforated",
        ],
        image:
          "https://images.unsplash.com/photo-1554224155-1696413575b9?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Banners & Posters",
        desc: "Large-format printing including vinyl, fabric, and roll-up banners for maximum visibility.",
        suitable: ["Exhibitions", "Shop front displays", "Events", "Grand openings"],
        options: ["Pull-up banners", "Vinyl banners", "Large posters (A0-A3)"],
        image:
          "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
  {
    category: "Packaging Products",
    items: [
      {
        name: "Custom Boxes",
        desc: "High-quality custom printed boxes for products, gifts, retail and shipping.",
        suitable: ["E-commerce", "Retail packaging", "Gift sets", "Product launches"],
        options: ["Corrugated or carton board", "Custom dimensions", "Full colour printing"],
        image:
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
      },
      {
        name: "Paper Bags",
        desc: "Custom printed paper bags to promote your brand and give your customers a professional experience.",
        suitable: ["Retail shops", "Events", "Gifts", "Fashion stores"],
        options: ["Kraft, white or coloured paper", "With or without handles", "Different sizes"],
        image:
          "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
];

function ProductsPage() {
  return (
    <div className="bg-background">
      <section className="pt-32 pb-20 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Catalog — Products & Services
          </div>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,6rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
            Professional printing
            <br />
            <span className="italic text-muted-foreground">solutions for every need.</span>
          </h1>
        </div>
      </section>

      {categorizedProducts.map((cat, catIdx) => (
        <section key={cat.category} className="py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="mb-20">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-4 block">
                Part {catIdx + 1}
              </span>
              <h2 className="font-heading text-4xl lg:text-6xl font-light tracking-tight uppercase">
                {cat.category}
              </h2>
            </div>

            <div className="space-y-32">
              {cat.items.map((p, i) => (
                <motion.div
                  key={p.name}
                  {...fadeUp}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className={`space-y-8 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-muted border border-border shadow-sm">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className={`space-y-10 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div>
                      <h2 className="font-heading text-4xl lg:text-5xl mb-6">{p.name}</h2>
                      <p className="text-xl text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-foreground">
                          Suitable for:
                        </h4>
                        <ul className="space-y-2">
                          {p.suitable.map((s) => (
                            <li
                              key={s}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-foreground">
                          Options:
                        </h4>
                        <ul className="space-y-2">
                          {p.options.map((o) => (
                            <li
                              key={o}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <div className="w-1 h-1 rounded-full bg-border" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      to="/quote"
                      className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground transition-colors"
                    >
                      Request a Quote for {p.name}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="bg-hero-bg text-hero-foreground py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-heading text-4xl lg:text-6xl">Need a custom quote?</h2>
            <p className="text-xl text-hero-foreground/70 font-light">
              Send us your product name, size, quantity, material and delivery details.
            </p>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center h-14 px-10 rounded-full bg-hero-foreground text-hero-bg font-semibold hover:bg-hero-foreground/90 transition-all shadow-xl"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
