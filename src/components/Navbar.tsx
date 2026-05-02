import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/products" as const, label: "Products" },
  { to: "/pricing" as const, label: "Pricing" },
  { to: "/how-it-works" as const, label: "Process" },
  { to: "/about" as const, label: "Studio" },
  { to: "/contact" as const, label: "Contact" },
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
      {/* Top accent bar — vibrant brand gradient */}
      <div className="h-[3px] w-full bg-gradient-brand" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          {/* Wordmark */}
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white font-heading text-[15px] font-semibold shadow-md">
              S
            </span>
            <span
              className={`font-heading text-[20px] tracking-[-0.04em] transition-colors ${
                onDark ? "text-hero-foreground" : "text-foreground"
              }`}
            >
              S<span className="text-gradient-brand">&</span>S
              <span className={`ml-1.5 text-[15px] font-light ${onDark ? "text-hero-foreground/70" : "text-muted-foreground"}`}>
                Printing & Packaging
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-tight transition-colors ${
                    onDark
                      ? active
                        ? "text-hero-foreground"
                        : "text-hero-foreground/65 hover:text-hero-foreground"
                      : active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-8 rounded-full bg-gradient-brand"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                onDark
                  ? "text-hero-foreground/70 hover:text-hero-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-gradient-brand text-white text-[10px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-medium shadow">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/order/$product"
              params={{ product: "flyers" }}
              className="ml-2 inline-flex items-center h-9 px-5 rounded-full text-[13px] font-medium text-white bg-gradient-brand shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get a quote
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              to="/cart"
              className={`relative p-2 ${onDark ? "text-hero-foreground" : "text-foreground"}`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-cta text-cta-foreground text-[10px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className={`p-2 ${onDark ? "text-hero-foreground" : "text-foreground"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-3 text-[15px] font-medium border-b border-border/60 ${
                    location.pathname === link.to
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/order/$product"
                params={{ product: "flyers" }}
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center w-full h-11 rounded-full bg-foreground text-background text-sm font-medium"
              >
                Get a quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
