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

const PRODUCT_CATEGORIES = [
  {
    name: "Printing Products",
    items: [
      "Flyers & Leaflets", "Business Cards", "Brochures / Pamphlets", "Posters", 
      "Stickers & Labels", "Booklets / Catalogues / Magazines", 
      "Presentation Folders", "Envelopes", "Notepads", "Calendars", 
      "Door Hangers"
    ]
  },
  {
    name: "Packaging Products",
    items: [
      "Custom Boxes (Corrugated / Carton)", "Product Packaging Boxes", 
      "Food Packaging (Boxes / Wrappers)", "Paper Bags", "Packaging Sleeves"
    ]
  },
  {
    name: "Large Format",
    items: ["Banners (Vinyl / Fabric / Roll-up)", "Pull-up / Roll-up Banners"]
  }
];

const PRODUCT_CONFIGS: Record<string, any> = {
  "Flyers & Leaflets": {
    sizes: ["A6 (105 x 148 mm)", "A5 (148 x 210 mm)", "A4 (210 x 297 mm)", "DL (99 x 210 mm)", "Customized Size"],
    materials: ["Glossy", "Matte", "Standard", "Cardstock", "Kraft Paper"],
    types: ["Single-Sided", "Double-Sided"],
    purposes: ["Business Promotion", "Event", "Restaurant / Food", "Real Estate", "Education", "Community Notice"]
  },
  "Business Cards": {
    sizes: ["Standard (90 x 54 mm)", "Square (65 x 65 mm)", "Slim (90 x 45 mm)", "Customized Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper", "Plastic / PVC"],
    thickness: ["300 GSM", "350 GSM", "400 GSM", "Custom"],
    finishes: ["Matte", "Glossy", "Velvet / Soft Touch", "Uncoated"],
    special: ["Spot UV", "Foil (Gold / Silver / Custom)", "Emboss / Deboss", "Rounded Corners", "Edge Painting", "Die-cut Shape"]
  },
  "Brochures / Pamphlets": {
    sizes: ["A4 (210 x 297 mm)", "A5 (148 x 210 mm)", "DL (99 x 210 mm)", "Customized Size"],
    folds: ["Flat (No Fold)", "Bi-fold (Half Fold)", "Tri-fold (3 Panel)", "Z-fold", "Gate Fold", "Custom Fold"],
    materials: ["Standard Paper", "Glossy", "Matte", "Recycled Paper"],
    thickness: ["120 GSM", "150 GSM", "170 GSM", "200 GSM", "Custom"],
    finishes: ["Matte", "Glossy", "Uncoated", "Laminated"]
  },
  "Posters": {
    sizes: ["A4 (210 x 297 mm)", "A3 (297 x 420 mm)", "A2 (420 x 594 mm)", "A1 (594 x 841 mm)", "A0 (841 x 1189 mm)", "Customized Size"],
    materials: ["Standard Paper", "Glossy", "Matte", "Photo Paper", "Recycled Paper"],
    thickness: ["150 GSM", "170 GSM", "200 GSM", "250 GSM", "Custom"],
    finishes: ["Matte", "Glossy", "Laminated", "Uncoated"]
  },
  "Stickers & Labels": {
    types: ["Stickers", "Product Labels", "Packaging Labels", "Barcode Labels"],
    shapes: ["Round", "Square", "Rectangle", "Oval", "Die-cut (Custom Shape)"],
    materials: ["Paper", "Vinyl", "Transparent", "Waterproof", "Kraft", "Foil (Gold / Silver)"],
    adhesives: ["Permanent", "Removable", "Strong Adhesive", "Easy Peel"],
    formats: ["Individual Cut", "Sheet", "Roll"]
  },
  "Booklets / Catalogues / Magazines": {
    sizes: ["A4", "A5", "DL", "Customized Size"],
    printTypes: ["Black & White", "Full Colour"],
    bindings: ["Saddle Stitch (Stapled)", "Perfect Binding (Spine)", "Spiral Binding", "Wire-O Binding"],
    innerMaterials: ["Standard Paper", "Matte", "Glossy", "Recycled Paper"],
    coverMaterials: ["Matte", "Glossy", "Cardstock"],
    extraFields: ["Number of Pages"]
  },
  "Presentation Folders": {
    sizes: ["A4 (Fits A4 Documents)", "A5", "Customized Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper"],
    thickness: ["300 GSM", "350 GSM", "400 GSM", "Custom"],
    finishes: ["Matte", "Glossy", "Velvet / Soft Touch", "Laminated"]
  },
  "Envelopes": {
    sizes: ["DL (110 x 220 mm)", "C5 (162 x 229 mm)", "C4 (229 x 324 mm)", "Customized Size"],
    printTypes: ["No Printing (Plain)", "Single Colour Printing", "Full Colour Printing"],
    materials: ["Standard Paper", "Premium Paper", "Recycled Paper", "Kraft Paper"],
    thickness: ["80 GSM", "90 GSM", "100 GSM", "120 GSM", "Custom"]
  },
  "Notepads": {
    sizes: ["A4", "A5", "A6", "DL", "Customized Size"],
    pagesPerPad: ["25 Pages", "50 Pages", "100 Pages", "Custom"],
    materials: ["Standard Paper", "Premium Paper", "Recycled Paper"],
    bindings: ["Top Glue", "Side Glue", "Spiral Binding"]
  },
  "Calendars": {
    types: ["Wall Calendar", "Desk Calendar", "Poster Calendar"],
    sizes: ["A4", "A3", "Customized Size"],
    bindings: ["Spiral Binding", "Saddle Stitch", "Wire-O Binding"],
    materials: ["Matte", "Glossy", "Premium Paper", "Recycled Paper"]
  },
  "Door Hangers": {
    sizes: ["Standard (90 x 210 mm)", "Large (100 x 300 mm)", "Customized Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper", "Synthetic / Waterproof"],
    thickness: ["250 GSM", "300 GSM", "350 GSM", "400 GSM", "Custom"]
  },
  "Custom Boxes (Corrugated / Carton)": {
    types: ["Corrugated Box", "Folding Carton", "Rigid Box", "Mailer Box"],
    styles: ["Regular Slotted Carton (RSC)", "Die-cut Box", "Mailer Style (Tuck Top)", "Lid & Base"],
    materials: ["Corrugated Board", "Cardboard", "Kraft Board", "Duplex Board"],
    thickness: ["Single Wall", "Double Wall", "Custom"],
    dimensions: true
  },
  "Product Packaging Boxes": {
    types: ["Folding Carton", "Rigid Box", "Sleeve Box", "Drawer Box", "Tuck End Box"],
    styles: ["Straight Tuck End", "Reverse Tuck End", "Auto Lock Bottom", "Sleeve & Tray", "Magnetic Lid"],
    materials: ["Cardboard", "Kraft Board", "Rigid Board", "Duplex Board"],
    finishes: ["Matte", "Glossy", "Laminated", "UV Coated", "Spot UV", "Foil", "Emboss / Deboss"],
    dimensions: true
  },
  "Banners (Vinyl / Fabric / Roll-up)": {
    types: ["Vinyl Banner", "Fabric Banner", "Mesh Banner", "Roll-up Banner", "Pull-up Banner"],
    materials: ["PVC Vinyl", "Fabric", "Mesh", "Blockout Material"],
    finishes: ["Eyelets", "Hemming", "Pole Pockets", "Rope & Hooks", "Stand Included (Roll-up)"]
  },
  "Pull-up / Roll-up Banners": {
    types: ["Pull-up Banner", "Roll-up Banner", "Double-Sided Roll-up", "Premium Roll-up"],
    sizes: ["Standard (850 x 2000 mm)", "1000 x 2000 mm", "1200 x 2000 mm", "Customized Size"],
    materials: ["PVC", "Fabric", "Blockout Material"]
  },
  "Food Packaging (Boxes / Wrappers)": {
    types: ["Food Boxes", "Takeaway Boxes", "Burger Boxes", "Pizza Boxes", "Food Wrappers", "Tray Liners"],
    materials: ["Food-grade Paper", "Kraft Paper", "Greaseproof Paper", "Cardboard", "Compostable"],
    finishes: ["Matte", "Glossy", "Food-safe Coating", "Grease-resistant"]
  },
  "Paper Bags": {
    types: ["Shopping Bags", "Gift Bags", "Retail Bags", "Food Carry Bags"],
    materials: ["Kraft Paper", "White Paper", "Recycled Paper", "Premium Paper"],
    handles: ["Twisted Paper Handle", "Flat Handle", "Rope Handle", "Ribbon Handle", "No Handle"]
  },
  "Packaging Sleeves": {
    types: ["Box Sleeves", "Bottle Sleeves", "Cup Sleeves", "Food Packaging Sleeves"],
    materials: ["Cardstock", "Kraft Paper", "Recycled Paper", "Premium Paper"],
    thickness: ["250 GSM", "300 GSM", "350 GSM", "400 GSM", "Custom"],
    dimensions: true
  }
};

function GetQuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'submitting' | 'success'>('idle');
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  
  const [formData, setFormData] = useState<any>({
    firstName: "", surname: "", companyName: "", email: "", mobile: "", state: "", postcode: "",
    productName: "", quantity: "", delivery: "standard", urgency: "none",
    requiredDate: "", details: ""
  });

  const [images, setImages] = useState<Record<string, File | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  const config = PRODUCT_CONFIGS[formData.productName];

  const handleInputChange = (field: string, value: any) => {
    setFormData((p: any) => ({ ...p, [field]: value }));
  };

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
        toast.success("Verification code sent to your email.");
    } else {
        toast.error("Failed to send verification email.");
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
        if (!formData.firstName || !formData.email || !formData.mobile) {
            toast.error("Please fill in all contact details.");
            return;
        }
        setStatus('verifying');
        generateAndSendOtp();
        return;
    }
    if (currentStep === 2) {
        if (!formData.productName || !formData.quantity) {
            toast.error("Please select a product and quantity.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    const adminSuccess = await sendQuoteToAdmin(formData);
    setTimeout(() => {
      setStatus('success');
      toast.success("Verified quote request submitted!");
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 2000);
  };

  const handleVerify = async () => {
    if (otp === generatedOtp) {
      toast.success("Email verified successfully!");
      setStatus('idle');
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      toast.error("Invalid code.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-32">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full bg-card border border-border rounded-3xl p-10 lg:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-foreground" />
          <div className="w-24 h-24 rounded-full bg-foreground/5 text-foreground flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 className="w-12 h-12" /></div>
          <h1 className="font-heading text-5xl mb-6">Quote Received!</h1>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            Thank you. We have received your verified request and a confirmation has been sent to <span className="text-foreground font-semibold">{formData.email}</span>.
          </p>
          <div className="space-y-4">
            <Link to="/" className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl"><Home className="w-4 h-4" /> Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-24 md:pt-40 p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-card border border-border rounded-3xl p-10 lg:p-12 text-center shadow-2xl border-t-4 border-t-foreground">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mx-auto mb-6"><MailCheck className="w-8 h-8" /></div>
                <h2 className="font-heading text-3xl mb-4">Verify Identity</h2>
                <p className="text-muted-foreground mb-8">Enter the 4-digit code sent to <span className="text-foreground font-medium">{formData.email}</span>.</p>
                <div className="space-y-6">
                    <input type="text" maxLength={4} placeholder="0000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full h-16 text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border-2 border-border bg-muted/30 focus:border-foreground focus:ring-0 transition-all outline-none" />
                    <button onClick={handleVerify} disabled={otp.length !== 4} className="w-full h-14 rounded-full bg-foreground text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg">
                        <ShieldCheck className="w-5 h-5"/> Verify & Continue
                    </button>
                    <button onClick={generateAndSendOtp} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto">
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
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input required placeholder="Full Name *" value={formData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                        <input placeholder="Company Name" value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                        <input required type="email" placeholder="Email Address *" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                        <div className="relative flex items-center">
                          <div className="absolute left-4 flex items-center gap-1.5 pointer-events-none pr-3 border-r border-border">
                            <span className="text-base">🇦🇺</span>
                            <span className="text-[12px] font-medium text-muted-foreground">+61</span>
                          </div>
                          <input required type="tel" placeholder="Mobile / WhatsApp *" value={formData.mobile} onChange={e => handleInputChange("mobile", e.target.value)} className="w-full h-14 pl-[84px] pr-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4 text-center">Project Specifications</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Select Product Category</label>
                            <select 
                                required 
                                value={formData.productName} 
                                onChange={e => handleInputChange("productName", e.target.value)} 
                                className="w-full h-16 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="">Choose a product...</option>
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <optgroup key={cat.name} label={cat.name}>
                                        {cat.items.map(item => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {formData.productName && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-muted/20 border border-border">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Quantity Required</label>
                                    <input required type="number" placeholder="Enter quantity..." value={formData.quantity} onChange={e => handleInputChange("quantity", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                                </div>

                                {config?.types && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Product Type</label>
                                        <select value={formData.type} onChange={e => handleInputChange("type", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select type...</option>
                                            {config.types.map((t: string) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.sizes && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Select Size</label>
                                        <select value={formData.size} onChange={e => handleInputChange("size", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select size...</option>
                                            {config.sizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.folds && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Fold Type</label>
                                        <select value={formData.fold} onChange={e => handleInputChange("fold", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select fold...</option>
                                            {config.folds.map((f: string) => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.bindings && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Binding Type</label>
                                        <select value={formData.binding} onChange={e => handleInputChange("binding", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select binding...</option>
                                            {config.bindings.map((b: string) => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.handles && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Handle Type</label>
                                        <select value={formData.handle} onChange={e => handleInputChange("handle", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select handle...</option>
                                            {config.handles.map((h: string) => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.materials && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Material / Paper Type</label>
                                        <select value={formData.material} onChange={e => handleInputChange("material", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select material...</option>
                                            {config.materials.map((m: string) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.thickness && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Thickness (GSM)</label>
                                        <select value={formData.thickness} onChange={e => handleInputChange("thickness", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select thickness...</option>
                                            {config.thickness.map((t: string) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.finishes && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Finish Options</label>
                                        <select value={formData.finish} onChange={e => handleInputChange("finish", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select finish...</option>
                                            {config.finishes.map((f: string) => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.printTypes && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Printing Type</label>
                                        <select value={formData.printType} onChange={e => handleInputChange("printType", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select printing type...</option>
                                            {config.printTypes.map((pt: string) => <option key={pt} value={pt}>{pt}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.pagesPerPad && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Pages per Pad</label>
                                        <select value={formData.pagesPerPad} onChange={e => handleInputChange("pagesPerPad", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select pages...</option>
                                            {config.pagesPerPad.map((p: string) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.shapes && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Select Shape</label>
                                        <select value={formData.shape} onChange={e => handleInputChange("shape", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select shape...</option>
                                            {config.shapes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.adhesives && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Adhesive Type</label>
                                        <select value={formData.adhesive} onChange={e => handleInputChange("adhesive", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select adhesive...</option>
                                            {config.adhesives.map((a: string) => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.formats && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Format</label>
                                        <select value={formData.format} onChange={e => handleInputChange("format", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select format...</option>
                                            {config.formats.map((f: string) => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.special && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Special Finishings</label>
                                        <select value={formData.specialFinish} onChange={e => handleInputChange("specialFinish", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Add special finish...</option>
                                            {config.special.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {config?.purposes && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Purpose / Use Case</label>
                                        <select value={formData.purpose} onChange={e => handleInputChange("purpose", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                            <option value="">Select purpose...</option>
                                            {config.purposes.map((p: string) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                )}
                                
                                {config?.dimensions && (
                                    <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                                        {['width', 'length', 'height'].map(dim => (
                                            <div key={dim} className="space-y-2">
                                                <label className="text-[9px] font-mono uppercase text-muted-foreground ml-2">{dim} (cm)</label>
                                                <input type="number" placeholder={dim} value={formData[dim]} onChange={e => handleInputChange(dim, e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">Delivery Details</div>
                            <div className="grid grid-cols-1 gap-4">
                                <select value={formData.state} onChange={e => handleInputChange("state", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium">
                                    <option value="">Select State (Australia)</option>
                                    {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <input placeholder="Postcode" value={formData.postcode} onChange={e => handleInputChange("postcode", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">Urgency / Deadline</div>
                            <div className="space-y-2">
                                {urgencyOptions.map(o => (
                                    <div key={o.id} className="space-y-2">
                                        <button type="button" onClick={() => handleInputChange("urgency", o.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${formData.urgency === o.id ? "bg-foreground text-background border-foreground shadow-lg" : "bg-card border-border hover:border-foreground/30"}`}>
                                            <div className="text-sm font-semibold">{o.label}</div>
                                            <div className={`text-[10px] mt-1 ${formData.urgency === o.id ? "text-background/70" : "text-muted-foreground"}`}>{o.desc}</div>
                                        </button>
                                        {o.id === 'required' && formData.urgency === 'required' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                                <input type="date" required value={formData.requiredDate} onChange={e => handleInputChange("requiredDate", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <textarea rows={4} placeholder="Additional Details / Special Instructions..." value={formData.details} onChange={e => handleInputChange("details", e.target.value)} className="w-full p-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none font-medium" />
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
                    <h4 className="font-heading text-xl mb-6 text-center text-foreground">Final Review</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Product:</span>
                            <span className="font-semibold text-right">{formData.productName}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold text-right">{formData.quantity}</span>
                        </div>
                        {Object.entries(formData).map(([key, value]) => {
                            const skip = ['firstName', 'surname', 'companyName', 'email', 'mobile', 'productName', 'quantity', 'details', 'requiredDate', 'delivery', 'urgency', 'state', 'postcode'];
                            if (skip.includes(key) || !value || value === "") return null;
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                                <div key={key} className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-muted-foreground">{label}:</span>
                                    <span className="font-semibold text-right">{value}</span>
                                </div>
                            );
                        })}
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="font-semibold text-right">{formData.firstName}</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-16 flex items-center justify-center gap-6 pt-8 border-t border-border">
                {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="max-w-md w-full h-16 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 shadow-xl">
                        Next Step <ChevronRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button type="submit" className="max-w-md w-full h-16 rounded-full bg-gradient-brand text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
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
