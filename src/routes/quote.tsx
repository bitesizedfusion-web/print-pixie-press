import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Upload, Ruler, Truck, Sparkles, Package, MapPin, 
  Image as ImageIcon, ChevronRight, User, Building, 
  Mail, Phone, Layers, Clock, CheckCircle2, ArrowRight, Home, Palette, Calendar
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

import { Loader2, MailCheck, ShieldCheck, RefreshCw } from "lucide-react";

import { sendVerificationEmail, sendQuoteToAdmin } from "@/lib/email";

function GetQuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'submitting' | 'success'>('idle');
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  
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

  const generateAndSendOtp = async () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    
    const success = await sendVerificationEmail(formData.email, code);
    if (success) {
        console.log("OTP Sent to " + formData.email + ": " + code);
        toast.success("Verification code sent to your email from our domain.");
    } else {
        toast.error("Failed to send verification email. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
        if (!formData.firstName || !formData.email || !formData.productName || !formData.quantity) {
            toast.error("Please fill in all required fields.");
            return;
        }
    }
    setCurrentStep(p => Math.min(p + 1, 3));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const prevStep = () => {
    setCurrentStep(p => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please provide an email address");
      return;
    }
    setStatus('verifying');
    generateAndSendOtp();
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleVerify = async () => {
    if (otp === generatedOtp) {
      setStatus('submitting');
      
      const adminSuccess = await sendQuoteToAdmin(formData);
      
      setTimeout(() => {
        setStatus('success');
        toast.success("Quote request submitted and verified!");
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 2000);
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-32">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 lg:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-brand" />
          <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 className="w-12 h-12" /></div>
          <h1 className="font-heading text-5xl mb-6">Quote Received!</h1>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            Thank you for choosing S&S Printing and Packaging. We have received your verified request and a confirmation has been sent to <span className="text-foreground font-semibold">{formData.email}</span>.
            <br/><br/>
            Our team will review your specifications and contact you with a formal quotation shortly.
          </p>
          <div className="space-y-4">
            <Link to="/" className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl"><Home className="w-4 h-4" /> Back to Home</Link>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Business hours: Mon - Fri, 9am - 6pm</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-24 md:pt-40 p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-card border border-border rounded-3xl p-10 lg:p-12 text-center shadow-2xl border-t-4 border-t-brand">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6"><MailCheck className="w-8 h-8" /></div>
                <h2 className="font-heading text-3xl mb-4">Verify your Email</h2>
                <p className="text-muted-foreground mb-8">We've sent a 4-digit verification code to <span className="text-foreground font-medium">{formData.email}</span>. Please enter it below to submit your quote.</p>
                
                <div className="space-y-6">
                    <input 
                        type="text" 
                        maxLength={4}
                        placeholder="0000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-16 text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border-2 border-border bg-muted/30 focus:border-brand focus:ring-0 transition-all outline-none"
                    />
                    
                    <button 
                        onClick={handleVerify}
                        disabled={otp.length !== 4}
                        className="w-full h-14 rounded-full bg-gradient-brand text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all shadow-lg"
                    >
                        {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5"/> Verify & Submit</>}
                    </button>

                    <button 
                        onClick={generateAndSendOtp}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-3 h-3" /> Resend Code
                    </button>
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
            <div className="mt-12 flex items-center justify-center gap-4 max-w-md mx-auto">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 flex flex-col items-center gap-2">
                        <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${currentStep >= s ? "bg-foreground" : "bg-muted"}`} />
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${currentStep === s ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                            Step 0{s}
                        </span>
                    </div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                >
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
                            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Product Name *</label>
                            <input required placeholder="please type your product name" value={formData.productName} onChange={e => setFormData(p => ({...p, productName: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Quantity *</label>
                            <input required type="number" placeholder="0" value={formData.quantity} onChange={e => setFormData(p => ({...p, quantity: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Material / Quality</label>
                            <input placeholder="e.g. 350gsm Silk" value={formData.material} onChange={e => setFormData(p => ({...p, material: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                >
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4">Dimensions & Logistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {['width', 'length', 'height', 'depth'].map((dim) => (
                            <div key={dim} className="space-y-2">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{dim} (cm)</label>
                                <input type="number" placeholder="0" value={(formData as any)[dim]} onChange={e => setFormData(p => ({...p, [dim]: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                            </div>
                        ))}
                    </div>
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
                            <div className="space-y-2">
                                {urgencyOptions.map(o => (
                                    <div key={o.id} className="space-y-2">
                                        <button type="button" onClick={() => setFormData(p => ({...p, urgency: o.id}))} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.urgency === o.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-card border-border hover:border-foreground/30"}`}>
                                            <div className="text-sm font-semibold">{o.label}</div>
                                            <div className={`text-[10px] mt-1 ${formData.urgency === o.id ? "text-background/70" : "text-muted-foreground"}`}>{o.desc}</div>
                                        </button>
                                        {o.id === 'required' && formData.urgency === 'required' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden -mt-1">
                                                <div className="relative group px-1 pb-2">
                                                    <input type="date" required value={formData.requiredDate} onChange={e => setFormData(p => ({...p, requiredDate: e.target.value}))} className="w-full h-14 pl-5 pr-12 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium text-foreground appearance-none cursor-pointer shadow-sm" />
                                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 -mt-1 h-5 w-5 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4">Special Instructions</h3>
                    <textarea rows={4} placeholder="Any other details..." value={formData.details} onChange={e => setFormData(p => ({...p, details: e.target.value}))} className="w-full p-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none font-medium" />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                >
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4">Upload Design / Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imageSlots.map(s => (
                            <label key={s.id} className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-background hover:bg-muted/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4">
                                {previews[s.id] ? (
                                    <img src={previews[s.id]!} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-foreground mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={e => handleImageChange(s.id, e.target.files?.[0] || null)} />
                            </label>
                        ))}
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl bg-secondary/30 border border-border">
                    <h4 className="font-heading text-xl mb-4 text-center text-foreground">Final Review</h4>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                        <span className="text-muted-foreground">Product:</span><span className="font-semibold">{formData.productName}</span>
                        <span className="text-muted-foreground">Quantity:</span><span className="font-semibold">{formData.quantity}</span>
                        <span className="text-muted-foreground">Contact:</span><span className="font-semibold">{formData.firstName}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-16 flex items-center justify-between gap-6 pt-8 border-t border-border">
                {currentStep > 1 ? (
                    <button type="button" onClick={prevStep} className="flex-1 h-16 rounded-full border border-border text-foreground font-semibold hover:bg-muted transition-all flex items-center justify-center gap-3">
                        Back
                    </button>
                ) : <div className="flex-1" />}
                
                {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="flex-1 h-16 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-xl">
                        Next Step <ChevronRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button type="submit" className="flex-[2] h-16 rounded-full bg-gradient-brand text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                        {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Quote Request <ArrowRight className="h-5 w-5" /></>}
                    </button>
                )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
