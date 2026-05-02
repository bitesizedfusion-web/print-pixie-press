import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Phone, Mail, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About Us" },
  { to: "/products" as const, label: "Products & Services" },
  { to: "/quote" as const, label: "Get a Quote" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/contact" as const, label: "Contact Us" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHeroPage = location.pathname === "/";
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = isHeroPage && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : isHeroPage
          ? "bg-transparent border-b border-transparent"
          : "bg-background/85 backdrop-blur-xl border-b border-border/60"
      }`}
    >
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gradient-brand" />

      {/* Top Bar for Desktop - Contact Links */}
      <div className={`hidden lg:block border-b transition-colors ${onDark ? "border-white/10 bg-black/10" : "border-border/40 bg-muted/30"}`}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-9 flex items-center justify-end gap-6 text-[11px] font-mono uppercase tracking-wider">
          <a href="mailto:sandsprinters26@gmail.com" className={`flex items-center gap-1.5 transition-colors ${onDark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
            <Mail className="w-3 h-3" />
            sandsprinters26@gmail.com
          </a>
          <a href="tel:0412345678" className={`flex items-center gap-1.5 transition-colors ${onDark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
            <Phone className="w-3 h-3" />
            0412 345 678
          </a>
          <a href="https://wa.me/61412345678" target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 transition-colors ${onDark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="S&S Printing and Packaging" 
              className={`h-12 w-auto transition-all ${onDark ? "invert mix-blend-screen" : "mix-blend-multiply"}`} 
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-[12px] font-medium tracking-tight transition-colors ${
                    onDark
                      ? active ? "text-white" : "text-white/60 hover:text-white"
                      : active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span layoutId="nav-active" className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-6 rounded-full bg-gradient-brand" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/quote"
              className="hidden md:inline-flex items-center h-10 px-6 rounded-full text-[13px] font-medium text-white bg-gradient-brand shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get a Quote
            </Link>
            
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors ${onDark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-gradient-brand text-white text-[10px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-medium shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden p-2 ${onDark ? "text-white" : "text-foreground"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden absolute w-full shadow-xl"
          >
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-[16px] font-medium rounded-xl ${
                    location.pathname === link.to ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 grid grid-cols-1 gap-3">
                <Link to="/quote" onClick={() => setMobileOpen(false)} className="h-12 flex items-center justify-center rounded-xl bg-gradient-brand text-white font-medium">
                  Get a Quote
                </Link>
                <div className="flex items-center justify-center gap-6 pt-4 text-muted-foreground border-t border-border mt-4">
                  <a href="tel:0412345678"><Phone className="w-5 h-5" /></a>
                  <a href="mailto:sandsprinters26@gmail.com"><Mail className="w-5 h-5" /></a>
                  <a href="https://wa.me/61412345678"><MessageCircle className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
