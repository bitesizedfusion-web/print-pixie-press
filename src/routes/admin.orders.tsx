import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: number;
  paid: boolean;
  created_at: string;
  tracking_number: string | null;
  delivery_address: string | null;
  customer_phone: string | null;
  notes: string | null;
}

const STATUSES = ["pending", "confirmed", "printing", "ready", "shipped", "delivered", "cancelled"];

function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data ?? []) as OrderRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as "pending" | "confirmed" | "printing" | "ready" | "shipped" | "delivered" | "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status updated to ${status}`);
    load();
    setSelected((s) => (s ? { ...s, status } : null));
  };

  const togglePaid = async (id: string, paid: boolean) => {
    const { error } = await supabase.from("orders").update({ paid }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(paid ? "Marked as paid" : "Marked as unpaid");
    load();
    setSelected((s) => (s ? { ...s, paid } : null));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
        action={
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={setSelected}
          empty="No orders yet — they'll show up here when customers checkout"
          columns={[
            { key: "order_number", label: "Order #", render: (r) => <span className="font-mono text-xs">{r.order_number}</span> },
            { key: "customer_name", label: "Customer", render: (r) => (
              <div>
                <p className="font-medium">{r.customer_name}</p>
                <p className="text-xs text-muted-foreground">{r.customer_email}</p>
              </div>
            )},
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "paid", label: "Paid", render: (r) => <StatusBadge status={r.paid ? "paid" : "pending"} /> },
            { key: "total", label: "Total", align: "right", render: (r) => <span className="font-mono">${Number(r.total).toFixed(2)}</span> },
            { key: "created_at", label: "Date", align: "right", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span> },
          ]}
        />
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">Order {selected.order_number}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Customer" value={selected.customer_name} />
                  <Field label="Email" value={selected.customer_email} />
                  <Field label="Phone" value={selected.customer_phone ?? "—"} />
                  <Field label="Total" value={`$${Number(selected.total).toFixed(2)}`} />
                </div>
                <Field label="Delivery Address" value={selected.delivery_address ?? "—"} />
                {selected.notes && <Field label="Notes" value={selected.notes} />}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={selected.paid ? "outline" : "cta"}
                    size="sm"
                    onClick={() => togglePaid(selected.id, !selected.paid)}
                  >
                    Mark {selected.paid ? "unpaid" : "paid"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground tracking-wider">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
