import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OrderTracker } from "@/components/OrderTracker";
import { CheckCircle, Package, Mail } from "lucide-react";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — PrintHub Australia" },
      { name: "description", content: "Your print order has been placed successfully." },
    ],
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const orderId = `PH-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div>
      <section className="bg-hero-bg text-hero-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
            <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          </motion.div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">Order Confirmed! 🎉</h1>
          <p className="mt-3 text-hero-foreground/70 text-lg">Thank you for your order. We're getting started on your prints.</p>
          <p className="mt-2 font-mono text-cta text-xl font-bold">Order #{orderId}</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-heading text-lg font-bold mb-4">Order Status</h3>
            <OrderTracker />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-heading text-lg font-bold mb-4">What's Next?</h3>
            <div className="space-y-4">
              {[
                { icon: <Mail className="h-5 w-5 text-cta" />, title: "Confirmation Email", desc: "A confirmation email with your order details has been sent." },
                { icon: <CheckCircle className="h-5 w-5 text-cta" />, title: "File Check", desc: "Our team will review your artwork and confirm it's print-ready within 2 hours." },
                { icon: <Package className="h-5 w-5 text-cta" />, title: "Printing & Delivery", desc: "Once approved, your order will be printed and shipped. You'll receive a tracking link via email." },
              ].map(step => (
                <div key={step.title} className="flex gap-3">
                  {step.icon}
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-heading text-lg font-bold mb-3">Sample Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-medium">#{orderId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">A3 Gloss Poster × 100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="inline-flex items-center gap-1 text-cta font-medium">🔄 Printing in Progress</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. Delivery</span><span className="font-medium">Tomorrow</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-mono font-bold text-cta">AUD $89.00</span></div>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/track" search={{ id: orderId }}><Button variant="cta" size="lg">Track This Order →</Button></Link>
            <Link to="/products"><Button variant="outline" size="lg">Order More Products</Button></Link>
            <Link to="/"><Button variant="outline" size="lg">Back to Home</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
