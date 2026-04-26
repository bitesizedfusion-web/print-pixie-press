import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", city: "", state: "NSW" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as Customer[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("customers").insert(form);
    if (error) toast.error(error.message);
    else {
      toast.success("Customer added");
      setOpen(false);
      setForm({ name: "", email: "", phone: "", company: "", city: "", state: "NSW" });
      load();
    }
    setBusy(false);
  };

  const filtered = rows.filter((r) =>
    !q || [r.name, r.email, r.company, r.city].some((v) => v?.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="p-8">
      <PageHeader
        title="Customers"
        subtitle={`${rows.length} customer${rows.length !== 1 ? "s" : ""}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="cta" size="sm"><Plus className="h-4 w-4 mr-2" /> Add Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Customer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9 max-w-sm" placeholder="Search customers..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          empty="No customers yet"
          columns={[
            { key: "name", label: "Name", render: (r) => (
              <div>
                <p className="font-medium">{r.name}</p>
                {r.company && <p className="text-xs text-muted-foreground">{r.company}</p>}
              </div>
            )},
            { key: "email", label: "Email", render: (r) => <span className="text-xs">{r.email}</span> },
            { key: "phone", label: "Phone", render: (r) => <span className="text-xs">{r.phone ?? "—"}</span> },
            { key: "city", label: "Location", render: (r) => <span className="text-xs">{[r.city, r.state].filter(Boolean).join(", ") || "—"}</span> },
            { key: "total_orders", label: "Orders", align: "right", render: (r) => <span className="font-mono">{r.total_orders}</span> },
            { key: "total_spent", label: "Spent", align: "right", render: (r) => <span className="font-mono">${Number(r.total_spent).toFixed(2)}</span> },
          ]}
        />
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}
