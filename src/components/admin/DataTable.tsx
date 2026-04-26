import { type ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, rowKey, empty, onRowClick }: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="p-12 text-center bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground">{empty ?? "No records yet"}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/30 text-xs uppercase text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-5 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"} ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-border ${onRowClick ? "cursor-pointer hover:bg-accent/20" : ""}`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-5 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"} ${c.className ?? ""}`}
                  >
                    {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as ReactNode) ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-blue-500/15 text-blue-600",
    printing: "bg-cta/15 text-cta",
    ready: "bg-purple-500/15 text-purple-600",
    shipped: "bg-orange-500/15 text-orange-600",
    delivered: "bg-success/15 text-success",
    cancelled: "bg-destructive/15 text-destructive",
    paid: "bg-success/15 text-success",
    draft: "bg-muted text-muted-foreground",
    sent: "bg-blue-500/15 text-blue-600",
    overdue: "bg-destructive/15 text-destructive",
    active: "bg-success/15 text-success",
    inactive: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
