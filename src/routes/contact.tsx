import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("print_inquiries").insert({
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      message: formData.message,
      status: "pending",
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
      toast.success("Message sent successfully!");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl mb-4">Message Sent</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for contacting S&S Printers. We have received your message and will get back
            to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="h-12 px-8 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-16 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Contact Us
          </div>
          <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.96] tracking-[-0.04em] text-foreground max-w-3xl">
            Have a question?
            <br />
            <span className="italic text-muted-foreground">Send us a message.</span>
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Name*
                  </label>
                  <input
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Email*
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Phone / WhatsApp
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none pr-2 border-r border-border">
                    <span className="text-base">🇦🇺</span>
                    <span className="text-[12px] font-medium text-muted-foreground">+61</span>
                  </div>
                  <input
                    placeholder="412 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full h-12 pl-[72px] pr-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Message*
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your message here"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full p-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-14 px-10 rounded-full bg-gradient-brand text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 space-y-12">
            <div className="space-y-6">
              <h3 className="font-heading text-2xl">Or Email Us</h3>
              <a
                href="mailto:sandsprinters26@gmail.com"
                className="flex items-center gap-4 p-6 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Direct Email
                  </div>
                  <div className="font-medium">sandsprinters26@gmail.com</div>
                </div>
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-secondary/50 border border-border">
              <MessageSquare className="w-8 h-8 text-muted-foreground mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team usually responds within 2-4 business hours. For urgent quotes, please use
                our{" "}
                <a
                  href="/quote"
                  className="text-foreground underline decoration-border hover:decoration-foreground"
                >
                  Get a Quote
                </a>{" "}
                form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
