import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          // Unique constraint
          toast.info("You're already subscribed!");
        } else {
          toast.error("Failed to subscribe. Please try again.");
        }
      } else {
        toast.success("Welcome! You've successfully subscribed.");
        setEmail("");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-footer text-white relative overflow-hidden">
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gradient-brand" />
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-15 blur-[120px]" />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-10">
        {/* Big wordmark */}
        <div className="border-b border-white/10 pb-12 mb-12">
          <img src="/logo.jpg" alt="S&S Printers" className="h-16 w-auto invert mix-blend-screen" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-white/85 leading-relaxed max-w-xs">
              Your trusted partner for high-quality custom printing and packaging solutions across
              Australia.
            </p>
          </div>

          <div>
            <div className="space-y-3">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/products" as const, label: "Products & Services" },
                { to: "/quote" as const, label: "Get a Quote" },
                { to: "/gallery" as const, label: "Gallery" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm text-white/85 hover:text-white/55 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="space-y-3">
              {[
                { to: "/about" as const, label: "About Us" },
                { to: "/contact" as const, label: "Contact Us" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm text-white/85 hover:text-white/55 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="mailto:sandsprinters26@gmail.com"
                className="block text-sm text-white/85 hover:text-white/55 transition-colors"
              >
                sandsprinters26@gmail.com
              </a>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 mb-5">
              Newsletter
            </div>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              Studio updates, new stocks, and occasional offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center border-b border-white/10 focus-within:border-white transition-colors"
            >
              <input
                required
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent h-10 text-sm text-white/85 placeholder:text-white/55 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/85 hover:text-white/55 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join →"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
            © 2026 S&S Printers · Australia
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 hover:text-white/85 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 hover:text-white/85 transition-colors"
            >
              Terms
            </Link>
            <a
              href="#"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 hover:text-white/85 transition-colors"
            >
              Shipping
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
