import { Check, Loader2, Clock } from "lucide-react";

const steps = [
  { label: "Order Placed", status: "done" },
  { label: "File Approved", status: "done" },
  { label: "Printing", status: "current" },
  { label: "Quality Check", status: "pending" },
  { label: "Dispatched", status: "pending" },
  { label: "Delivered", status: "pending" },
];

export function OrderTracker() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              step.status === "done"
                ? "bg-success/10 text-success"
                : step.status === "current"
                  ? "bg-cta/10 text-cta"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step.status === "done" ? (
              <Check className="h-3 w-3" />
            ) : step.status === "current" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {step.label}
          </div>
          {i < steps.length - 1 && <span className="text-border">→</span>}
        </div>
      ))}
    </div>
  );
}
