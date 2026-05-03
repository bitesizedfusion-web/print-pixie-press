import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  RefreshCw, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/quotes")({
  component: QuotesPage,
});

interface QuoteRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  product_type: string | null;
  quantity: number | null;
  specifications: any;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUSES = ["pending", "reviewed", "quoted", "rejected"];

function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuoteRow | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setQuotes((data ?? []) as QuoteRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quotes").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Quote status updated to ${status}`);
    load();
    setSelected((s) => (s ? { ...s, status } : null));
  };

  const filtered = quotes.filter((q) => {
    const matchesFilter = filter === "all" || q.status === filter;
    const matchesSearch = q.customer_name.toLowerCase().includes(search.toLowerCase()) || 
                         (q.product_type || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 bg-background/50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Quote Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and respond to custom printing quotes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card/30 backdrop-blur-sm p-4 rounded-2xl border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or product..." 
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cta/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="bg-background/50 border-border rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cta" />
          <p className="text-sm text-muted-foreground animate-pulse">Fetching quotes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((quote, i) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(quote)}
                className="group bg-card/40 backdrop-blur-md border border-border rounded-2xl p-4 md:p-6 hover:bg-accent/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{quote.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex-1 md:px-8">
                    <p className="font-bold text-foreground text-sm uppercase tracking-wider">{quote.product_type}</p>
                    <p className="text-xs text-muted-foreground">Quantity: {quote.quantity}</p>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8">
                    <StatusBadge status={quote.status} />
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-card/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No quote requests found</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl border-border rounded-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <div className="space-y-6 p-2">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  Quote Request Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cta border-b border-cta/20 pb-2">Contact Info</h4>
                  <DetailField label="Customer" value={selected.customer_name} />
                  <DetailField label="Email" value={selected.customer_email} />
                  <DetailField label="Phone" value={selected.customer_phone ?? "—"} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cta border-b border-cta/20 pb-2">Project Info</h4>
                  <DetailField label="Product" value={selected.product_type ?? "—"} />
                  <DetailField label="Quantity" value={selected.quantity?.toString() ?? "—"} />
                  <DetailField label="Date Requested" value={new Date(selected.created_at).toLocaleString()} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cta border-b border-cta/20 pb-2">Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {Object.entries(selected.specifications || {}).map(([key, val]: [string, any]) => {
                     if (typeof val === 'object' || !val) return null;
                     return (
                        <div key={key} className="bg-accent/10 p-2 rounded-lg border border-border/30">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">{key}</p>
                          <p className="text-xs font-semibold text-foreground truncate">{val}</p>
                        </div>
                     )
                   })}
                </div>
              </div>

              {selected.notes && (
                <div className="bg-accent/20 p-4 rounded-xl border border-border/50">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Additional Notes</p>
                  <p className="text-sm text-foreground">{selected.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                    <SelectTrigger className="w-40 bg-background/50 border-border rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <MessageSquare className="h-4 w-4 mr-2" /> Email Customer
                  </Button>
                  <Button variant="cta" size="sm" className="rounded-xl">
                    Create Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-accent/5 p-3 rounded-xl border border-border/20">
      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { class: string, icon: any }> = {
    pending: { class: "bg-muted text-muted-foreground", icon: Clock },
    reviewed: { class: "bg-blue-500/15 text-blue-600", icon: Eye },
    quoted: { class: "bg-success/15 text-success", icon: CheckCircle2 },
    rejected: { class: "bg-destructive/15 text-destructive", icon: XCircle },
  };
  const config = map[status] ?? map.pending;
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${config.class}`}>
      <Icon className="h-3 w-3" />
      {status}
    </div>
  );
}
