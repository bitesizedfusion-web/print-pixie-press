import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Boxes,
  FileText,
  Truck,
  DollarSign,
  Activity,
  Settings,
  LogOut,
  Printer,
  ShieldCheck,
  Loader2,
  MessageSquare,
  Mail,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — S&S Printers" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders" as const, label: "Orders", icon: ShoppingCart },
  { to: "/admin/quotes" as const, label: "Quotes", icon: FileText },
  { to: "/admin/inquiries" as const, label: "Messages", icon: MessageSquare },
  { to: "/admin/newsletter" as const, label: "Newsletter", icon: Mail },
  { to: "/admin/customers" as const, label: "Customers", icon: Users },
  { to: "/admin/products" as const, label: "Products", icon: Package },
  { to: "/admin/inventory" as const, label: "Inventory", icon: Boxes },
  { to: "/admin/machines" as const, label: "Machines", icon: Printer },
  { to: "/admin/invoices" as const, label: "Invoices", icon: FileText },
  { to: "/admin/suppliers" as const, label: "Suppliers", icon: Truck },
  { to: "/admin/expenses" as const, label: "Expenses", icon: DollarSign },
  { to: "/admin/activity" as const, label: "Activity Log", icon: Activity },
  { to: "/admin/settings" as const, label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, isAdmin, isStaff, loading, signOut, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authed
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const claimAdmin = async () => {
    if (!user) return;
    const { count } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) {
      toast.error("An admin already exists. Ask them to grant you access.");
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshRoles();
    toast.success("You are now the admin! 🎉");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-cta" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin && !isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-cta" />
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Admin access required
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            You're signed in as <span className="font-mono">{user.email}</span> but don't have admin
            permissions. If you're the business owner, claim the admin role below.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="cta" onClick={claimAdmin}>
              Claim admin role
            </Button>
            <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
              Back to site
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300
        lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center shadow-lg shadow-cta/20">
              <Printer className="h-5 w-5 text-cta-foreground" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground leading-tight">
                S&S Printing
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Prime Admin
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Activity className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {NAV.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-cta text-cta-foreground font-semibold shadow-md shadow-cta/10"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border bg-accent/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold text-foreground truncate">{user.email}</p>
            <p className="text-[10px] uppercase tracking-wider text-cta font-bold mt-0.5">
              {isAdmin ? "Admin" : "Staff"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
              <Printer className="h-4 w-4 text-cta-foreground" />
            </div>
            <span className="font-heading font-bold text-sm">Prime Admin</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
            <Activity className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
