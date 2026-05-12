import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { paperTypes } from "@/lib/pricing";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — PrintHub Australia" },
      { name: "description", content: "Review your print order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, cartTotal } = useCart();

  return (
    <div>
      <section className="bg-hero-bg text-hero-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">Your Cart</h1>
          <p className="mt-2 text-hero-foreground/70">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mt-2">Add some print products to get started</p>
              <Link to="/products">
                <Button variant="cta" size="lg" className="mt-6">
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={128}
                      height={96}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-heading font-bold text-foreground">
                      {item.product.name} — {item.size}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {paperTypes.find((p) => p.id === item.paperType)?.name} ·{" "}
                      {item.doubleSided ? "Double Sided" : "Single Sided"} ·{" "}
                      {item.express ? "Express" : "Standard"}
                    </p>
                    {item.fileName && (
                      <p className="text-xs text-muted-foreground">File: {item.fileName}</p>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="font-mono text-lg font-bold text-cta">
                      AUD ${item.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg font-bold">Cart Total</span>
                  <span className="font-mono text-2xl font-bold text-cta">
                    AUD ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <Link to="/checkout">
                  <Button variant="cta" size="lg" className="w-full mt-4">
                    Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
