import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Loader2, Activity } from "lucide-react";

export const Route = createFileRoute("/admin/activity")({
  component: ActivityPage,
});

interface Log {
  id: string;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

function ActivityPage() {
  const [rows, setRows] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(200);
      setRows((data ?? []) as Log[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="p-8">
      <PageHeader title="Activity Log" subtitle="Last 200 events across the system" />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cta" /></div>
      ) : (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty={
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-8 w-8 text-muted-foreground/40" />
              <p>No activity yet</p>
            </div>
          }
          columns={[
            { key: "created_at", label: "When", render: (r) => <span className="text-xs">{new Date(r.created_at).toLocaleString()}</span> },
            { key: "user_email", label: "User", render: (r) => <span className="text-xs font-mono">{r.user_email ?? "system"}</span> },
            { key: "action", label: "Action", render: (r) => <span className="text-xs uppercase font-bold tracking-wider text-cta">{r.action}</span> },
            { key: "entity_type", label: "Entity", render: (r) => (
              <div>
                <p className="text-xs">{r.entity_type}</p>
                {r.entity_id && <p className="text-[10px] text-muted-foreground font-mono">{r.entity_id.slice(0, 8)}</p>}
              </div>
            )},
            { key: "details", label: "Details", render: (r) => (
              <span className="text-xs text-muted-foreground">{r.details ? JSON.stringify(r.details).slice(0, 60) : "—"}</span>
            )},
          ]}
        />
      )}
    </div>
  );
}
