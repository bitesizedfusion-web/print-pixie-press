import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryPage,
});

interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorder_level: number;
  unit_cost: number;
  location: string | null;
}

function InventoryPage() {
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "Paper",
    unit: "sheets",
    quantity: 0,
    reorder_level: 100,
    unit_cost: 0,
    location: "",
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("inventory").select("*").order("name");
    setRows((data ?? []) as Item[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("inventory").insert(form);
    if (error) toast.error(error.message);
    else {
      toast.success("Item added");
      setOpen(false);
      load();
      setForm({
        sku: "",
        name: "",
        category: "Paper",
        unit: "sheets",
        quantity: 0,
        reorder_level: 100,
        unit_cost: 0,
        location: "",
      });
    }
    setBusy(false);
  };

  const lowStock = rows.filter((r) => Number(r.quantity) <= Number(r.reorder_level));

  return (
    <div className="p-8">
      <PageHeader
        title="Inventory"
        subtitle={`${rows.length} item${rows.length !== 1 ? "s" : ""} tracked`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="cta" size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>SKU</Label>
                    <Input
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Category</Label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Unit</Label>
                    <Input
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Reorder At</Label>
                    <Input
                      type="number"
                      value={form.reorder_level}
                      onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Unit Cost (AUD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.unit_cost}
                      onChange={(e) => setForm({ ...form, unit_cost: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Location</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {lowStock.length > 0 && (
        <div className="mb-4 bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground" />
          <p className="text-sm font-semibold text-foreground">
            {lowStock.length} item{lowStock.length > 1 ? "s" : ""} below reorder level
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-cta" />
        </div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No inventory tracked"
          columns={[
            {
              key: "sku",
              label: "SKU",
              render: (r) => <span className="font-mono text-xs">{r.sku}</span>,
            },
            {
              key: "name",
              label: "Item",
              render: (r) => (
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                </div>
              ),
            },
            {
              key: "quantity",
              label: "Stock",
              align: "right",
              render: (r) => {
                const low = Number(r.quantity) <= Number(r.reorder_level);
                return (
                  <span className={`font-mono ${low ? "text-warning-foreground font-bold" : ""}`}>
                    {r.quantity} {r.unit}
                  </span>
                );
              },
            },
            {
              key: "reorder_level",
              label: "Reorder At",
              align: "right",
              render: (r) => (
                <span className="font-mono text-xs text-muted-foreground">{r.reorder_level}</span>
              ),
            },
            {
              key: "unit_cost",
              label: "Unit Cost",
              align: "right",
              render: (r) => <span className="font-mono">${Number(r.unit_cost).toFixed(2)}</span>,
            },
            {
              key: "location",
              label: "Location",
              render: (r) => (
                <span className="text-xs text-muted-foreground">{r.location ?? "—"}</span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
