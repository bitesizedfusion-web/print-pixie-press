import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="font-heading text-5xl lg:text-7xl font-light mb-12">Privacy Policy</h1>
          
          <div className="prose prose-neutral max-w-none space-y-12 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <p className="text-lg text-foreground">At S&S Printing and Packaging, we respect your privacy and protect your personal information.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Information We Collect</h2>
              <p>When you contact us or request a quote, we may collect:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Postcode</li>
                <li>Product details</li>
                <li>Uploaded images or design files</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to your enquiry</li>
                <li>Prepare quotations</li>
                <li>Process printing or packaging requests</li>
                <li>Contact you about your order</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">File Uploads</h2>
              <p>Any images, artwork, logos or design files you upload are used only for your quotation or order request.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Sharing Your Information</h2>
              <p>We do not sell your personal information. We only share details when required to complete your order, arrange delivery, or comply with legal requirements.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Email Communication</h2>
              <p>We may contact you by email, phone or WhatsApp regarding your enquiry, quote or order.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading text-foreground">Data Security</h2>
              <p>We take reasonable steps to keep your personal information safe and secure.</p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl font-heading text-foreground">Contact Us</h2>
              <p>For any privacy questions, please contact us:</p>
              <p className="font-medium text-foreground">Email: sandsprinters26@gmail.com</p>
            </section>

            <section className="text-sm italic">
              <p>Policy Update: This Privacy Policy may be updated from time to time.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
