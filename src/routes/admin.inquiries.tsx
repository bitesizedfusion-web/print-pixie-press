import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  RefreshCw, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Reply
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

interface InquiryRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

function InquiriesPage() {
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("print_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as InquiryRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("print_inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Inquiry marked as ${status}`);
    load();
    if (selected?.id === id) setSelected(null);
  };

  const filtered = rows.filter((r) => {
    return r.customer_name.toLowerCase().includes(search.toLowerCase()) || 
           r.customer_email.toLowerCase().includes(search.toLowerCase()) ||
           r.message.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 md:p-8 space-y-6 bg-background/50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage general inquiries from the contact form</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </header>

      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-cta transition-colors" />
        <input 
          className="w-full h-12 pl-12 pr-4 bg-card/40 backdrop-blur-md border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cta/30 transition-all" 
          placeholder="Search by name, email or message..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cta" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading messages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(msg)}
                className={`group bg-card/40 backdrop-blur-md border rounded-2xl p-6 hover:bg-accent/10 transition-all cursor-pointer relative overflow-hidden ${
                  msg.status === 'pending' ? 'border-cta/30 shadow-lg shadow-cta/5' : 'border-border'
                }`}
              >
                {msg.status === 'pending' && (
                   <div className="absolute top-0 right-0 w-2 h-2 bg-cta rounded-full m-4 animate-pulse" />
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    msg.status === 'pending' ? 'bg-cta/10 text-cta' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{msg.customer_name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 bg-accent/5 p-3 rounded-xl border border-border/30 italic">
                  "{msg.message}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {msg.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.status === 'pending' ? (
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-cta hover:text-cta hover:bg-cta/10 px-3" onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(msg.id, 'responded');
                      }}>
                        Mark Responded
                      </Button>
                    ) : (
                      <span className="text-[10px] font-bold text-success flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Responded
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="md:col-span-2 text-center py-24 bg-card/20 rounded-3xl border border-dashed border-border">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">No messages found</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl bg-card/95 backdrop-blur-xl border-border rounded-3xl">
          {selected && (
            <div className="space-y-6 p-2">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl flex items-center gap-3">
                  Message from <span className="text-cta">{selected.customer_name}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-accent/10 p-3 rounded-xl border border-border/30">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Email</p>
                      <p className="text-sm font-semibold">{selected.customer_email}</p>
                   </div>
                   <div className="bg-accent/10 p-3 rounded-xl border border-border/30">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Phone</p>
                      <p className="text-sm font-semibold">{selected.customer_phone || "—"}</p>
                   </div>
                </div>
                
                <div className="bg-accent/20 p-6 rounded-2xl border border-border/50 relative">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 border-b border-border pb-2">Full Message</p>
                   <p className="text-foreground leading-relaxed italic">
                      "{selected.message}"
                   </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="text-xs text-muted-foreground font-mono">
                   ID: {selected.id.slice(0, 8)}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => updateStatus(selected.id, 'deleted')}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                  <Button variant="cta" size="sm" onClick={() => window.location.href = `mailto:${selected.customer_email}`}>
                    <Reply className="h-4 w-4 mr-2" /> Reply via Email
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
