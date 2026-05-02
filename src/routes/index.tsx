import { createFileRoute, Link } from "@tanstack/react-router";
import { VexHero } from "@/components/hero/VexHero";
import { motion } from "framer-motion";
import { 
  ArrowRight, CheckCircle2, ShieldCheck, Zap, 
  Package, Truck, Palette, Headphones, Star, 
  BarChart3, Layout, Clock, Globe, Award
} from "lucide-react";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
};

const whyChooseUs = [
  {
    title: "High-Quality Printing",
    desc: "We provide clean, sharp and professional printing for every order.",
    icon: Award
  },
  {
    title: "All Printing in One Place",
    desc: "Flyers, business cards, brochures, stickers, labels, paper bags, pizza boxes and more.",
    icon: Layout
  },
  {
    title: "Custom Sizes & Designs",
    desc: "We can prepare products based on your size, quantity, material and design requirements.",
    icon: Palette
  },
  {
    title: "Fast Service",
    desc: "We aim to complete every order as quickly as possible.",
    icon: Clock
  },
  {
    title: "Affordable Pricing",
    desc: "We offer competitive prices for small and bulk orders.",
    icon: BarChart3
  },
  {
    title: "Australia-Wide Delivery",
    desc: "We deliver your order to different locations across Australia.",
    icon: Truck
  },
  {
    title: "Friendly Support",
    desc: "Our team is ready to help with quotes, product options and order details.",
    icon: Headphones
  }
];

function HomePage() {
  return (
    <div className="bg-background">
      <VexHero />

      {/* Why Choose Us Section */}
      <section className="py-24 lg:py-32 overflow-hidden border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Expertise</div>
            <h2 className="font-heading text-4xl lg:text-6xl font-light mb-8">Why Choose S&S Printing and Packaging?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We make printing and packaging simple, professional and affordable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {whyChooseUs.map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-foreground/20 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="py-24 lg:py-32 bg-secondary/30 relative">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeUp} className="space-y-10">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Logistics</div>
              <h2 className="font-heading text-4xl lg:text-6xl leading-[0.95] mb-8 italic">Australia-Wide Delivery</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                No matter where you are, we ensure your orders reach you safely and on time. We partner with Australia's leading logistics providers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-heading text-lg">Fast Turnaround</h4>
                <p className="text-sm text-muted-foreground">Local orders often delivered within days.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-heading text-lg">Safe Packaging</h4>
                <p className="text-sm text-muted-foreground">Every order is securely boxed to prevent damage.</p>
              </div>
            </div>

            <Link to="/quote" className="inline-flex items-center gap-4 group">
              <span className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center group-hover:bg-gradient-brand transition-colors">
                <ArrowRight className="w-5 h-5" />
              </span>
              <span className="font-medium border-b border-foreground/30 group-hover:border-foreground transition-colors">Calculate Delivery Time</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            className="aspect-square rounded-[40px] bg-muted overflow-hidden border border-border shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-brand opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity" />
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop" 
              alt="Logistics and Delivery" 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
               <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-70">Service Area</div>
                    <div className="font-semibold">All Australian States & Territories</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp} className="space-y-12">
            <h2 className="font-heading text-5xl lg:text-7xl font-light tracking-[-0.04em] leading-[0.95]">
              Ready to start your <br />
              <span className="italic text-muted-foreground underline decoration-border">next project?</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/quote" className="h-16 px-10 rounded-full bg-foreground text-background font-semibold text-lg flex items-center gap-3 hover:bg-foreground/90 transition-all shadow-xl">
                Get a Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="h-16 px-10 rounded-full bg-background border border-border text-foreground font-semibold text-lg flex items-center gap-3 hover:bg-muted transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}