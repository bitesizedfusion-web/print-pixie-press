import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersPage,
});

interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  category: string | null;
  active: boolean;
}

function SuppliersPage() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", contact_person: "", email: "", phone: "", category: "Paper", notes: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("suppliers").select("*").order("name");
    setRows((data ?? []) as Supplier[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("suppliers").insert(form);
    if (error) toast.error(error.message);
    else { toast.success("Supplier added"); setOpen(false); setForm({ name: "", contact_person: "", email: "", phone: "", category: "Paper", notes: "" }); load(); }
    setBusy(false);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Suppliers"
        subtitle={`${rows.length} supplier${rows.length !== 1 ? "s" : ""}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="cta" size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Supplier</Button>
            <DialogContent>
              <DialogHeader><DialogTitle>New Supplier</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-1"><Label>Company Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Contact Person</Label><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                </div>
                <div className="space-y-1"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Supplier"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No suppliers yet"
          columns={[
            { key: "name", label: "Company", render: (r) => <p className="font-medium">{r.name}</p> },
            { key: "contact_person", label: "Contact", render: (r) => (
              <div>
                <p className="text-sm">{r.contact_person ?? "—"}</p>
                {r.email && <p className="text-xs text-muted-foreground">{r.email}</p>}
              </div>
            )},
            { key: "phone", label: "Phone", render: (r) => <span className="text-xs">{r.phone ?? "—"}</span> },
            { key: "category", label: "Category", render: (r) => <span className="text-xs uppercase tracking-wider text-muted-foreground">{r.category ?? "—"}</span> },
            { key: "active", label: "Status", render: (r) => <StatusBadge status={r.active ? "active" : "inactive"} /> },
          ]}
        />
      )}
    </div>
  );
}
