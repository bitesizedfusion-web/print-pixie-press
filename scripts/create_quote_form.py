import os

# Define the quote.tsx content (no changes needed to this part)
quote_content = """import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Upload, 
  Send, 
  Ruler, 
  Truck, 
  Sparkles, 
  Package, 
  MapPin, 
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/quote")({
  component: GetQuotePage,
});

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease },
};

const products = [
  "Business Cards",
  "Flyers & Leaflets",
  "Posters",
  "Brochures",
  "Paper Bags",
  "Custom Boxes",
  "Labels & Stickers",
  "Envelopes",
  "Letterheads"
];

const qualityOptions = [
  { id: "standard", label: "Standard", desc: "Reliable, cost-effective everyday quality." },
  { id: "premium", label: "Premium", desc: "Heavy-weight stock with refined finishes." },
  { id: "luxury", label: "Luxury", desc: "The finest textures and artisanal details." }
];

const deliveryOptions = [
  { id: "standard", label: "Standard", desc: "5-7 business days" },
  { id: "express", label: "Express", desc: "2-3 business days" },
  { id: "overnight", label: "Next Day", desc: "Dispatched within 24h" }
];

const imageSlots = [
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "inside", label: "Inside (Vito)" },
  { id: "top", label: "Top View" },
  { id: "right", label: "Right Side" },
  { id: "left", label: "Left Side" }
];

function GetQuotePage() {
  const [formData, setFormData] = useState({
    productName: "",
    postcode: "",
    width: "",
    length: "",
    quality: "standard",
    delivery: "standard",
    details: ""
  });

  const [images, setImages] = useState<Record<string, File | null>>({
    front: null,
    back: null,
    inside: null,
    top: null,
    right: null,
    left: null
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    front: null,
    back: null,
    inside: null,
    top: null,
    right: null,
    left: null
  });

  const handleImageChange = (id: string, file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setImages(prev => ({ ...prev, [id]: file }));
      setPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.postcode) {
      toast.error("Please fill in the required fields");
      return;
    }
    
    console.log("Submitting Quote Request:", { ...formData, images });
    toast.success("Quote request submitted successfully! We'll be in touch soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
              Services — Custom Quote
            </div>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.04em] leading-[0.96] text-foreground max-w-3xl">
              Tell us what you're
              <br />
              <span className="italic text-muted-foreground">looking to create.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Product & Postcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    Product Type *
                  </label>
                  <select 
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-cta/20 focus:border-cta outline-none transition-all appearance-none font-medium"
                  >
                    <option value="">Select a product</option>
                    {products.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    Delivery Postcode *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 3000"
                    value={formData.postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-cta/20 focus:border-cta outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Ruler className="h-3.5 w-3.5" />
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    placeholder="Width"
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-cta/20 focus:border-cta outline-none transition-all font-medium"
                  />
                  <input 
                    type="number" 
                    placeholder="Length"
                    value={formData.length}
                    onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-cta/20 focus:border-cta outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Print Quality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {qualityOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, quality: opt.id }))}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        formData.quality === opt.id 
                          ? "border-foreground bg-foreground text-background shadow-md" 
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className={`text-[11px] mt-1 ${formData.quality === opt.id ? "text-background/70" : "text-muted-foreground"}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  Timeline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {deliveryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, delivery: opt.id }))}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        formData.delivery === opt.id 
                          ? "border-foreground bg-foreground text-background shadow-md" 
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className={`text-[11px] mt-1 ${formData.delivery === opt.id ? "text-background/70" : "text-muted-foreground"}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Product Details & Special Requirements
                </label>
                <textarea 
                  rows={5}
                  placeholder="Tell us more about paper stock, finishes, or specific design notes..."
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full p-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-cta/20 focus:border-cta outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Right Column: Image Uploads */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Reference Images
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Upload photos or mockups to help us understand your vision.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {imageSlots.map((slot) => (
                    <label 
                      key={slot.id}
                      className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/40 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center"
                    >
                      {previews[slot.id] ? (
                        <>
                          <img src={previews[slot.id]!} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-2 shadow-sm">
                            <Upload className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                            {slot.label}
                          </span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(slot.id, e.target.files?.[0] || null)}
                      />
                    </label>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-14 rounded-full bg-gradient-brand text-white font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 mt-8"
                >
                  Send Quote Request
                  <Send className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-4 justify-center py-6 text-[11px] text-muted-foreground font-mono uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Australia Wide</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Fast Response</span>
                </div>
              </div>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
}
"""

# Create the quote.tsx file
file_path = "c:\\\\Users\\\\Mohammed Shishir\\\\OneDrive\\\\Desktop\\\\websites\\\\austlia prating busines 2\\\\src\\\\routes\\\\quote.tsx"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(quote_content)

print(f"Created {file_path}")

# Update Navbar.tsx
navbar_path = "c:\\\\Users\\\\Mohammed Shishir\\\\OneDrive\\\\Desktop\\\\websites\\\\austlia prating busines 2\\\\src\\\\components\\\\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    navbar_content = f.read()

# Replace all occurrences of the quote link
# Desktop Link
pattern1 = 'to="/order/$product"\n              params={{ product: "flyers" }}'
replacement1 = 'to="/quote"'

# Mobile Link
pattern2 = 'to="/order/$product"\n                params={{ product: "flyers" }}'
replacement2 = 'to="/quote"'

navbar_content = navbar_content.replace(pattern1, replacement1)
navbar_content.replace(pattern2, replacement2) # This might not work if spaces are different

# Use a simpler regex-like approach or just direct replacement if we know the exact strings
# Let's try direct multiline replacement for both common patterns

navbar_content = navbar_content.replace('to="/order/$product"\n              params={{ product: "flyers" }}', 'to="/quote"')
navbar_content = navbar_content.replace('to="/order/$product"\n                params={{ product: "flyers" }}', 'to="/quote"')

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(navbar_content)

print(f"Updated {navbar_path}")
