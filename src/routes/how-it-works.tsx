import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — PrintHub Australia" },
      { name: "description", content: "6 simple steps from browsing to delivery. Upload artwork, pay online, and receive your prints." },
      { property: "og:title", content: "How It Works — PrintHub Australia" },
      { property: "og:description", content: "6 simple steps to get your prints delivered." },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  { icon: "🌐", title: "Visit & Browse", desc: "Explore our range of professional print products online" },
  { icon: "⚙️", title: "Configure Order", desc: "Select size, quantity, paper type and turnaround" },
  { icon: "📁", title: "Upload Artwork", desc: "Upload your print-ready PDF, PNG, AI or PSD file" },
  { icon: "💳", title: "Pay Online", desc: "Secure checkout with Stripe, PayID or Afterpay" },
  { icon: "🖨️", title: "We Print", desc: "Your order is printed in 1–3 business days" },
  { icon: "📦", title: "Delivered", desc: "Shipped to your door with tracking link sent via email" },
];

const fileSpecs = [
  "Accepted formats: PDF (preferred), AI, PSD, JPG, PNG",
  "Minimum resolution: 300 DPI",
  "Include 3mm bleed on all sides",
  "CMYK color mode recommended",
  "Embed all fonts",
];

const faqs = [
  { q: "How long does printing take?", a: "Standard orders take 3–5 business days. Express orders are ready in 1–2 business days." },
  { q: "What file formats do you accept?", a: "We accept PDF (preferred), AI, PSD, JPG, and PNG files. Minimum 300 DPI resolution." },
  { q: "Do you check my file before printing?", a: "Yes, our team performs a basic print-ready check on every order at no extra charge." },
  { q: "Can I get a proof before printing?", a: "Yes! Digital proofs are available on request. Just mention it in your order notes." },
  { q: "Do you ship Australia-wide?", a: "Absolutely. We deliver to all states and territories across Australia." },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };

function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <section className="bg-hero-bg text-hero-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold">How It Works</h1>
          <p className="mt-4 text-hero-foreground/70 text-lg">From upload to delivery in 6 simple steps</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-md transition-all">
                <div className="w-14 h-14 mx-auto bg-cta/10 rounded-full flex items-center justify-center text-2xl mb-4">{s.icon}</div>
                <div className="font-mono text-xs text-cta font-bold mb-2">STEP {i + 1}</div>
                <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* File Specs */}
      <section className="py-16 bg-card">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-2xl font-bold text-center mb-8">File Specifications</h2>
            <div className="bg-background rounded-xl border border-border p-6 space-y-3">
              {fileSpecs.map(spec => (
                <div key={spec} className="flex items-start gap-3">
                  <span className="text-success mt-0.5">✅</span>
                  <span className="text-sm text-foreground">{spec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left">
                    <span className="font-medium text-sm text-foreground">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-6 pb-4">
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card text-center">
        <Link to="/order/$product" params={{ product: "flyers" }}><Button variant="cta" size="lg">Start Your Order</Button></Link>
      </section>
    </div>
  );
}
