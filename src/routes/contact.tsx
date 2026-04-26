import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Printmaster" },
      {
        name: "description",
        content:
          "Get in touch about a custom quote, bulk order or general enquiry. We respond within 24 hours.",
      },
      { property: "og:title", content: "Contact — Printmaster" },
      { property: "og:description", content: "Talk to a printer. We respond within 24 hours." },
    ],
  }),
  component: ContactPage,
});

const subjects = [
  "Custom Print Quote",
  "Bulk / Wholesale Order",
  "Flyers & Brochures",
  "Posters & Banners",
  "Business Cards",
  "General Enquiry",
  "Technical Help",
  "Order Issue",
];

const ease = [0.32, 0.72, 0, 1] as const;

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from("print_inquiries").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Inquiry sent. We'll respond within 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send inquiry");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full h-11 border-0 border-b border-border bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Contact
          </div>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.045em] text-foreground max-w-5xl">
            Talk to a
            <br />
            <span className="italic text-muted-foreground">printer.</span>
          </h1>
          <p className="mt-10 max-w-xl text-base text-muted-foreground leading-relaxed">
            For custom quotes, bulk orders, or anything else. We answer the
            phone and reply to every email within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-7"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-8">
              Send a message
            </div>
            {submitted ? (
              <div className="border border-border rounded-2xl p-12 text-center">
                <div className="font-heading text-3xl font-light tracking-[-0.02em] text-foreground">
                  Message received.
                </div>
                <p className="mt-4 text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                      Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@studio.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                      Phone (optional)
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="04xx xxx xxx"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                      Subject
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="">Choose a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project — quantity, size, deadline, anything we should know."
                    className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center h-12 px-8 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/85 transition-all disabled:opacity-50"
                >
                  {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send message
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="lg:col-span-4 lg:col-start-9 space-y-10"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Find us
            </div>
            {[
              { label: "Email", value: "info@printmaster.com.au", href: "mailto:info@printmaster.com.au" },
              { label: "Phone", value: "1300 555 123", href: "tel:1300555123" },
              { label: "Studio", value: "Level 2, 123 Print St,\nSydney NSW 2000" },
              { label: "Hours", value: "Monday – Friday\n8am – 6pm AEST" },
            ].map((info) => (
              <div key={info.label} className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  {info.label}
                </div>
                {info.href ? (
                  <a
                    href={info.href}
                    className="font-heading text-xl font-light tracking-[-0.02em] text-foreground hover:text-cta transition-colors whitespace-pre-line"
                  >
                    {info.value}
                  </a>
                ) : (
                  <div className="font-heading text-xl font-light tracking-[-0.02em] text-foreground whitespace-pre-line">
                    {info.value}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}