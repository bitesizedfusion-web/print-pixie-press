import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-10">
        {/* Big wordmark */}
        <div className="border-b border-border pb-12 mb-12">
          <div className="font-heading text-[clamp(3rem,12vw,10rem)] font-light leading-[0.85] tracking-[-0.05em] text-foreground">
            Printmaster<span className="italic text-muted-foreground">.</span>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Studio
            </div>
            <p className="text-sm text-foreground leading-relaxed max-w-xs">
              A small Sydney studio printing for considered brands since 2015.
            </p>
            <p className="mt-6 text-[11px] text-muted-foreground font-mono uppercase tracking-[0.14em]">
              ABN 12 345 678 901
            </p>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Browse
            </div>
            <div className="space-y-3">
              {[
                { to: "/products" as const, label: "Products" },
                { to: "/pricing" as const, label: "Pricing" },
                { to: "/how-it-works" as const, label: "Process" },
                { to: "/track" as const, label: "Track order" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm text-foreground hover:text-muted-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Studio
            </div>
            <div className="space-y-3">
              {[
                { to: "/about" as const, label: "About" },
                { to: "/contact" as const, label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm text-foreground hover:text-muted-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="mailto:info@printmaster.com.au"
                className="block text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                info@printmaster.com.au
              </a>
              <a
                href="tel:1300555123"
                className="block text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                1300 555 123
              </a>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Newsletter
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Studio updates, new stocks, occasional offers. No spam.
            </p>
            <form className="flex items-center border-b border-border focus-within:border-foreground transition-colors">
              <input
                type="email"
                placeholder="you@studio.com"
                className="flex-1 bg-transparent h-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                className="text-[11px] font-mono uppercase tracking-[0.14em] text-foreground hover:text-muted-foreground transition-colors"
              >
                Join →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            © 2025 Printmaster Studio · Sydney, Australia
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
