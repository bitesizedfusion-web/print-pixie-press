import { createFileRoute, Link } from "@tanstack/react-router";
import { VexHero } from "@/components/hero/VexHero";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Package,
  Truck,
  Palette,
  Headphones,
  Star,
  BarChart3,
  Layout,
  Clock,
  Globe,
  Award,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.32, 0.72, 0, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const clientLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/b/b3/DHL_Express_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/FedEx_Corporation_-_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/United_Parcel_Service_logo_2014.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/05/Logo_Maersk.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/3/39/Lufthansa_Logo_2018.svg",
];

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "Marketing Director",
    text: "The Pro Max finish on our building wraps was exceptional. Best printing service in Sydney by far.",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "Local Business Owner",
    text: "Fast service and very affordable. Australia-wide delivery made it easy for our interstate branches.",
    stars: 5,
  },
  {
    name: "Emma Thompson",
    role: "Event Planner",
    text: "Ordered 500 flyers and they looked sharp and professional. Highly recommend their design support.",
    stars: 5,
  },
];

const whyChooseUs = [
  {
    title: "High-Quality Printing",
    desc: "We provide clean, sharp and professional printing for every order.",
    icon: Award,
  },
  {
    title: "All Printing in One Place",
    desc: "Flyers, NCR forms, custom boxes, stickers, banners and more.",
    icon: Layout,
  },
  {
    title: "Custom Sizes & Designs",
    desc: "Tailored to your specific material and design requirements.",
    icon: Palette,
  },
  {
    title: "Fast Service",
    desc: "We aim to complete every order as quickly as possible.",
    icon: Clock,
  },
  {
    title: "Affordable Pricing",
    desc: "Competitive prices for both small and bulk orders.",
    icon: BarChart3,
  },
  {
    title: "Australia-Wide Delivery",
    desc: "Reliable delivery across all states and territories.",
    icon: Truck,
  },
];

const showcaseProducts = [
  { title: "A Frame Boards", image: "/projects/showcase_a_frame.png" },
  {
    title: "A Frame Posters",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&auto=format&fit=crop&w=800",
  },
  { title: "Banner Mesh Panel", image: "/projects/showcase_mesh_banner.png" },
  {
    title: "Mesh Site Posters",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Building Wraps",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Building Wrap Posters",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Aluminium Panels",
    image:
      "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Aluminium Posters",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Vinyl Hoarding Banners",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Hoarding Site Posters",
    image:
      "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Industrial Safety Signs",
    image:
      "https://images.unsplash.com/photo-1578130860879-156ca0196884?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Safety Site Posters",
    image:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Container Signage",
    image:
      "https://images.unsplash.com/photo-1512413316925-fd4b93f31521?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Container Branding Posters",
    image:
      "https://images.unsplash.com/photo-1493946740624-75b84244a59f?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Corflute Signage",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Event Backdrops",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Stage Banners",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&auto=format&fit=crop&w=800",
  },
  {
    title: "Premium Brand Posters",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&auto=format&fit=crop&w=800",
  },
];

function HomePage() {
  return (
    <div className="bg-background overflow-x-hidden">
      <VexHero />

      {/* Logo Marquee Section - Normalized height */}
      <section className="py-8 border-b border-border bg-muted/10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
              Trusted by brands across Australia
            </p>
            <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-background after:to-transparent">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-16 whitespace-nowrap"
              >
                {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt="Client Logo"
                    className="h-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Marquee - Balanced sizes */}
      <section className="py-20 border-b border-border bg-card/30">
        <div className="mb-12 px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div {...fadeUp} className="max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
              Our Products
            </span>
            <h2 className="font-heading text-4xl lg:text-6xl font-light tracking-tight">
              Diverse Range of{" "}
              <span className="italic text-muted-foreground underline decoration-border decoration-2">
                Signage Solutions.
              </span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp}>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-base font-semibold hover:text-muted-foreground transition-colors"
            >
              View All Products{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden py-6">
          <motion.div
            animate={{ x: [0, -2500] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...showcaseProducts, ...showcaseProducts, ...showcaseProducts].map((prod, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="w-[300px] shrink-0 group relative overflow-hidden rounded-[24px] border border-border bg-card shadow-lg transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="font-heading text-xl text-foreground mb-1">{prod.title}</h4>
                  <div className="h-0.5 w-0 bg-foreground transition-all duration-500 group-hover:w-1/2" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Pro Max Bento Grid */}
      <section className="py-24 lg:py-32 border-b border-border bg-muted/5">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-4 block">
              The Prime Advantage
            </span>
            <h2 className="font-heading text-5xl lg:text-7xl font-light tracking-tight mb-8">
              Elevating Your{" "}
              <span className="italic text-muted-foreground underline decoration-border decoration-2">
                Brand Identity.
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {/* Bento Card 1: Experience (Large) */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 lg:col-span-3 p-10 rounded-[40px] bg-card border border-border shadow-soft group hover:shadow-prime transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-foreground/5 rounded-bl-[120px] -z-0 group-hover:bg-foreground/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center mb-10 shadow-xl">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-3xl mb-6">
                  20+ Years of <br />
                  Printing Mastery
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                  Our legacy is built on precision, quality, and a deep understanding of packaging
                  aesthetics that convert customers.
                </p>
              </div>
            </motion.div>

            {/* Bento Card 2: Quality */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 lg:col-span-3 p-10 rounded-[40px] bg-foreground text-background border border-foreground shadow-prime group relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-3xl mb-6">
                Uncompromising <br />
                Quality Standards
              </h3>
              <p className="opacity-60 text-lg leading-relaxed">
                Every print undergoes a rigorous 5-point inspection before leaving our facility,
                ensuring absolute perfection.
              </p>
            </motion.div>

            {/* Bento Card 3: Logistics */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 lg:col-span-2 p-8 rounded-[40px] bg-card border border-border shadow-soft group hover:shadow-prime transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mb-8 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl mb-4">
                Express <br />
                Distribution
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Fastest turnaround in the industry with real-time tracking.
              </p>
            </motion.div>

            {/* Bento Card 4: Support */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 lg:col-span-2 p-8 rounded-[40px] bg-card border border-border shadow-soft group hover:shadow-prime transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mb-8 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl mb-4">
                Dedicated <br />
                Support
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your personal project manager for every printing requirement.
              </p>
            </motion.div>

            {/* Bento Card 5: Technology */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-4 lg:col-span-2 p-8 rounded-[40px] bg-muted/30 border border-border/50 shadow-soft group hover:shadow-prime transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mb-8 group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl mb-4">
                Next-Gen <br />
                Print Tech
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Equipped with the latest Heidelberg and HP Indigo presses.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Recent Projects - MeshDirect Style */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" /> Our Portfolio
              </span>
              <h2 className="font-heading text-5xl lg:text-7xl font-bold tracking-tighter uppercase">
                Recent <span className="text-[#FF6B00]">Work.</span>
              </h2>
            </div>
            <Link
              to="/gallery"
              className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-[#FF6B00] transition-colors"
            >
              View All Projects{" "}
              <div className="w-10 h-[1px] bg-foreground group-hover:bg-[#FF6B00] group-hover:w-14 transition-all" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Custom Corrugated Packaging",
                category: "Packaging",
                img: "/projects/packaging.png",
                logo: "/logo.jpg",
              },
              {
                title: "Corporate Branding Suite",
                category: "Stationery",
                img: "/projects/stationery.png",
                logo: "/logo.jpg",
              },
              {
                title: "Large Format Vinyl Banners",
                category: "Signage",
                img: "/projects/signage.png",
                logo: "/logo.jpg",
              },
            ].map((work, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-border shadow-soft relative mb-6">
                  <img
                    src={work.img}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 glass-pro rounded-full flex items-center gap-2 border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                      {work.category}
                    </span>
                  </div>

                  {/* Logo Overlay - MeshDirect Pattern */}
                  <div className="absolute bottom-6 right-6 w-16 h-16 glass-pro rounded-2xl flex items-center justify-center border border-white/20 shadow-prime p-2 group-hover:scale-110 transition-transform">
                    <img
                      src={work.logo}
                      alt="Client Logo"
                      className="w-full h-auto invert grayscale brightness-200 opacity-80"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <p className="text-white text-sm font-medium leading-relaxed">
                      High-precision printing with premium finish.
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-1 group-hover:text-[#FF6B00] transition-colors">
                  {work.title}
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Sydney, Australia
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By - Monochrome Logo Wall */}
      <section className="py-24 bg-muted/10 border-y border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xs text-center md:text-left">
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Our Esteemed Clients
              </h4>
              <p className="text-2xl font-heading tracking-tighter">
                Powering Australia's <br />
                Industry Leaders.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="h-24 glass-pro rounded-2xl border border-border/50 flex items-center justify-center p-6 group hover:border-[#FF6B00]/30 transition-all"
                >
                  <img
                    src="/logo.jpg"
                    alt="Partner"
                    className="max-h-full w-auto grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-foreground text-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...reviews, ...reviews].map((rev, i) => (
              <div
                key={i}
                className="w-[320px] p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col gap-4"
              >
                <Quote className="w-8 h-8 opacity-20" />
                <p className="text-base leading-relaxed whitespace-normal italic opacity-90">
                  "{rev.text}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-base">
                    {rev.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{rev.name}</div>
                    <div className="text-[10px] opacity-50">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Balanced Prime */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-foreground/5 blur-[100px] rounded-full" />
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div {...fadeUp} className="space-y-12">
            <h2 className="font-heading text-5xl lg:text-8xl font-light tracking-tight leading-[1] mb-6">
              Let's Create <br />
              Something{" "}
              <span className="italic text-muted-foreground underline decoration-border decoration-2">
                Iconic.
              </span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/quote"
                className="h-14 px-8 rounded-full bg-foreground text-background font-bold text-base flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Get Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="h-14 px-8 rounded-full bg-background border-2 border-border text-foreground font-bold text-base flex items-center gap-3 hover:bg-muted transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
