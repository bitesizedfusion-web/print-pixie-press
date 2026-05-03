import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatedHeading } from "./AnimatedHeading";
import { FadeIn } from "./FadeIn";
import { Menu, X, Home, Info, Package, FileText, Image, PhoneCall, Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const navLinks = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/about" as const, label: "About Us", icon: Info },
  { to: "/products" as const, label: "Products & Services", icon: Package },
  { to: "/quote" as const, label: "Get Quote", icon: FileText },
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
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col min-h-[100svh] px-6 md:px-12 lg:px-16 pt-6">
        {/* Navbar - Pro Max Refinement */}
        <nav className="glass-pro rounded-2xl px-6 py-3 flex items-center justify-between border border-white/10 shadow-prime">
          <Link to="/" className="group flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="S&S Printing and Packaging" 
              className="h-10 w-auto invert mix-blend-screen brightness-125" 
            />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.filter(l => l.label !== "Get Quote" && l.label !== "Contact Us").map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs uppercase tracking-[0.2em] font-medium text-white/70 hover:text-white transition-all duration-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Link
                to="/quote"
                className="hidden sm:inline-flex bg-white text-black px-8 py-2.5 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
                Get Quote
            </Link>
            <button 
                onClick={() => setMobileOpen(true)}
                className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all"
            >
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {mobileOpen && (
            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-3xl"
            >
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-black/90 border-l border-white/10 flex flex-col p-10">
                {/* Close Button */}
                <button 
                    onClick={() => setMobileOpen(false)}
                    className="self-end p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo in Menu */}
                <div className="mt-4 mb-16">
                    <img src="/logo.jpg" alt="Logo" className="h-12 w-auto invert mix-blend-screen" />
                </div>

                {/* Navigation Links */}
                <div className="flex-1 space-y-8">
                    {navLinks.map((link, idx) => (
                    <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                        <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center gap-6 text-4xl font-heading tracking-tighter transition-all active:scale-95 ${
                            location.pathname === link.to ? "text-white" : "text-white/30 hover:text-white/60"
                        }`}
                        >
                        <span className="text-sm font-mono opacity-20 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                        {link.label}
                        </Link>
                    </motion.div>
                    ))}
                </div>

                {/* Bottom Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-10"
                >
                    <Link 
                    to="/quote" 
                    onClick={() => setMobileOpen(false)} 
                    className="h-16 w-full flex items-center justify-center rounded-2xl bg-white text-black font-bold text-xl shadow-2xl hover:scale-[1.02] transition-transform"
                    >
                    Get Quote
                    </Link>

                    <div className="grid grid-cols-3 gap-4">
                        <a href="tel:0412345678" className="h-16 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                          <Phone className="w-6 h-6" />
                        </a>
                        <a href="mailto:sandsprinters26@gmail.com" className="h-16 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                          <Mail className="w-6 h-6" />
                        </a>
                        <a href="https://wa.me/61412345678" target="_blank" rel="noreferrer" className="h-16 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                          <MessageCircle className="w-6 h-6" />
                        </a>
                    </div>
                </motion.div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* Bottom hero content - Matching the User Image */}
        <div className="flex-1 flex flex-col justify-end pb-12 lg:pb-20 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
              S&S Printing<br />
              and Packaging
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              We print flyers, business cards, brochures, stickers, labels, paper bags, pizza boxes, packaging boxes, books and more. Quality work, fast service and Australia-wide delivery.
            </p>

            {/* Buttons Group */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/quote"
                className="h-16 px-10 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-2xl min-w-[200px]"
              >
                Get a Quote
              </Link>
              <Link
                to="/products"
                className="h-16 px-10 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 text-white font-bold text-lg flex items-center justify-center hover:bg-black/60 transition-all min-w-[200px]"
              >
                Explore Now
              </Link>
            </div>

            {/* Floating Motto CTA Button */}
            <Link to="/quote">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileActive={{ scale: 0.95 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="inline-flex items-center px-8 py-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl mt-4 cursor-pointer group"
              >
                <span className="text-xl md:text-2xl font-medium tracking-tight flex items-center gap-3">
                  Printing. Packaging. Delivered.
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
