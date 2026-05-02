import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatedHeading } from "./AnimatedHeading";
import { FadeIn } from "./FadeIn";
import { Menu, X, Home, Info, Package, FileText, Image, PhoneCall, Mail, MessageCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const navLinks = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/about" as const, label: "About Us", icon: Info },
  { to: "/products" as const, label: "Products & Services", icon: Package },
  { to: "/quote" as const, label: "Get a Quote", icon: FileText },
  { to: "/gallery" as const, label: "Gallery", icon: Image },
  { to: "/contact" as const, label: "Contact Us", icon: PhoneCall },
];

export function VexHero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white font-sans flex flex-col">
      {/* Background video — no overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col min-h-[100svh] px-6 md:px-12 lg:px-16 pt-6">
        {/* Navbar */}
        <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="S&S Printing and Packaging" 
              className="h-10 w-auto invert mix-blend-screen" 
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(l => l.label !== "Get a Quote" && l.label !== "Contact Us").map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Link
                to="/quote"
                className="hidden sm:inline-flex bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
                Get a Quote
            </Link>
            <button 
                onClick={() => setMobileOpen(true)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {mobileOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
            >
                <div className="flex flex-col h-full pt-24 px-8 pb-10">
                {/* Close Button */}
                <button 
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo in Menu */}
                <div className="mb-12">
                    <img src="/logo.jpg" alt="Logo" className="h-10 w-auto invert mix-blend-screen" />
                </div>

                {/* Navigation Links */}
                <div className="flex-1 space-y-6">
                    {navLinks.map((link, idx) => (
                    <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                        <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-4 text-3xl font-heading tracking-tight transition-all active:scale-95 ${
                            location.pathname === link.to ? "text-white" : "text-white/40"
                        }`}
                        >
                        <link.icon className={`w-8 h-8 ${location.pathname === link.to ? "text-white" : "text-white/20"}`} strokeWidth={1.5} />
                        {link.label}
                        </Link>
                    </motion.div>
                    ))}
                </div>

                {/* Bottom Actions & Contacts */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-8"
                >
                    <Link 
                    to="/quote" 
                    onClick={() => setMobileOpen(false)} 
                    className="h-14 w-full flex items-center justify-center rounded-2xl bg-white text-black font-semibold text-lg shadow-xl shadow-white/10"
                    >
                    Get a Quote
                    </Link>

                    <div className="space-y-4">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-white/40">Get in touch</div>
                    <div className="flex items-center gap-6 text-white">
                        <a href="tel:0412345678" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                        </a>
                        <a href="mailto:sandsprinters26@gmail.com" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                        </a>
                        <a href="https://wa.me/61412345678" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                    </div>
                </motion.div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* Bottom hero content */}
        <div className="flex-1 flex flex-col justify-end pb-12 lg:pb-16 lg:grid lg:grid-cols-2 lg:items-end gap-8">
          <div>
            <AnimatedHeading
              text={"S&S Printing\nand Packaging"}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white"
              style={{ letterSpacing: "-0.04em" }}
            />
            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5 max-w-xl">
                We print flyers, business cards, brochures, stickers, labels, paper bags, pizza boxes, packaging boxes, books and more. Quality work, fast service and Australia-wide delivery.
              </p>
            </FadeIn>
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/quote"
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  to="/products"
                  className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
                >
                  Explore Now
                </Link>
              </div>
            </FadeIn>
          </div>

          <div className="flex items-end justify-start lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                <span className="text-lg md:text-xl lg:text-2xl font-light text-white">
                  Printing. Packaging. Delivered.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
