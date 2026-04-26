import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  base_price: number;
  active: boolean;
}

function ProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const blank = { id: "", slug: "", name: "", category: "", description: "", base_price: 0, active: true };
  const [form, setForm] = useState<Product>(blank);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("name");
    setRows((data ?? []) as Product[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setOpen(true); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = { slug: form.slug, name: form.name, category: form.category, description: form.description, base_price: Number(form.base_price), active: form.active };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editing ? "Product updated" : "Product created"); setOpen(false); load(); }
    setBusy(false);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Products"
        subtitle={`${rows.length} product${rows.length !== 1 ? "s" : ""} in catalog`}
        action={<Button variant="cta" size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Product</Button>}
      />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No products yet"
          columns={[
            { key: "name", label: "Name", render: (r) => (
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{r.slug}</p>
              </div>
            )},
            { key: "category", label: "Category", render: (r) => <span className="text-xs uppercase tracking-wider text-muted-foreground">{r.category}</span> },
            { key: "base_price", label: "Base Price", align: "right", render: (r) => <span className="font-mono">${Number(r.base_price).toFixed(2)}</span> },
            { key: "active", label: "Status", render: (r) => <StatusBadge status={r.active ? "active" : "inactive"} /> },
            { key: "actions", label: "", align: "right", render: (r) => (
              <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Edit2 className="h-3.5 w-3.5" /></Button>
            )},
          ]}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Product</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Base Price (AUD)</Label><Input type="number" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} required /></div>
            </div>
            <div className="space-y-1"><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c })} />
              <Label>Active (visible in catalog)</Label>
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
