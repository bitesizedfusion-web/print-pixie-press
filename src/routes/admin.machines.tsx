import { createFileRoute } from "@tanstack/react-router";
import { Printer, Settings, Activity, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/machines")({
  component: AdminMachinesPage,
});

function AdminMachinesPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Printing Machines</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your printing equipment.</p>
        </div>
        <Button variant="cta" className="flex items-center gap-2">
          <Settings className="h-4 w-4" /> Machine Setup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Heidelberg Speedmaster XL 106", status: "Online", load: "75%", temp: "42°C", health: "Good" },
          { name: "HP Indigo 12000 Digital Press", status: "Maintenance", load: "0%", temp: "28°C", health: "Attention" },
          { name: "Komori Lithrone G40", status: "Online", load: "40%", temp: "38°C", health: "Excellent" },
        ].map((m) => (
          <div key={m.name} className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-prime transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Printer className="h-6 w-6 text-cta" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                m.status === 'Online' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {m.status}
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg mb-4">{m.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Load</span>
                <span className="font-mono font-semibold text-foreground">{m.load}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-mono font-semibold text-foreground">{m.temp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">System Health</span>
                <span className={`font-semibold ${m.health === 'Excellent' ? 'text-success' : 'text-cta'}`}>{m.health}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full text-xs flex items-center gap-2">
                <Activity className="h-3 w-3" /> View Diagnostics
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6 flex items-start gap-4">
        <ShieldAlert className="h-6 w-6 text-warning shrink-0" />
        <div>
          <h4 className="font-bold text-warning mb-1">Maintenance Required</h4>
          <p className="text-sm text-warning/80">
            The HP Indigo 12000 requires its scheduled maintenance in 48 hours. Please ensure parts are available.
          </p>
        </div>
      </div>
    </div>
  );
}
