import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  MapPin,
  TrendingUp,
  ShoppingBag,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  city: string | null;
  state: string | null;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "NSW",
  });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as Customer[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("customers").insert(form);
    if (error) toast.error(error.message);
    else {
      toast.success("Customer added successfully! 🎉");
      setOpen(false);
      setForm({ name: "", email: "", phone: "", company: "", city: "", state: "NSW" });
      load();
    }
    setBusy(false);
  };

  const filtered = rows.filter(
    (r) =>
      !q ||
      [r.name, r.email, r.company, r.city].some((v) => v?.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-background/50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Customer Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total {rows.length} customers registered
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="cta" size="sm" className="rounded-xl shadow-lg shadow-cta/20">
              <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create Customer Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4 pt-4">
              <div className="space-y-4">
                <Field
                  label="Full Name"
                  icon={Users}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <Field
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Phone"
                    icon={Phone}
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />
                  <Field
                    label="Company"
                    icon={Building2}
                    value={form.company}
                    onChange={(v) => setForm({ ...form, company: v })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    icon={MapPin}
                    value={form.city}
                    onChange={(v) => setForm({ ...form, city: v })}
                  />
                  <Field
                    label="State"
                    value={form.state}
                    onChange={(v) => setForm({ ...form, state: v })}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="cta"
                className="w-full h-11 rounded-xl mt-4"
                disabled={busy}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Search & Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-cta transition-colors" />
          <input
            className="w-full h-12 pl-12 pr-4 bg-card/40 backdrop-blur-md border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cta/30 transition-all"
            placeholder="Search by name, email, or company..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="bg-cta/10 rounded-2xl border border-cta/20 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cta/20 rounded-xl text-cta">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-[10px] uppercase font-bold text-cta tracking-wider">
              Top Clients
            </div>
          </div>
          <span className="text-xl font-bold text-cta font-mono">12%</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cta" />
          <p className="text-sm text-muted-foreground animate-pulse">Scanning database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-card/40 backdrop-blur-md border border-border rounded-2xl p-5 hover:bg-accent/10 transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-cta shadow-inner">
                    <Users className="h-6 w-6" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-bold text-lg text-foreground truncate">{customer.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 truncate">
                  {customer.company || "Individual Client"}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {customer.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{" "}
                    {[customer.city, customer.state].filter(Boolean).join(", ") || "No address"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                  <div className="bg-accent/30 p-2 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Orders</p>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <ShoppingBag className="h-3 w-3 text-cta" />
                      {customer.total_orders}
                    </div>
                  </div>
                  <div className="bg-accent/30 p-2 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Spent</p>
                    <p className="font-mono font-bold text-foreground">
                      ${Number(customer.total_spent).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-24 bg-card/20 rounded-3xl border border-dashed border-border">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium">No customers found</p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  icon?: any;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`h-11 bg-background/50 border-border rounded-xl focus:ring-cta/20 ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}
