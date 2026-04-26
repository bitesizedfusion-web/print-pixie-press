import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/expenses")({
  component: ExpensesPage,
});

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  vendor: string | null;
  expense_date: string;
  payment_method: string | null;
}

function ExpensesPage() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ category: "Supplies", description: "", amount: 0, vendor: "", expense_date: today, payment_method: "Card" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    setRows((data ?? []) as Expense[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("expenses").insert(form);
    if (error) toast.error(error.message);
    else { toast.success("Expense logged"); setOpen(false); setForm({ category: "Supplies", description: "", amount: 0, vendor: "", expense_date: today, payment_method: "Card" }); load(); }
    setBusy(false);
  };

  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  const monthTotal = rows.filter((r) => r.expense_date.startsWith(today.slice(0, 7))).reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="p-8">
      <PageHeader
        title="Expenses"
        subtitle={`${rows.length} expense${rows.length !== 1 ? "s" : ""} logged`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="cta" size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Log Expense</Button>
            <DialogContent>
              <DialogHeader><DialogTitle>New Expense</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
                  <div className="space-y-1"><Label>Amount (AUD)</Label><Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required /></div>
                </div>
                <div className="space-y-1"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Vendor</Label><Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} required /></div>
                </div>
                <div className="space-y-1"><Label>Payment Method</Label><Input value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} /></div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Expense"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider"><DollarSign className="h-3 w-3" /> Total</div>
          <p className="text-2xl font-bold font-mono mt-1">${total.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider"><DollarSign className="h-3 w-3" /> This Month</div>
          <p className="text-2xl font-bold font-mono mt-1 text-cta">${monthTotal.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No expenses logged"
          columns={[
            { key: "expense_date", label: "Date", render: (r) => <span className="text-xs">{r.expense_date}</span> },
            { key: "category", label: "Category", render: (r) => <span className="text-xs uppercase tracking-wider text-muted-foreground">{r.category}</span> },
            { key: "description", label: "Description", render: (r) => <p className="font-medium">{r.description}</p> },
            { key: "vendor", label: "Vendor", render: (r) => <span className="text-xs">{r.vendor ?? "—"}</span> },
            { key: "payment_method", label: "Method", render: (r) => <span className="text-xs">{r.payment_method ?? "—"}</span> },
            { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-mono text-destructive">-${Number(r.amount).toFixed(2)}</span> },
          ]}
        />
      )}
    </div>
  );
}
