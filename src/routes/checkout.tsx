import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PrintMaster Australia" },
      { name: "description", content: "Complete your print order securely." },
    ],
  }),
  component: CheckoutPage,
});

const GST_RATE = 0.1;
const DELIVERY = 12.5;

function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "NSW",
    postcode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((s, i) => s + (i.subtotal ?? i.total / (1 + GST_RATE)), 0);
  const gst = +(subtotal * GST_RATE).toFixed(2);
  const total = +(subtotal + gst + DELIVERY).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setProcessing(true);

    try {
      const orderNumber = `PM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const deliveryAddress = `${form.address}, ${form.city} ${form.state} ${form.postcode}`;

      // Insert order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert([{
          order_number: orderNumber,
          user_id: user?.id ?? null,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          delivery_address: deliveryAddress,
          subtotal: +subtotal.toFixed(2),
          gst,
          delivery: DELIVERY,
          total,
          status: "pending" as const,
          paid: true, // simulated
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Insert order items
      const itemRows = items.map((i) => ({
        order_id: order.id,
        product_name: i.product.name,
        size: i.size,
        paper_type: i.paperType,
        quantity: i.quantity,
        unit_price: +(i.total / i.quantity).toFixed(2),
        total: i.total,
        notes: i.notes ?? null,
      }));
      await supabase.from("order_items").insert(itemRows);

      // Upsert customer record (best-effort)
      await supabase.from("customers").upsert(
        [{
          user_id: user?.id ?? null,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
        }],
        { onConflict: "email", ignoreDuplicates: false },
      );

      // Send confirmation email (fire-and-forget)
      supabase.functions
        .invoke("send-order-confirmation", {
          body: {
            to: form.email,
            customer_name: form.name,
            order_number: orderNumber,
            items: itemRows.map((r) => ({
              product_name: r.product_name,
              size: r.size,
              paper_type: r.paper_type,
              quantity: r.quantity,
              total: r.total,
            })),
            subtotal: +subtotal.toFixed(2),
            gst,
            delivery: DELIVERY,
            total,
          },
        })
        .catch((err) => console.error("Email send failed:", err));

      // Log activity
      if (user) {
        await supabase.from("activity_log").insert([{
          user_id: user.id,
          user_email: user.email,
          action: "ORDER_PLACED",
          entity_type: "order",
          entity_id: order.id,
          details: { order_number: orderNumber, total },
        }]);
      }

      toast.success(`Order ${orderNumber} placed!`);
      clearCart();
      navigate({ to: "/order-confirmation", search: { order: orderNumber } as never });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold">Your cart is empty</h2>
          <a href="/products" className="text-cta hover:underline mt-2 inline-block">Browse products</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-hero-bg text-hero-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">Secure Checkout</h1>
          <p className="mt-2 text-hero-foreground/70">Complete your order details</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-heading text-lg font-bold mb-4">Shipping Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                    <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                    <div className="sm:col-span-2"><Field label="Street Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required /></div>
                    <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                        <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none">
                          {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <Field label="Postcode" value={form.postcode} onChange={(v) => setForm({ ...form, postcode: v })} required />
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-cta" /> Payment (Demo)
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">This is a demo checkout — no real card will be charged.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><Field label="Name on Card" value={form.cardName} onChange={(v) => setForm({ ...form, cardName: v })} required /></div>
                    <div className="sm:col-span-2"><Field label="Card Number" placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={(v) => setForm({ ...form, cardNumber: v })} mono required /></div>
                    <Field label="Expiry" placeholder="MM/YY" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} mono required />
                    <Field label="CVV" placeholder="123" value={form.cvv} onChange={(v) => setForm({ ...form, cvv: v })} mono required />
                  </div>
                </motion.div>
              </div>

              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h3 className="font-heading text-lg font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                        <span className="font-mono">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>GST (10%)</span><span className="font-mono">${gst.toFixed(2)}</span></div>
                      <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="font-mono">${DELIVERY.toFixed(2)}</span></div>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-lg">TOTAL</span>
                        <span className="font-mono text-2xl font-bold text-cta">AUD ${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" variant="cta" size="lg" className="w-full mt-6" disabled={processing}>
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-cta-foreground/30 border-t-cta-foreground rounded-full" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay AUD ${total.toFixed(2)}</span>
                    )}
                  </Button>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" /> Confirmation email sent on order
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder, mono }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-cta/50 focus:border-cta outline-none ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
