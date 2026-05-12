import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="font-heading text-5xl lg:text-7xl font-light mb-12">Terms & Conditions</h1>

          <div className="prose prose-neutral max-w-none space-y-12 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">1. Introduction</h2>
              <p>
                Welcome to S&S Printers. By using our website and services, you agree to comply with
                and be bound by the following terms and conditions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">2. Quotations and Orders</h2>
              <p>
                All quotations are valid for 30 days unless otherwise stated. Orders are processed
                upon receipt of deposit or full payment as specified in your quotation. S&S Printers
                reserves the right to adjust prices if design requirements change after the initial
                quote.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">3. Design and Artwork</h2>
              <p>
                Customers are responsible for the accuracy of design files, spelling, and layouts.
                We recommend providing print-ready PDFs in CMYK color format. S&S Printers is not
                liable for errors in customer-provided artwork.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">4. Production and Turnaround</h2>
              <p>
                Production times are estimates and start once artwork is approved and payment is
                received. While we aim for fast delivery, external factors like shipping delays are
                beyond our control.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">5. Payments</h2>
              <p>
                We accept Bank Transfer, PayID, and Debit/Credit Cards. Full payment or a 50%
                deposit (for bulk orders) is required before production begins.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">6. Delivery and Pickup</h2>
              <p>
                We offer Australia-wide delivery. Shipping costs are calculated based on your
                postcode and order volume. Pickup from our studio is available by appointment.
              </p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl font-heading text-foreground">Contact Us</h2>
              <p>For any questions regarding our terms, please contact us:</p>
              <p className="font-medium text-foreground">Email: S&S Printers</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
