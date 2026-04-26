import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

interface UserWithRole {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: string;
}

function SettingsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("user_id, email, display_name");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const merged: UserWithRole[] = (profiles ?? []).map((p) => ({
      user_id: p.user_id,
      email: p.email,
      display_name: p.display_name,
      role: roles?.find((r) => r.user_id === p.user_id)?.role ?? "customer",
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (userId: string, role: string) => {
    // Delete existing roles, insert new
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as "admin" | "staff" | "customer" });
    if (error) return toast.error(error.message);
    toast.success(`Role updated to ${role}`);
    load();
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader title="Settings" subtitle="Manage team members and roles" />

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-cta" />
          <h3 className="font-heading font-bold">Team & Roles</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Promote customers to <span className="font-bold text-foreground">staff</span> (full CRM access except expenses & products)
          or <span className="font-bold text-foreground">admin</span> (everything).
        </p>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-cta" /></div>
        ) : (
          <DataTable
            rows={rows}
            rowKey={(r) => r.user_id}
            empty="No users yet"
            columns={[
              { key: "display_name", label: "Name", render: (r) => (
                <div>
                  <p className="font-medium">{r.display_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
              )},
              { key: "role", label: "Role", render: (r) => (
                <Select
                  value={r.role}
                  onValueChange={(v) => setRole(r.user_id, v)}
                  disabled={r.user_id === user?.id}
                >
                  <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )},
              { key: "self", label: "", align: "right", render: (r) => (
                r.user_id === user?.id ? <span className="text-xs text-muted-foreground italic">(you)</span> : null
              )},
            ]}
          />
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading font-bold mb-2">Business Info</h3>
        <p className="text-xs text-muted-foreground mb-4">
          PrintMaster Australia — Online printing serving Australia-wide.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">GST Rate</p>
            <p className="font-mono mt-1">10%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Flat Delivery</p>
            <p className="font-mono mt-1">$12.50 AUD</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Standard Turnaround</p>
            <p className="font-mono mt-1">3–5 days</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Express Surcharge</p>
            <p className="font-mono mt-1">+30%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
