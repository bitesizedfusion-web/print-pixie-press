import os

# --- 1. Update Navbar.tsx ---
navbar_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    navbar_content = f.read()

# Update navLinks
old_links = """const navLinks = [
  { to: "/products" as const, label: "Products" },
  { to: "/pricing" as const, label: "Pricing" },
  { to: "/how-it-works" as const, label: "Process" },
  { to: "/about" as const, label: "Studio" },
  { to: "/contact" as const, label: "Contact" },
];"""

new_links = """const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About Us" },
  { to: "/products" as const, label: "Products & Services" },
  { to: "/quote" as const, label: "Get a Quote" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/contact" as const, label: "Contact Us" },
];"""

navbar_content = navbar_content.replace(old_links, new_links)

# Also update the VexHero internal navbar (it might be duplicated there)
# We'll handle VexHero separately.

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(navbar_content)

# --- 2. Update VexHero.tsx ---
vexhero_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\components\hero\VexHero.tsx"
with open(vexhero_path, "r", encoding="utf-8") as f:
    vexhero_content = f.read()

# Update internal nav
old_vex_nav = """            {[
              { to: "/about" as const, label: "Story" },
              { to: "/products" as const, label: "Products" },
              { to: "/how-it-works" as const, label: "Process" },
              { to: "/pricing" as const, label: "Pricing" },
            ].map((l) => ("""

new_vex_nav = """            {[
              { to: "/" as const, label: "Home" },
              { to: "/about" as const, label: "About Us" },
              { to: "/products" as const, label: "Products & Services" },
              { to: "/gallery" as const, label: "Gallery" },
            ].map((l) => ("""

vexhero_content = vexhero_content.replace(old_vex_nav, new_vex_nav)

# Update headline and subheadline
vexhero_content = vexhero_content.replace('text={"Custom printing\\nmade beautifully easy."}', 'text={"S&S Printing\\nand Packaging"}')
vexhero_content = vexhero_content.replace('Flyers, business cards, brochures, paper bags, boxes, labels and stickers — premium quality, fast Australia-wide delivery.', 'We print flyers, business cards, brochures, stickers, labels, paper bags, pizza boxes, packaging boxes, books and more. Quality work, fast service and Australia-wide delivery.')

# Update buttons
vexhero_content = vexhero_content.replace('to="/order/$product"\n                  params={{ product: "flyers" }}\n                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"\n                >\n                  Start a Quote', 'to="/quote"\n                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"\n                >\n                  Get a Quote')

with open(vexhero_path, "w", encoding="utf-8") as f:
    f.write(vexhero_content)

# --- 3. Update index.tsx ---
index_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\index.tsx"
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

# Update footer CTA in index
index_content = index_content.replace('to="/order/$product"\n                params={{ product: "flyers" }}\n                className="group inline-flex items-center h-12 px-7 rounded-full bg-hero-foreground text-hero-bg text-sm font-medium hover:bg-hero-foreground/90 transition-all"\n              >\n                Get a quote', 'to="/quote"\n                className="group inline-flex items-center h-12 px-7 rounded-full bg-hero-foreground text-hero-bg text-sm font-medium hover:bg-hero-foreground/90 transition-all"\n              >\n                Get a Quote')

with open(index_path, "w", encoding="utf-8") as f:
    f.write(index_content)

# --- 4. Update about.tsx ---
about_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\about.tsx"
about_content = """import { createFileRoute, Link } from "@tanstack/react-router";
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
"""
with open(about_path, "w", encoding="utf-8") as f:
    f.write(about_content)

# --- 5. Create Gallery Placeholder ---
gallery_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\gallery.tsx"
gallery_content = """import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-6xl font-light mb-8">Gallery</h1>
          <p className="text-muted-foreground text-xl">Our showcase of premium printing and packaging work is coming soon.</p>
        </motion.div>
      </div>
    </div>
  );
}
"""
with open(gallery_path, "w", encoding="utf-8") as f:
    f.write(gallery_content)

# --- 6. Update quote.tsx ---
quote_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\quote.tsx"
quote_content = """import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Upload, 
  Send, 
  Ruler, 
  Truck, 
  Sparkles, 
  Package, 
  MapPin, 
  Image as ImageIcon,
  ChevronRight,
  User,
  Building,
  Mail,
  Phone,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight,
  Home
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/quote")({
  component: GetQuotePage,
});

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease },
};

const products = [
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

const deliveryOptions = [
  { id: "pickup", label: "Pickup", desc: "Collect from our studio" },
  { id: "standard", label: "Standard Delivery", desc: "Reliable shipping" },
  { id: "express", label: "Express Delivery", desc: "Fastest turnaround" }
];

const urgencyOptions = [
  { id: "urgent", label: "Urgent", desc: "Immediate priority" },
  { id: "1week", label: "Within 1 week", desc: "Fast service" },
  { id: "2weeks", label: "Within 2 weeks", desc: "Standard time" },
  { id: "3weeks", label: "Within 3 weeks", desc: "Plan ahead" },
  { id: "none", label: "No Deadline", desc: "No specific date" }
];

const imageSlots = [
  { id: "front", label: "Front Side" },
  { id: "back", label: "Back Side" },
  { id: "top", label: "Top Side" },
  { id: "bottom", label: "Bottom Side" },
  { id: "left", label: "Left Side" },
  { id: "right", label: "Right Side" }
];

function GetQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    companyName: "",
    email: "",
    mobile: "",
    postcode: "",
    productName: "",
    width: "",
    length: "",
    quantity: "",
    delivery: "standard",
    urgency: "none",
    details: ""
  });

  const [images, setImages] = useState<Record<string, File | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const handleImageChange = (id: string, file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB");
        return;
      }
      setImages(prev => ({ ...prev, [id]: file }));
      setPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 lg:p-16 text-center shadow-xl"
        >
            <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="font-heading text-4xl mb-4">Thank you.</h1>
            <p className="text-muted-foreground text-lg mb-12">
                We have received your quote request. Our team will contact you shortly.
            </p>
            <div className="space-y-4">
                <Link to="/" className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all">
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/products" className="flex items-center justify-center h-12 rounded-full border border-border text-sm font-medium hover:bg-muted transition-all">
                        Products
                    </Link>
                    <Link to="/contact" className="flex items-center justify-center h-12 rounded-full border border-border text-sm font-medium hover:bg-muted transition-all">
                        Contact Us
                    </Link>
                </div>
            </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Inquiry — Request for Quote
            </div>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.04em] leading-[0.96] text-foreground max-w-3xl">
              Get a Quote
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-7 space-y-12">
              
              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="font-heading text-2xl border-b border-border pb-4">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><User className="h-3 w-3"/> First Name *</label>
                        <input required type="text" value={formData.firstName} onChange={e => setFormData(p => ({...p, firstName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><User className="h-3 w-3"/> Surname *</label>
                        <input required type="text" value={formData.surname} onChange={e => setFormData(p => ({...p, surname: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Building className="h-3 w-3"/> Company Name</label>
                        <input type="text" value={formData.companyName} onChange={e => setFormData(p => ({...p, companyName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Mail className="h-3 w-3"/> Email *</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Phone className="h-3 w-3"/> Mobile Phone Number *</label>
                        <input required type="tel" value={formData.mobile} onChange={e => setFormData(p => ({...p, mobile: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><MapPin className="h-3 w-3"/> Delivery Postcode *</label>
                        <input required type="text" value={formData.postcode} onChange={e => setFormData(p => ({...p, postcode: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <h3 className="font-heading text-2xl border-b border-border pb-4">Product Specifications</h3>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Package className="h-3 w-3"/> Product Name *</label>
                        <select required value={formData.productName} onChange={e => setFormData(p => ({...p, productName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all appearance-none font-medium">
                            <option value="">Select a product</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Ruler className="h-3 w-3"/> Width in cm</label>
                            <input type="number" placeholder="Width" value={formData.width} onChange={e => setFormData(p => ({...p, width: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Ruler className="h-3 w-3"/> Length in cm</label>
                            <input type="number" placeholder="Length" value={formData.length} onChange={e => setFormData(p => ({...p, length: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Layers className="h-3 w-3"/> Quantity *</label>
                            <input required type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData(p => ({...p, quantity: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                    </div>
                </div>
              </div>

              {/* Delivery & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Truck className="h-3 w-3"/> Delivery Option</label>
                    <div className="space-y-2">
                        {deliveryOptions.map(o => (
                            <button key={o.id} type="button" onClick={() => setFormData(p => ({...p, delivery: o.id}))} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.delivery === o.id ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground/30"}`}>
                                <div className="text-sm font-semibold">{o.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><Clock className="h-3 w-3"/> How urgent is the job?</label>
                    <div className="space-y-2">
                        {urgencyOptions.map(o => (
                            <button key={o.id} type="button" onClick={() => setFormData(p => ({...p, urgency: o.id}))} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.urgency === o.id ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground/30"}`}>
                                <div className="text-sm font-semibold">{o.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Describe Product Details</label>
                <textarea rows={5} placeholder="Please write your product details, design requirements, colour, paper type, finishing, and any special instructions." value={formData.details} onChange={e => setFormData(p => ({...p, details: e.target.value}))} className="w-full p-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none font-medium" />
              </div>
            </div>

            {/* Right Column: Files */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"><ImageIcon className="h-3 w-3"/> Upload Product Images / Design Files</label>
                  <p className="text-xs text-muted-foreground">Upload front, back, top, bottom, left, and right side images if available.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {imageSlots.map(s => (
                        <label key={s.id} className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/40 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                            {previews[s.id] ? (
                                <img src={previews[s.id]!} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{s.label}</span>
                                </>
                            )}
                            <input type="file" className="hidden" onChange={e => handleImageChange(s.id, e.target.files?.[0] || null)} />
                        </label>
                    ))}
                </div>
                <button type="submit" className="w-full h-16 rounded-full bg-gradient-brand text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                    Submit Quote Request
                    <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
"""
with open(quote_path, "w", encoding="utf-8") as f:
    f.write(quote_content)

print("Successfully updated all files based on user request.")
