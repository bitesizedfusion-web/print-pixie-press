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
  Printer,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Monitor,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingQuotes: number;
  pendingInquiries: number;
  lowStock: number;
  machines: any[];
  recentActivity: any[];
  revenueByDay: any[];
  ordersByStatus: any[];
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [ordersRes, customersRes, inventoryRes, quotesRes, inquiriesRes, machinesRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("inventory").select("quantity, reorder_level"),
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("print_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("printing_machines").select("*"),
      ]);

      const orders = ordersRes.data ?? [];
      const quotes = quotesRes.data ?? [];
      const inquiries = inquiriesRes.data ?? [];
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
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

      // Combine activity
      const combinedActivity = [
        ...orders.slice(0, 5).map(o => ({ ...o, type: 'order' })),
        ...quotes.slice(0, 5).map(q => ({ ...q, type: 'quote' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customersRes.count ?? 0,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
        pendingInquiries: inquiries.filter(i => i.status === 'pending').length,
        lowStock,
        machines: machinesRes.data ?? [],
        recentActivity: combinedActivity,
        revenueByDay: Object.entries(days).map(([day, revenue]) => ({ day, revenue })),
        ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="h-10 w-48 bg-card animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card animate-pulse rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12%", color: "text-success", bg: "bg-success/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, trend: "+8%", color: "text-cta", bg: "bg-cta/10" },
    { label: "Active Quotes", value: stats.pendingQuotes, icon: FileText, trend: "New", color: "text-primary", bg: "bg-primary/10" },
    { label: "Inquiries", value: stats.pendingInquiries, icon: MessageSquare, trend: "Pending", color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-background/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            Prime Dashboard <span className="text-xs font-mono px-2 py-0.5 bg-cta/10 text-cta rounded-full uppercase">v2.0</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time overview of your printing ecosystem</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-accent" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2 font-medium">3 Active Staff</span>
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card/40 backdrop-blur-md border border-border rounded-2xl p-6 hover:shadow-2xl hover:shadow-cta/5 transition-all duration-500 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.bg} rounded-bl-full opacity-20 -mr-12 -mt-12 transition-transform group-hover:scale-110`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} shadow-inner`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.color}`}>
                <TrendingUp className="h-3 w-3" />
                {kpi.trend}
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground font-mono tracking-tight">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Machine Status */}
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Printing Units</h3>
                <p className="text-xs text-muted-foreground">Operational status of machines</p>
              </div>
              <Printer className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.machines.map((m, i) => (
                <div key={m.id} className="p-4 rounded-xl bg-accent/20 border border-border/50 relative overflow-hidden group">
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse ${
                    m.status === 'printing' ? 'bg-success' : m.status === 'maintenance' ? 'bg-warning' : 'bg-muted'
                  }`} />
                  <p className="text-xs font-bold text-foreground mb-1 truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">{m.model}</p>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(m.usage_hours / 2000) * 100}%` }}
                        className="h-full bg-cta"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{m.usage_hours}h / 2000h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6">
              <h3 className="font-heading font-bold text-sm text-foreground mb-4">Revenue Growth</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="day" className="text-[10px]" axisLine={false} tickLine={false} />
                  <YAxis className="text-[10px]" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--cta))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--cta))' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6">
              <h3 className="font-heading font-bold text-sm text-foreground mb-4">Order Pipeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.ordersByStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="status" className="text-[10px]" axisLine={false} tickLine={false} />
                  <YAxis className="text-[10px]" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--cta))" radius={[4, 4, 0, 0]} barSize={24}>
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fillOpacity={0.6 + (index * 0.1)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <section className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg text-foreground">Live Feed</h3>
              <ActivityIcon className="h-5 w-5 text-cta animate-pulse" />
            </div>
            <div className="space-y-4">
              {stats.recentActivity.map((act, i) => (
                <div key={act.id} className="flex gap-4 p-3 rounded-xl hover:bg-accent/10 transition-colors group">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${
                    act.type === 'order' ? 'bg-cta/10 text-cta' : 'bg-primary/10 text-primary'
                  }`}>
                    {act.type === 'order' ? <ShoppingCart className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-foreground truncate">
                        {act.type === 'order' ? `Order #${act.order_number}` : `New Quote: ${act.customer_name}`}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(act.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{act.customer_name || act.customer_email}</p>
                    <div className="mt-2 flex items-center justify-between">
                       <StatusBadge status={act.status} />
                       <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
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
