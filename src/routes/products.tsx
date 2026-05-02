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
  transition: { duration: 0.7 }
};

const productList = [
  {
    name: "Flyers & Leaflets",
    desc: "Promote your business, event or offer with high-quality flyers and leaflets. Available in different sizes, paper types and finishes.",
    suitable: ["Business promotion", "Events", "Restaurant offers", "Real estate", "Education", "Community notices"],
    options: ["A6, A5, A4, DL size", "Single side or double side printing", "Glossy, matte or standard paper"],
    image: "/products/flyers.png"
  },
  {
    name: "Business Cards",
    desc: "Make a strong first impression with professional business cards for your brand or company.",
    suitable: ["Business owners", "Professionals", "Sales teams", "Consultants", "Contractors"],
    options: ["Standard or premium cards", "Matte, glossy or laminated finish", "Single or double side printing"],
    image: "/products/cards.png"
  },
  {
    name: "Brochures & Booklets",
    desc: "Show your products, services or company information with professionally printed brochures and booklets.",
    suitable: ["Company profiles", "Product catalogues", "Service guides", "Training materials"],
    options: ["Bi-fold, tri-fold or booklet style", "Different page numbers", "Stapled or folded finish"],
    image: "/products/brochures.png"
  },
  {
    name: "Stickers & Labels",
    desc: "Custom stickers and labels for packaging, branding, products and promotions.",
    suitable: ["Food labels", "Product labels", "Bottle labels", "Logo stickers", "Address labels"],
    options: ["Round, square, rectangle or custom shape", "Glossy or matte finish", "Paper or waterproof material"],
    image: "/products/stickers.png"
  },
  {
    name: "Paper Bags",
    desc: "Custom printed paper bags to promote your brand and give your customers a professional packaging experience.",
    suitable: ["Retail shops", "Restaurants", "Takeaway", "Gifts", "Fashion stores", "Events"],
    options: ["Different sizes", "With or without handle", "Kraft, white or coloured paper", "Front, back and side printing"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Pizza Boxes",
    desc: "Custom printed pizza boxes for restaurants, cafés and takeaway businesses.",
    suitable: ["Pizza shops", "Food delivery", "Takeaway restaurants", "Catering"],
    options: ["Different box sizes", "Logo and brand printing", "Top, front, side and back printing"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Packaging Boxes",
    desc: "Custom packaging boxes for products, gifts, retail and online business orders.",
    suitable: ["Retail products", "Gift boxes", "Shipping boxes", "Cosmetic boxes", "Food packaging"],
    options: ["Custom size", "Cardboard or kraft material", "Front, back, top, bottom, left and right side printing"],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Books & Magazines",
    desc: "Professional printing for books, magazines, catalogues and manuals.",
    suitable: ["Books", "Magazines", "Company catalogues", "Instruction manuals", "School materials"],
    options: ["Different page sizes", "Colour or black-and-white printing", "Stapled, perfect bound or spiral binding"],
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Posters & Banners",
    desc: "Large-format printing for advertising, events and business promotion.",
    suitable: ["Shop displays", "Events", "Promotions", "Exhibitions", "Notices"],
    options: ["A3, A2, A1 and custom sizes", "Indoor and outdoor options", "Glossy or matte finish"],
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Menus",
    desc: "Custom printed menus for restaurants, cafés, takeaway shops and food businesses.",
    suitable: ["Restaurant menus", "Takeaway menus", "Café menus", "Table menus"],
    options: ["Single page or folded menu", "Laminated or standard finish", "Custom size and design"],
    image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Custom Printing & Packaging",
    desc: "Need something special? We can help with custom printing and packaging based on your product, size, design and quantity.",
    suitable: ["Special business orders", "Branded packaging", "Promotional items", "Custom product boxes"],
    options: ["Custom size", "Custom material", "Custom design", "Small or bulk quantity"],
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop"
  }
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

      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="space-y-32">
            {productList.map((p, i) => (
              <motion.div 
                key={p.name}
                {...fadeUp}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`space-y-8 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-muted border border-border shadow-sm">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className={`space-y-10 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <h2 className="font-heading text-4xl lg:text-5xl mb-6">{p.name}</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-foreground">Suitable for:</h4>
                      <ul className="space-y-2">
                        {p.suitable.map(s => (
                          <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-foreground">Options:</h4>
                      <ul className="space-y-2">
                        {p.options.map(o => (
                          <li key={o} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-border" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Link to="/quote" className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-[6px] decoration-border hover:decoration-foreground transition-colors">
                    Request a Quote for {p.name}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-hero-bg text-hero-foreground py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-heading text-4xl lg:text-6xl">Need a custom quote?</h2>
            <p className="text-xl text-hero-foreground/70 font-light">
              Send us your product name, size, quantity, material and delivery details.
            </p>
          </div>
          <Link to="/quote" className="inline-flex items-center h-14 px-10 rounded-full bg-hero-foreground text-hero-bg font-semibold hover:bg-hero-foreground/90 transition-all shadow-xl">
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
