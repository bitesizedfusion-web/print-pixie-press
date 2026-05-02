import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { CookieBanner } from "@/components/CookieBanner";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "S&S Printing and Packaging — Custom Printing & Packaging Made Easy" },
      { name: "description", content: "Custom printing and packaging made easy. Flyers, business cards, brochures, paper bags, boxes, labels, stickers and more — premium quality with fast Australia-wide delivery." },
      { property: "og:title", content: "S&S Printing and Packaging — Custom Printing & Packaging Made Easy" },
      { property: "og:description", content: "Custom printing and packaging made easy. Flyers, business cards, brochures, paper bags, boxes, labels, stickers and more — premium quality with fast Australia-wide delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "S&S Printing and Packaging — Custom Printing & Packaging Made Easy" },
      { name: "twitter:description", content: "Custom printing and packaging made easy. Flyers, business cards, brochures, paper bags, boxes, labels, stickers and more — premium quality with fast Australia-wide delivery." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5d2c857-cdae-4e3a-89f6-a7d2056cae8b/id-preview-8887baa5--a7b30937-8d9d-4f4a-b565-8a6b00921560.lovable.app-1776763513585.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5d2c857-cdae-4e3a-89f6-a7d2056cae8b/id-preview-8887baa5--a7b30937-8d9d-4f4a-b565-8a6b00921560.lovable.app-1776763513585.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-heading text-7xl font-bold text-cta">404</h1>
        <p className="mt-4 text-xl font-heading font-semibold text-foreground">Page not found</p>
        <a href="/" className="mt-6 inline-block bg-cta text-cta-foreground px-6 py-3 rounded-lg font-semibold hover:bg-cta-hover transition-colors">Go Home</a>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuth = location.pathname.startsWith("/auth");
  const isHome = location.pathname === "/";
  const hideChrome = isAdmin || isAuth;
  const hideNavbar = hideChrome || isHome;

  return (
    <AuthProvider>
      <CartProvider>
        {!hideNavbar && <Navbar />}
        <main className={hideNavbar ? "" : "pt-16"}>
          <Outlet />
        </main>
        {!hideChrome && <Footer />}
        {!hideChrome && <ChatWidget />}
        {!hideChrome && <CookieBanner />}
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
