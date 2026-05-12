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

export const Route = createFileRoute("/admin/invoices")({
  component: InvoicesPage,
});

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  subtotal: number;
  gst: number;
  total: number;
  issue_date: string;
  due_date: string | null;
}

function InvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ customer_name: "", customer_email: "", subtotal: 0 });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("issue_date", { ascending: false });
    setRows((data ?? []) as Invoice[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const subtotal = Number(form.subtotal);
    const gst = +(subtotal * 0.1).toFixed(2);
    const total = +(subtotal + gst).toFixed(2);
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const invoiceNum = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const { error } = await supabase.from("invoices").insert([
      {
        invoice_number: invoiceNum,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        subtotal,
        gst,
        total,
        due_date: due.toISOString().slice(0, 10),
        status: "sent" as const,
      },
    ]);
    if (error) toast.error(error.message);
    else {
      toast.success("Invoice created");
      setOpen(false);
      setForm({ customer_name: "", customer_email: "", subtotal: 0 });
      load();
    }
    setBusy(false);
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid", paid_date: new Date().toISOString().slice(0, 10) })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Invoice marked as paid");
    load();
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Invoices"
        subtitle={`${rows.length} invoice${rows.length !== 1 ? "s" : ""}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="cta" size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Invoice
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="space-y-1">
                  <Label>Customer Name</Label>
                  <Input
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Subtotal (AUD ex-GST)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.subtotal}
                    onChange={(e) => setForm({ ...form, subtotal: Number(e.target.value) })}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  GST (10%) and total will be calculated automatically.
                </p>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-cta" />
        </div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No invoices yet"
          columns={[
            {
              key: "invoice_number",
              label: "Invoice #",
              render: (r) => <span className="font-mono text-xs">{r.invoice_number}</span>,
            },
            {
              key: "customer_name",
              label: "Customer",
              render: (r) => (
                <div>
                  <p className="font-medium">{r.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{r.customer_email}</p>
                </div>
              ),
            },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            {
              key: "issue_date",
              label: "Issued",
              render: (r) => <span className="text-xs">{r.issue_date}</span>,
            },
            {
              key: "due_date",
              label: "Due",
              render: (r) => <span className="text-xs">{r.due_date ?? "—"}</span>,
            },
            {
              key: "total",
              label: "Total",
              align: "right",
              render: (r) => <span className="font-mono">${Number(r.total).toFixed(2)}</span>,
            },
            {
              key: "actions",
              label: "",
              align: "right",
              render: (r) =>
                r.status !== "paid" && (
                  <Button variant="ghost" size="sm" onClick={() => markPaid(r.id)}>
                    Mark paid
                  </Button>
                ),
            },
          ]}
        />
      )}
    </div>
  );
}
