import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStock: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  revenueByDay: Array<{ day: string; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [ordersRes, customersRes, inventoryRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("inventory").select("quantity, reorder_level"),
      ]);

      const orders = ordersRes.data ?? [];
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
      const pendingOrders = orders.filter((o) => ["pending", "confirmed", "printing"].includes(o.status)).length;
      const lowStock = (inventoryRes.data ?? []).filter((i) => Number(i.quantity) <= Number(i.reorder_level)).length;

      // Revenue by last 7 days
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(5, 10);
        days[key] = 0;
      }
      orders.forEach((o) => {
        const key = new Date(o.created_at).toISOString().slice(5, 10);
        if (key in days) days[key] += Number(o.total ?? 0);
      });

      const statusCounts: Record<string, number> = {};
      orders.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
      });

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customersRes.count ?? 0,
        pendingOrders,
        lowStock,
        recentOrders: orders.slice(0, 8).map((o) => ({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          total: Number(o.total),
          status: o.status,
          created_at: o.created_at,
        })),
        revenueByDay: Object.entries(days).map(([day, revenue]) => ({ day, revenue })),
        ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12%", color: "text-success" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, trend: "+8%", color: "text-cta" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, trend: "+15%", color: "text-primary" },
    { label: "Pending", value: stats.pendingOrders, icon: Clock, trend: "Active", color: "text-warning-foreground" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your printing business</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-semibold ${kpi.color}`}>{kpi.trend}</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {stats.lowStock > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground" />
          <p className="text-sm font-semibold text-foreground">
            {stats.lowStock} inventory item{stats.lowStock > 1 ? "s" : ""} below reorder level
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-1">Revenue (Last 7 days)</h3>
          <p className="text-xs text-muted-foreground mb-4">Daily revenue in AUD</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--cta))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-1">Orders by Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Current order distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="status" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--cta))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-5 border-b border-border">
          <h3 className="font-heading font-bold text-foreground">Recent Orders</h3>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-accent/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3">Order #</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Total</th>
                  <th className="text-right px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-accent/20">
                    <td className="px-5 py-3 font-mono text-xs">{o.order_number}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{o.customer_name}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right font-mono">${o.total.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground text-xs">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-blue-500/15 text-blue-600",
    printing: "bg-cta/15 text-cta",
    ready: "bg-purple-500/15 text-purple-600",
    shipped: "bg-orange-500/15 text-orange-600",
    delivered: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}
