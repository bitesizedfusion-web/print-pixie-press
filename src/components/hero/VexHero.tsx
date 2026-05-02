import { Link } from "@tanstack/react-router";
import { AnimatedHeading } from "./AnimatedHeading";
import { FadeIn } from "./FadeIn";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

export function VexHero() {
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
            {[
              { to: "/" as const, label: "Home" },
              { to: "/about" as const, label: "About Us" },
              { to: "/products" as const, label: "Products & Services" },
              { to: "/gallery" as const, label: "Gallery" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            to="/contact"
            className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Start a Chat
          </Link>
        </nav>

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
