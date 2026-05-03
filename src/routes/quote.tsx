import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Upload, Ruler, Truck, Sparkles, Package, MapPin, 
  Image as ImageIcon, ChevronRight, User, Building, 
  Mail, MailCheck, ShieldCheck, Phone, Layers, Clock, CheckCircle2, ArrowRight, Home, Palette, Calendar, RefreshCw, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { sendVerificationEmail, sendQuoteToAdmin } from "@/lib/email";
import { supabase } from "@/integrations/supabase/client";

const urgencyOptions = [
  { id: 'none', label: 'No Rush', desc: 'Standard turnaround time (3-5 business days)' },
  { id: 'asap', label: 'As Soon As Possible', desc: 'Prioritize my order for faster delivery' },
  { id: 'required', label: 'Specific Deadline', desc: 'I need this by a certain date' }
];

const imageSlots = [
  { id: 'front', label: 'Front View' },
  { id: 'back', label: 'Back View' },
  { id: 'top', label: 'Top View' },
  { id: 'bottom', label: 'Bottom View' },
  { id: 'left', label: 'Side 1' },
  { id: 'right', label: 'Side 2' }
];

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
      "Banners (Vinyl / Fabric / Roll-up)", "Stickers & Labels", 
      "Booklets / Catalogues / Magazines", "NCR / Carbonless Forms", 
      "Envelopes", "Notepads", "Calendars", "Postcards", 
      "Door Hangers", "Pull-up / Roll-up Banners"
    ]
  },
  {
    name: "Packaging Products",
    items: [
      "Custom Boxes (Corrugated / Carton)", "Product Packaging Boxes", 
      "Food Packaging (Boxes / Wrappers)", "Paper Bags", 
      "Labels for Packaging", "Packaging Sleeves", "Other"
    ]
  }
];

const PRODUCT_CONFIGS: Record<string, any> = {
  "Flyers & Leaflets": {
    sizes: ["A6 (105 x 148 mm)", "A5 (148 x 210 mm)", "A4 (210 x 297 mm)", "DL (99 x 210 mm)", "Customised Size"],
    materials: ["Glossy", "Matte", "Standard", "Cardstock", "Kraft Paper"],
    types: ["Single-Sided", "Double-Sided"],
    purposes: ["Business Promotion", "Event", "Restaurant / Food", "Real Estate", "Education", "Community Notice"]
  },
  "Business Cards": {
    sizes: ["Standard (90 x 54 mm)", "Square (65 x 65 mm)", "Slim (90 x 45 mm)", "Customised Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper", "Plastic / PVC"],
    thickness: ["300 GSM", "350 GSM", "400 GSM", "Customised"],
    finishes: ["Matte", "Glossy", "Velvet / Soft Touch", "Uncoated"],
    special: ["Spot UV", "Foil (Gold / Silver / Customised)", "Emboss / Deboss", "Rounded Corners", "Edge Painting", "Die-cut Shape"]
  },
  "Brochures / Pamphlets": {
    sizes: ["A4 (210 x 297 mm)", "A5 (148 x 210 mm)", "DL (99 x 210 mm)", "Customised Size"],
    folds: ["Flat (No Fold)", "Bi-fold (Half Fold)", "Tri-fold (3 Panel)", "Z-fold", "Gate Fold", "Customised Fold"],
    materials: ["Standard Paper", "Glossy", "Matte", "Recycled Paper"],
    thickness: ["120 GSM", "150 GSM", "170 GSM", "200 GSM", "Customised"],
    finishes: ["Matte", "Glossy", "Uncoated", "Laminated"]
  },
  "Posters": {
    sizes: ["A4 (210 x 297 mm)", "A3 (297 x 420 mm)", "A2 (420 x 594 mm)", "A1 (594 x 841 mm)", "A0 (841 x 1189 mm)", "Customised Size"],
    materials: ["Standard Paper", "Glossy", "Matte", "Photo Paper", "Recycled Paper"],
    thickness: ["150 GSM", "170 GSM", "200 GSM", "250 GSM", "Customised"],
    finishes: ["Matte", "Glossy", "Laminated", "Uncoated"]
  },
  "Stickers & Labels": {
    types: ["Stickers", "Product Labels", "Packaging Labels", "Barcode Labels"],
    shapes: ["Round", "Square", "Rectangle", "Oval", "Die-cut (Customised Shape)"],
    materials: ["Paper", "Vinyl", "Transparent", "Waterproof", "Kraft", "Foil (Gold / Silver)"],
    adhesives: ["Permanent", "Removable", "Strong Adhesive", "Easy Peel"],
    formats: ["Individual Cut", "Sheet", "Roll"]
  },
  "Booklets / Catalogues / Magazines": {
    sizes: ["A4", "A5", "DL", "Customised Size"],
    printTypes: ["Black & White", "Full Colour"],
    bindings: ["Saddle Stitch (Stapled)", "Perfect Binding (Spine)", "Spiral Binding", "Wire-O Binding"],
    innerMaterials: ["Standard Paper", "Matte", "Glossy", "Recycled Paper"],
    coverMaterials: ["Matte", "Glossy", "Cardstock"],
    extraFields: ["Number of Pages"]
  },
  "Presentation Folders": {
    sizes: ["A4 (Fits A4 Documents)", "A5", "Customised Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper"],
    thickness: ["300 GSM", "350 GSM", "400 GSM", "Customised"],
    finishes: ["Matte", "Glossy", "Velvet / Soft Touch", "Laminated"]
  },
  "Envelopes": {
    sizes: ["DL (110 x 220 mm)", "C5 (162 x 229 mm)", "C4 (229 x 324 mm)", "Customised Size"],
    printTypes: ["No Printing (Plain)", "Single Colour Printing", "Full Colour Printing"],
    materials: ["Standard Paper", "Premium Paper", "Recycled Paper", "Kraft Paper"],
    thickness: ["80 GSM", "90 GSM", "100 GSM", "120 GSM", "Customised"]
  },
  "Notepads": {
    sizes: ["A4", "A5", "A6", "DL", "Customised Size"],
    pagesPerPad: ["25 Pages", "50 Pages", "100 Pages", "Customised"],
    materials: ["Standard Paper", "Premium Paper", "Recycled Paper"],
    bindings: ["Top Glue", "Side Glue", "Spiral Binding"]
  },
  "Calendars": {
    types: ["Wall Calendar", "Desk Calendar", "Poster Calendar"],
    sizes: ["A4", "A3", "Customised Size"],
    bindings: ["Spiral Binding", "Saddle Stitch", "Wire-O Binding"],
    materials: ["Matte", "Glossy", "Premium Paper", "Recycled Paper"]
  },
  "Door Hangers": {
    sizes: ["Standard (90 x 210 mm)", "Large (100 x 300 mm)", "Customised Size"],
    materials: ["Standard Card", "Premium Cardstock", "Recycled Paper", "Kraft Paper", "Synthetic / Waterproof"],
    thickness: ["250 GSM", "300 GSM", "350 GSM", "400 GSM", "Customised"]
  },
  "Customised Boxes (Corrugated / Carton)": {
    types: ["Corrugated Box", "Folding Carton", "Rigid Box", "Mailer Box"],
    styles: ["Regular Slotted Carton (RSC)", "Die-cut Box", "Mailer Style (Tuck Top)", "Lid & Base"],
    materials: ["Corrugated Board", "Cardboard", "Kraft Board", "Duplex Board"],
    thickness: ["Single Wall", "Double Wall", "Customised"],
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
    sizes: ["Standard (850 x 2000 mm)", "1000 x 2000 mm", "1200 x 2000 mm", "Customised Size"],
    materials: ["PVC", "Fabric", "Blockout Material"]
  },
  "Food Packaging (Boxes / Wrappers)": {
    types: ["Food Boxes", "Takeaway Boxes", "Burger Boxes", "Pizza Boxes", "Food Wrappers", "Tray Liners"],
    materials: ["Food-grade Paper", "Kraft Paper", "Greaseproof Paper", "Cardboard", "Compostable"],
    finishes: ["Matte", "Glossy", "Food-safe Coating", "Grease-resistant"]
  },
  "Paper Bags": {
    types: ["Shopping Bags", "Gift Bags", "Retail Bags", "Food Carry Bags", "Customised Type"],
    sizes: ["Customised Size"],
    dimensions: true,
    printTypes: ["Plain (No Printing)", "Single Colour Printing", "Full Colour Printing"],
    materials: ["Kraft Paper", "White Paper", "Recycled Paper", "Premium Paper", "Other"],
    thickness: ["120 GSM", "150 GSM", "200 GSM", "250 GSM", "Customised"],
    handles: ["Twisted Paper Handle", "Flat Handle", "Rope Handle", "Ribbon Handle", "Die-cut Handle", "No Handle"],
    finishes: ["Matte", "Glossy", "Laminated", "UV Coated", "Foil", "Customised"],
    options: ["Reinforced Base", "Inner Lamination", "Window Cut", "Customised"],
    purposes: ["Retail Use", "Shopping", "Gift Packaging", "Food Packaging", "Event / Promotion", "Branding", "Other"]
  },
  "Packaging Sleeves": {
    types: ["Box Sleeves", "Bottle Sleeves", "Cup Sleeves", "Food Packaging Sleeves"],
    materials: ["Cardstock", "Kraft Paper", "Recycled Paper", "Premium Paper"],
    thickness: ["250 GSM", "300 GSM", "350 GSM", "400 GSM", "Customised"],
    dimensions: true
  },
  "NCR / Carbonless Forms": {
    types: ["Invoice Books", "Receipt Books", "Purchase Order Books", "Delivery Dockets"],
    sizes: ["A4", "A5", "A6", "DL"],
    parts: ["2-Part (Duplicate)", "3-Part (Triplicate)", "4-Part (Quadruplicate)"],
    colors: ["White/Yellow", "White/Pink/Yellow", "Custom Colors"],
    bindings: ["Padded at Head", "Padded at Left", "Perforated with Crocodile Board Cover"]
  },
  "Postcards": {
    sizes: ["Standard (148 x 105 mm)", "Large (210 x 148 mm)", "DL (210 x 99 mm)"],
    materials: ["Standard Glossy", "Premium Matte", "Recycled Cardstock"],
    thickness: ["300 GSM", "350 GSM", "400 GSM"],
    finishes: ["Gloss Lamination (Front)", "Matte Lamination (Front)", "Uncoated (Back for Writing)"]
  },
  "Labels for Packaging": {
    types: ["Product Labels", "Shipping Labels", "Warning Labels"],
    shapes: ["Round", "Square", "Rectangle", "Oval", "Die-cut"],
    materials: ["Paper", "Vinyl (Waterproof)", "Transparent", "Foil"],
    finishes: ["Matte", "Glossy", "Uncoated"]
  },
  "Other": {
    dimensions: true
  }
};

const CustomSelect = ({ label, options, value, onChange, placeholder, groups }: { 
    label?: string, 
    options?: string[], 
    value: string, 
    onChange: (val: string) => void, 
    placeholder: string,
    groups?: { name: string, items: string[] }[]
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative space-y-3">
            {label && <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-16 px-6 rounded-2xl border transition-all duration-500 flex items-center justify-between text-left font-medium group ${
                        isOpen ? "border-foreground bg-card shadow-2xl scale-[1.02]" : "border-border bg-card hover:border-foreground/30 hover:shadow-lg"
                    }`}
                >
                    <span className={!value ? "text-muted-foreground" : "text-foreground font-semibold"}>
                        {value || placeholder}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90 group-hover:text-foreground transition-colors" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Full-screen Backdrop Blur */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-md"
                            />
                            
                            {/* Pop Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-lg max-h-[70vh] overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col"
                            >
                                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                                    <div>
                                        <h4 className="font-heading text-xl text-foreground">{label || "Select Option"}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{placeholder}</p>
                                    </div>
                                    <button type="button" onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground rotate-45" />
                                    </button>
                                </div>
                                
                                <div className="overflow-y-auto p-3 custom-scrollbar flex-1">
                                    {groups ? (
                                        groups.map((group) => (
                                            <div key={group.name} className="mb-6 last:mb-0">
                                                <div className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 bg-muted/30 rounded-xl mb-2">
                                                    {group.name}
                                                </div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {group.items.map((item) => (
                                                        <button
                                                            key={item}
                                                            type="button"
                                                            onClick={() => { onChange(item); setIsOpen(false); }}
                                                            className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                                                                value === item ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground"
                                                            }`}
                                                        >
                                                            <span className="font-semibold text-base">{item}</span>
                                                            {value === item && (
                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                </motion.div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="grid grid-cols-1 gap-1">
                                            {options?.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => { onChange(option); setIsOpen(false); }}
                                                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                                                        value === option ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground"
                                                    }`}
                                                >
                                                    <span className="font-semibold text-base">{option}</span>
                                                    {value === option && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-muted/10 border-t border-border">
                                    <button type="button" onClick={() => setIsOpen(false)} className="w-full h-12 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

function GetQuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'submitting' | 'success'>('idle');
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, status]);
  
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
        toast.error("Failed to send verification email. Please check your network or email service configuration.");
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    if (currentStep === 2) {
        if (!formData.productName || !formData.quantity) {
            toast.error("Please select a product and quantity.");
            return;
        }
    }
    setCurrentStep(p => Math.min(p + 1, 3));
    if (currentStep === 2) {
      setCanSubmit(false);
      setTimeout(() => setCanSubmit(true), 500); // 500ms delay to prevent double-click submission
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const prevStep = () => {
    setCurrentStep(p => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3 || status === 'submitting' || !canSubmit) return; // Prevent premature submission
    
    setStatus('submitting');
    
    // Upload images first
    const uploadedUrls: Record<string, string> = {};
    const uploadPromises = Object.entries(images).map(async ([key, file]) => {
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${formData.email}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('quotes')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('quotes')
        .getPublicUrl(filePath);
      
      uploadedUrls[key] = publicUrl;
    });

    await Promise.all(uploadPromises);
    
    // Save to database
    const { error: dbError } = await supabase.from("quotes").insert({
      customer_name: `${formData.firstName} ${formData.surname || ""}`.trim(),
      customer_email: formData.email,
      customer_phone: formData.mobile,
      product_type: formData.productName,
      quantity: Number(formData.quantity),
      specifications: {
        company: formData.companyName,
        state: formData.state,
        postcode: formData.postcode,
        urgency: formData.urgency,
        requiredDate: formData.requiredDate,
        size: formData.size,
        material: formData.material,
        thickness: formData.thickness,
        finish: formData.finish,
        binding: formData.binding,
        fold: formData.fold,
        image_urls: uploadedUrls,
        ...formData
      },
      file_url: Object.values(uploadedUrls)[0] || null, // Primary file link
      notes: formData.details,
      status: 'pending'
    });

    if (dbError) {
      toast.error(dbError.message);
      setStatus('idle');
      return;
    }

    const adminSuccess = await sendQuoteToAdmin({ ...formData, images: uploadedUrls });
    
    if (!adminSuccess) {
      toast.error("Form submitted but email notifications failed. Please check your email configuration.");
    }

    setTimeout(() => {
      setStatus('success');
      toast.success("Verified quote request submitted!");
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter from submitting the entire form
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
        <div className="min-h-[80vh] bg-background flex flex-col items-center justify-center pt-24 md:pt-40 p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-card border border-border rounded-3xl p-10 lg:p-12 text-center shadow-2xl border-t-4 border-t-foreground relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center mx-auto mb-6"><MailCheck className="w-8 h-8" /></div>
                <h2 className="font-heading text-3xl mb-4">Verify Identity</h2>
                <p className="text-muted-foreground mb-8">Enter the 4-digit code sent to <span className="text-foreground font-medium">{formData.email}</span>.</p>
                <div className="space-y-6">
                    <input type="text" maxLength={4} placeholder="0000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full h-16 text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border-2 border-border bg-muted/30 focus:border-foreground focus:ring-0 transition-all outline-none" />
                    <button type="button" onClick={handleVerify} disabled={otp.length !== 4} className="w-full h-14 rounded-full bg-foreground text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg">
                        <ShieldCheck className="w-5 h-5"/> Verify & Continue
                    </button>
                    <button type="button" onClick={generateAndSendOtp} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto">
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
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="max-w-4xl mx-auto">
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
                  {isEditing && (
                    <div className="pt-8 border-t border-border flex justify-center">
                      <button type="button" onClick={() => { setIsEditing(false); setCurrentStep(3); }} className="px-8 h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 shadow-lg">
                        Save & Return to Review <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                  <div className="space-y-8">
                    <h3 className="font-heading text-2xl border-b border-border pb-4 text-center">Project Specifications</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <CustomSelect 
                            label="Select Product Category"
                            groups={PRODUCT_CATEGORIES}
                            value={PRODUCT_CATEGORIES.some(g => g.items.includes(formData.productName)) ? formData.productName : "Other"}
                            onChange={(val) => handleInputChange("productName", val)}
                            placeholder="Choose a product..."
                        />

                        {formData.productName.toLowerCase().includes("other") && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                <input 
                                    autoFocus
                                    placeholder="Please specify your product name..." 
                                    value={formData.productName === "Other" ? "" : formData.productName} 
                                    onChange={e => handleInputChange("productName", e.target.value)} 
                                    className="w-full h-14 px-5 rounded-2xl border border-foreground/20 bg-card outline-none focus:border-foreground transition-all font-medium" 
                                />
                            </motion.div>
                        )}

                        {formData.productName && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-muted/20 border border-border">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Quantity Required</label>
                                    <input required type="number" placeholder="Enter quantity..." value={formData.quantity} onChange={e => handleInputChange("quantity", e.target.value)} className="w-full h-14 px-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium" />
                                </div>

                                {(() => {
                                    const config = PRODUCT_CONFIGS[formData.productName];
                                    const CUSTOM_TRIGGERS = ["other", "customise", "customised", "custom"];
                                    
                                    const renderEditableSelect = (field: string, label: string, options: string[], placeholder: string) => {
                                        const val = formData[field] || "";
                                        const isTrigger = CUSTOM_TRIGGERS.some(t => val.toLowerCase().includes(t.toLowerCase()));
                                        const isManual = val !== "" && !options.includes(val);
                                        const showInput = isTrigger || isManual;

                                        return (
                                            <div className="space-y-3">
                                                <CustomSelect 
                                                    label={label} 
                                                    options={options} 
                                                    value={options.includes(val) ? val : (options.find(o => CUSTOM_TRIGGERS.some(t => o.toLowerCase().includes(t.toLowerCase()))) || val)} 
                                                    onChange={v => handleInputChange(field, v)} 
                                                    placeholder={placeholder} 
                                                />
                                                {showInput && (
                                                    <motion.div initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="overflow-hidden">
                                                        <input 
                                                            autoFocus={isTrigger}
                                                            placeholder={`Please specify ${label.toLowerCase()}...`}
                                                            value={isTrigger ? "" : val}
                                                            onChange={e => handleInputChange(field, e.target.value)}
                                                            className="w-full h-12 px-4 rounded-xl border border-foreground/20 bg-background outline-none focus:border-foreground transition-all text-sm font-medium shadow-inner"
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>
                                        );
                                    };

                                    return (
                                        <>
                                            {config?.types && renderEditableSelect("type", "Product Details / Type", config.types, "Select type...")}

                                            {config?.sizes && renderEditableSelect("size", "Select Size", config.sizes, "Select size...")}
                                            {config?.folds && renderEditableSelect("fold", "Fold Type", config.folds, "Select fold...")}
                                            {config?.bindings && renderEditableSelect("binding", "Binding Type", config.bindings, "Select binding...")}
                                            {config?.handles && renderEditableSelect("handle", "Handle Type", config.handles, "Select handle...")}
                                            {config?.materials && renderEditableSelect("material", "Material / Paper Type", config.materials, "Select material...")}
                                            {config?.thickness && renderEditableSelect("thickness", "Thickness (GSM)", config.thickness, "Select thickness...")}
                                            {config?.finishes && renderEditableSelect("finish", "Finish Options", config.finishes, "Select finish...")}
                                            {config?.printTypes && renderEditableSelect("printType", "Printing Type", config.printTypes, "Select printing type...")}
                                            {config?.pagesPerPad && renderEditableSelect("pagesPerPad", "Pages per Pad", config.pagesPerPad, "Select pages...")}
                                            {config?.parts && renderEditableSelect("parts", "Number of Parts", config.parts, "Select parts...")}
                                            {config?.colors && renderEditableSelect("colors", "Paper Colors", config.colors, "Select colors...")}
                                            {config?.shapes && renderEditableSelect("shape", "Select Shape", config.shapes, "Select shape...")}
                                            {config?.options && renderEditableSelect("options", "Additional Options", config.options, "Select options...")}
                                            {config?.adhesives && renderEditableSelect("adhesive", "Adhesive Type", config.adhesives, "Select adhesive...")}
                                            {config?.formats && renderEditableSelect("format", "Format", config.formats, "Select format...")}
                                            {config?.special && renderEditableSelect("specialFinish", "Special Finishings", config.special, "Add special finish...")}
                                            {config?.purposes && renderEditableSelect("purpose", "Purpose / Use Case", config.purposes, "Select purpose...")}
                                            
                                            {config?.dimensions && (
                                                <div className="sm:col-span-2 space-y-4">
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-2">Measurements (cm)</label>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[
                                                            { id: 'length', label: 'Length (L)' },
                                                            { id: 'width', label: 'Width (W)' },
                                                            { id: 'height', label: 'Height (H)' }
                                                        ].map(dim => (
                                                            <div key={dim.id} className="space-y-2">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder={dim.label} 
                                                                    value={formData[dim.id]} 
                                                                    onChange={e => handleInputChange(dim.id, e.target.value)} 
                                                                    className="w-full h-12 px-4 rounded-xl border border-border bg-card outline-none focus:border-foreground transition-all text-sm font-medium" 
                                                                />
                                                                <div className="text-[9px] text-center text-muted-foreground font-mono">{dim.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">Delivery Details</div>
                            <div className="grid grid-cols-1 gap-4">
                                <CustomSelect 
                                    options={["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]}
                                    value={formData.state}
                                    onChange={val => handleInputChange("state", val)}
                                    placeholder="Select State (Australia)"
                                />
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
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mt-2">
                                                <div className="relative group">
                                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
                                                    <input 
                                                        type="date" 
                                                        required 
                                                        value={formData.requiredDate} 
                                                        onChange={e => handleInputChange("requiredDate", e.target.value)} 
                                                        className="w-full h-14 pl-5 pr-12 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all font-medium appearance-none" 
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <textarea rows={4} placeholder="Additional Details / Special Instructions..." value={formData.details} onChange={e => handleInputChange("details", e.target.value)} className="w-full p-5 rounded-2xl border border-border bg-card outline-none focus:border-foreground transition-all resize-none font-medium" />
                    {isEditing && (
                      <div className="pt-8 border-t border-border flex justify-center">
                        <button type="button" onClick={() => { setIsEditing(false); setCurrentStep(3); }} className="px-8 h-14 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 shadow-lg">
                          Save & Return to Review <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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
                    <div className="grid grid-cols-2 gap-4">
                        {imageSlots.map(s => (
                            <label key={s.id} onClick={(e) => e.stopPropagation()} className="group relative aspect-square rounded-2xl border-2 border-dashed border-border bg-background hover:bg-muted/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4">
                                {previews[s.id] ? (
                                    <img src={previews[s.id]!} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-foreground mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); handleImageChange(s.id, e.target.files?.[0] || null); }} />
                            </label>
                        ))}
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl bg-secondary/30 border border-border relative overflow-hidden group">
                    <div className="absolute top-4 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setCurrentStep(2); setIsEditing(true); }} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-2 px-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                           <Sparkles className="w-3 h-3" /> Edit Product
                        </button>
                        <button type="button" onClick={() => { setCurrentStep(1); setIsEditing(true); }} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-2 px-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50">
                           <User className="w-3 h-3" /> Edit Contact
                        </button>
                    </div>

                    <h4 className="font-heading text-xl mb-8 text-center text-foreground flex items-center justify-center gap-3">
                        Final Review
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                        <div className="flex justify-between border-b border-border/50 pb-3 group/row">
                            <span className="text-muted-foreground">Product:</span>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-right">{formData.productName}</span>
                                <button type="button" onClick={() => { setCurrentStep(2); setIsEditing(true); }} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-3 group/row">
                            <span className="text-muted-foreground">Quantity:</span>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-right">{formData.quantity}</span>
                                <button type="button" onClick={() => { setCurrentStep(2); setIsEditing(true); }} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        {Object.entries(formData).map(([key, value]) => {
                            const skip = ['firstName', 'surname', 'companyName', 'email', 'mobile', 'productName', 'quantity', 'details', 'requiredDate', 'delivery', 'urgency', 'state', 'postcode'];
                            if (skip.includes(key) || !value || value === "") return null;
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                                <div key={key} className="flex justify-between border-b border-border/50 pb-3 group/row">
                                    <span className="text-muted-foreground">{label}:</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-right">{String(value)}</span>
                                        <button type="button" onClick={() => setCurrentStep(2)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between border-b border-border/50 pb-3 group/row">
                            <span className="text-muted-foreground">Contact:</span>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-right">{formData.firstName} {formData.surname}</span>
                                <button type="button" onClick={() => setCurrentStep(1)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                                    <User className="w-3.5 h-3.5" />
                                </button>
                            </div>
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
