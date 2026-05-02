import os

# --- 1. Update contact.tsx ---
contact_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\contact.tsx"
contact_content = """import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl mb-4">Message Sent</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for contacting S&S Printing and Packaging. We have received your message and will get back to you shortly.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="h-12 px-8 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Contact Us
          </div>
          <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.96] tracking-[-0.04em] text-foreground max-w-3xl">
            Have a question?
            <br />
            <span className="italic text-muted-foreground">Send us a message.</span>
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Name*</label>
                  <input required placeholder="Your name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Email*</label>
                  <input required type="email" placeholder="Your email address" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Phone / WhatsApp</label>
                <input placeholder="Your phone number" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Message*</label>
                <textarea required rows={5} placeholder="Write your message here" value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="w-full p-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none" />
              </div>
              <button type="submit" className="h-14 px-10 rounded-full bg-gradient-brand text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
                Submit
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 space-y-12">
            <div className="space-y-6">
              <h3 className="font-heading text-2xl">Or Email Us</h3>
              <a href="mailto:sandsprinters26@gmail.com" className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all group">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Direct Email</div>
                  <div className="font-medium">sandsprinters26@gmail.com</div>
                </div>
              </a>
            </div>
            
            <div className="p-8 rounded-3xl bg-secondary/50 border border-border">
              <MessageSquare className="w-8 h-8 text-muted-foreground mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team usually responds within 2-4 business hours. For urgent quotes, please use our <a href="/quote" className="text-foreground underline decoration-border hover:decoration-foreground">Get a Quote</a> form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"""
with open(contact_path, "w", encoding="utf-8") as f:
    f.write(contact_content)

# --- 2. Create privacy.tsx ---
privacy_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\privacy.tsx"
privacy_content = """import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="font-heading text-5xl lg:text-7xl font-light mb-12">Privacy Policy</h1>
          
          <div className="prose prose-neutral max-w-none space-y-12 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <p className="text-lg text-foreground">At S&S Printing and Packaging, we respect your privacy and protect your personal information.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Information We Collect</h2>
              <p>When you contact us or request a quote, we may collect:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Postcode</li>
                <li>Product details</li>
                <li>Uploaded images or design files</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to your enquiry</li>
                <li>Prepare quotations</li>
                <li>Process printing or packaging requests</li>
                <li>Contact you about your order</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">File Uploads</h2>
              <p>Any images, artwork, logos or design files you upload are used only for your quotation or order request.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Sharing Your Information</h2>
              <p>We do not sell your personal information. We only share details when required to complete your order, arrange delivery, or comply with legal requirements.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Email Communication</h2>
              <p>We may contact you by email, phone or WhatsApp regarding your enquiry, quote or order.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Data Security</h2>
              <p>We take reasonable steps to keep your personal information safe and secure.</p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl font-heading text-foreground">Contact Us</h2>
              <p>For any privacy questions, please contact us:</p>
              <p className="font-medium text-foreground">Email: sandsprinters26@gmail.com</p>
            </section>

            <section className="text-sm italic">
              <p>Policy Update: This Privacy Policy may be updated from time to time.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
"""
with open(privacy_path, "w", encoding="utf-8") as f:
    f.write(privacy_content)

# --- 3. Update products.tsx ---
# I'll use the images I generated + placeholders
products_path = r"c:\Users\Mohammed Shishir\OneDrive\Desktop\websites\austlia prating busines 2\src\routes\products.tsx"
# Note: I need the actual generated image filenames from the turn output
# product_flyers_1777738703833.png
# product_business_cards_2_1777739185548.png
# product_brochures_2_1777739268225.png
# product_stickers_2_1777739724466.png

products_content = """import { createFileRoute, Link } from "@tanstack/react-router";
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
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Business Cards",
    desc: "Make a strong first impression with professional business cards for your brand or company.",
    suitable: ["Business owners", "Professionals", "Sales teams", "Consultants", "Contractors"],
    options: ["Standard or premium cards", "Matte, glossy or laminated finish", "Single or double side printing"],
    image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Brochures & Booklets",
    desc: "Show your products, services or company information with professionally printed brochures and booklets.",
    suitable: ["Company profiles", "Product catalogues", "Service guides", "Training materials"],
    options: ["Bi-fold, tri-fold or booklet style", "Different page numbers", "Stapled or folded finish"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Stickers & Labels",
    desc: "Custom stickers and labels for packaging, branding, products and promotions.",
    suitable: ["Food labels", "Product labels", "Bottle labels", "Logo stickers", "Address labels"],
    options: ["Round, square, rectangle or custom shape", "Glossy or matte finish", "Paper or waterproof material"],
    image: "https://images.unsplash.com/photo-1572375927501-444475930501?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Paper Bags",
    desc: "Custom printed paper bags to promote your brand and give your customers a professional packaging experience.",
    suitable: ["Retail shops", "Restaurants", "Takeaway", "Gifts", "Fashion stores", "Events"],
    options: ["Different sizes", "With or without handle", "Kraft, white or coloured paper", "Front, back and side printing"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
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
"""
with open(products_path, "w", encoding="utf-8") as f:
    f.write(products_content)

print("Successfully updated all pages.")
