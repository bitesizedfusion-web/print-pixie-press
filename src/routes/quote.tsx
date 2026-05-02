import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Upload, Ruler, Truck, Sparkles, Package, MapPin, 
  Image as ImageIcon, ChevronRight, User, Building, 
  Mail, Phone, Layers, Clock, CheckCircle2, ArrowRight, Home, Palette
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
  "Flyers and leaflets", "Business cards", "Brochures and booklets",
  "Stickers and labels", "Paper bags", "Pizza boxes", "Packaging boxes",
  "Food Packaging", "Gift Boxes", "Books and magazines", "Posters and banners",
  "Menus", "Labels", "Custom printing", "Custom packaging"
];

const deliveryOptions = [
  { id: "pickup", label: "Pickup", desc: "Collect from our studio" },
  { id: "standard", label: "Standard Delivery", desc: "Reliable shipping" },
  { id: "express", label: "Express Delivery", desc: "Fastest turnaround" }
];

const urgencyOptions = [
  { id: "urgent", label: "Urgent", desc: "Immediate priority" },
  { id: "required", label: "Required by date", desc: "Specific deadline" },
  { id: "none", label: "No Deadline", desc: "No specific date" }
];

const imageSlots = [
  { id: "front", label: "Front Side" }, { id: "back", label: "Back Side" },
  { id: "top", label: "Top Side" }, { id: "bottom", label: "Bottom Side" },
  { id: "left", label: "Left Side" }, { id: "right", label: "Right Side" }
];

function GetQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", surname: "", companyName: "", email: "", mobile: "", state: "", postcode: "",
    productName: "", width: "", length: "", height: "", depth: "", quantity: "",
    material: "", color: "", finishing: "", delivery: "standard", urgency: "none",
    requiredDate: "", details: ""
  });

  const [images, setImages] = useState<Record<string, File | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const handleImageChange = (id: string, file: File | null) => {
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB");
        return;
      }
      setImages(prev => ({ ...prev, [id]: file }));
      setPreviews(prev => ({ ...prev, [id]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 lg:p-16 text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-8"><CheckCircle2 className="w-10 h-10" /></div>
          <h1 className="font-heading text-4xl mb-4">Thank you.</h1>
          <p className="text-muted-foreground text-lg mb-12">We have received your quote request. Our team will contact you shortly.</p>
          <div className="space-y-4">
            <Link to="/" className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all"><Home className="w-4 h-4" /> Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <section className="pt-32 pb-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.04em] leading-none text-foreground">Get a Quote</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-7 space-y-16">
              
              <div className="space-y-8">
                <h3 className="font-heading text-2xl border-b border-border pb-4">Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Full Name *</label>
                        <input required placeholder="Your name" value={formData.firstName} onChange={e => setFormData(p => ({...p, firstName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Company Name</label>
                        <input placeholder="If applicable" value={formData.companyName} onChange={e => setFormData(p => ({...p, companyName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Email Address *</label>
                        <input required type="email" placeholder="email@example.com" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Phone / WhatsApp *</label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none pr-2 border-r border-border">
                            <span className="text-base">🇦🇺</span>
                            <span className="text-[12px] font-medium text-muted-foreground">+61</span>
                          </div>
                          <input required type="tel" placeholder="412 345 678" value={formData.mobile} onChange={e => setFormData(p => ({...p, mobile: e.target.value}))} className="w-full h-12 pl-[72px] pr-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                    </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-heading text-2xl border-b border-border pb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Product Type *</label>
                        <select required value={formData.productName} onChange={e => setFormData(p => ({...p, productName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all appearance-none">
                            <option value="">Select a product</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Width (cm)</label>
                        <input type="number" placeholder="0" value={formData.width} onChange={e => setFormData(p => ({...p, width: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Length (cm)</label>
                        <input type="number" placeholder="0" value={formData.length} onChange={e => setFormData(p => ({...p, length: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Height (cm)</label>
                        <input type="number" placeholder="0" value={formData.height} onChange={e => setFormData(p => ({...p, height: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Depth (cm)</label>
                        <input type="number" placeholder="0" value={formData.depth} onChange={e => setFormData(p => ({...p, depth: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Quantity *</label>
                        <input required type="number" placeholder="0" value={formData.quantity} onChange={e => setFormData(p => ({...p, quantity: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Material / Quality</label>
                        <input placeholder="e.g. 350gsm Silk" value={formData.material} onChange={e => setFormData(p => ({...p, material: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Colour Option</label>
                        <input placeholder="e.g. Full Colour CMYK" value={formData.color} onChange={e => setFormData(p => ({...p, color: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Finishing Option</label>
                        <input placeholder="e.g. Matte Lamination" value={formData.finishing} onChange={e => setFormData(p => ({...p, finishing: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                    </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-heading text-2xl border-b border-border pb-4">Logistics & Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Delivery Option</label>
                        <div className="space-y-2">
                            {deliveryOptions.map(o => (
                                <button key={o.id} type="button" onClick={() => setFormData(p => ({...p, delivery: o.id}))} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.delivery === o.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-card border-border hover:border-foreground/30"}`}>
                                    <div className="text-sm font-semibold">{o.label}</div>
                                    <div className={`text-[10px] mt-1 ${formData.delivery === o.id ? "text-background/70" : "text-muted-foreground"}`}>{o.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Urgency / Deadline</label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {urgencyOptions.map(o => (
                                    <button key={o.id} type="button" onClick={() => setFormData(p => ({...p, urgency: o.id}))} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.urgency === o.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-card border-border hover:border-foreground/30"}`}>
                                        <div className="text-sm font-semibold">{o.label}</div>
                                        <div className={`text-[10px] mt-1 ${formData.urgency === o.id ? "text-background/70" : "text-muted-foreground"}`}>{o.desc}</div>
                                    </button>
                                ))}
                            </div>
                            
                            {formData.urgency === 'required' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2 pt-2"
                                >
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pl-1">Select Deadline *</label>
                                    <div className="relative">
                                        <input 
                                            type="date" 
                                            required={formData.urgency === 'required'}
                                            value={formData.requiredDate} 
                                            onChange={e => setFormData(p => ({...p, requiredDate: e.target.value}))} 
                                            className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium text-foreground appearance-none cursor-pointer"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">State *</label>
                        <select required value={formData.state} onChange={e => setFormData(p => ({...p, state: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all appearance-none">
                            <option value="">Select State</option>
                            {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Postcode *</label>
                        <input required placeholder="e.g. 2000" value={formData.postcode} onChange={e => setFormData(p => ({...p, postcode: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Product Details & Special Instructions</label>
                <textarea rows={5} placeholder="Tell us more about your design requirements, colour specifics, paper type, and any other instructions." value={formData.details} onChange={e => setFormData(p => ({...p, details: e.target.value}))} className="w-full p-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none font-medium" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-40 space-y-8">
                <div className="p-8 rounded-3xl bg-secondary/30 border border-border space-y-6">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"><ImageIcon className="h-4 w-4"/> Upload Design / Images</div>
                    <div className="grid grid-cols-2 gap-3">
                        {imageSlots.map(s => (
                            <label key={s.id} className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-background hover:bg-muted/50 hover:border-muted-foreground/40 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                                {previews[s.id] ? (
                                    <img src={previews[s.id]!} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{s.label}</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={e => handleImageChange(s.id, e.target.files?.[0] || null)} />
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full h-16 rounded-full bg-gradient-brand text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                    Submit Quote Request <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
