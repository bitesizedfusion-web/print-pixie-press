import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  FileCheck,
  Printer,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order — PrintHub Australia" },
      {
        name: "description",
        content:
          "Enter your PrintHub order ID to see live status updates, estimated delivery date, and your order timeline.",
      },
      { property: "og:title", content: "Track Your Order — PrintHub Australia" },
      {
        property: "og:description",
        content: "Live print job status, courier tracking and delivery ETA.",
      },
    ],
  }),
  validateSearch: z.object({ id: z.string().optional() }),
  component: TrackPage,
});

/* ===== Mock order data ===== */
type StageId = "placed" | "approved" | "printing" | "qa" | "dispatched" | "delivered";

interface Stage {
  id: StageId;
  label: string;
  description: string;
  icon: typeof Package;
}

const STAGES: Stage[] = [
  { id: "placed", label: "Order Placed", description: "We received your order", icon: FileCheck },
  {
    id: "approved",
    label: "File Approved",
    description: "Pre-flight check passed",
    icon: CheckCircle2,
  },
  { id: "printing", label: "Printing", description: "Job is on press", icon: Printer },
  { id: "qa", label: "Quality Check", description: "Final inspection", icon: Sparkles },
  { id: "dispatched", label: "Dispatched", description: "Out for delivery", icon: Truck },
  { id: "delivered", label: "Delivered", description: "Order complete", icon: Package },
];

interface MockOrder {
  id: string;
  product: string;
  quantity: number;
  total: number;
  customer: string;
  destination: string;
  courier: string;
  trackingNumber: string;
  placedAt: string;
  eta: string;
  currentStage: StageId;
  history: { stage: StageId; timestamp: string; note: string }[];
}

const SAMPLE_ORDERS: Record<string, MockOrder> = {
  "PH-1042": {
    id: "PH-1042",
    product: "Flyers · A5 · 130gsm Gloss",
    quantity: 1000,
    total: 167.75,
    customer: "Aarav Singh",
    destination: "Surry Hills NSW 2010",
    courier: "Australia Post Express",
    trackingNumber: "AP1042AU99234",
    placedAt: "Mon 21 Apr · 10:32 AM",
    eta: "Fri 25 Apr · by 5:00 PM",
    currentStage: "printing",
    history: [
      {
        stage: "placed",
        timestamp: "Mon 21 Apr · 10:32 AM",
        note: "Payment received via Visa •••• 4242",
      },
      {
        stage: "approved",
        timestamp: "Mon 21 Apr · 11:18 AM",
        note: "Artwork passed pre-flight at 300 DPI CMYK",
      },
      {
        stage: "printing",
        timestamp: "Tue 22 Apr · 09:05 AM",
        note: "Job sent to HP Indigo press #3",
      },
    ],
  },
  "PH-1043": {
    id: "PH-1043",
    product: "Brochures · Tri-fold · 170gsm Matte",
    quantity: 500,
    total: 312.4,
    customer: "Mei Chen",
    destination: "South Yarra VIC 3141",
    courier: "StarTrack Premium",
    trackingNumber: "ST1043AU88102",
    placedAt: "Wed 23 Apr · 02:11 PM",
    eta: "Mon 28 Apr · by 6:00 PM",
    currentStage: "dispatched",
    history: [
      { stage: "placed", timestamp: "Wed 23 Apr · 02:11 PM", note: "Order confirmed" },
      { stage: "approved", timestamp: "Wed 23 Apr · 03:00 PM", note: "Pre-flight check passed" },
      {
        stage: "printing",
        timestamp: "Thu 24 Apr · 08:40 AM",
        note: "Printing complete · 4 hrs run time",
      },
      { stage: "qa", timestamp: "Thu 24 Apr · 02:30 PM", note: "QA passed by operator JR" },
      {
        stage: "dispatched",
        timestamp: "Fri 25 Apr · 07:15 AM",
        note: "Picked up by StarTrack — tracking ST1043AU88102",
      },
    ],
  },
  "PH-1044": {
    id: "PH-1044",
    product: "Pull-up Banner · 850×2000mm",
    quantity: 1,
    total: 132.5,
    customer: "Liam O'Connor",
    destination: "Fortitude Valley QLD 4006",
    courier: "Toll IPEC",
    trackingNumber: "TL1044AU72615",
    placedAt: "Wed 16 Apr · 09:45 AM",
    eta: "Mon 21 Apr · delivered",
    currentStage: "delivered",
    history: [
      { stage: "placed", timestamp: "Wed 16 Apr · 09:45 AM", note: "Order confirmed" },
      { stage: "approved", timestamp: "Wed 16 Apr · 10:20 AM", note: "Pre-flight check passed" },
      { stage: "printing", timestamp: "Thu 17 Apr · 11:00 AM", note: "Printed on 13oz vinyl" },
      {
        stage: "qa",
        timestamp: "Fri 18 Apr · 09:00 AM",
        note: "QA passed · banner & stand assembled",
      },
      {
        stage: "dispatched",
        timestamp: "Fri 18 Apr · 03:20 PM",
        note: "Out for delivery via Toll IPEC",
      },
      { stage: "delivered", timestamp: "Mon 21 Apr · 11:32 AM", note: "Signed for at reception" },
    ],
  },
};

const trackSchema = z.object({
  id: z
    .string()
    .trim()
    .min(4, { message: "Order ID is too short" })
    .max(20, { message: "Order ID is too long" })
    .regex(/^[A-Za-z0-9-]+$/, { message: "Use letters, numbers and dashes only" }),
});

function lookupOrder(id: string): MockOrder | null {
  const normalized = id.trim().toUpperCase();
  return SAMPLE_ORDERS[normalized] ?? null;
}

/* ===== Page ===== */

function TrackPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/track" });

  const [input, setInput] = useState(search.id ?? "");
  const [submittedId, setSubmittedId] = useState<string | null>(search.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const order = useMemo(() => (submittedId ? lookupOrder(submittedId) : null), [submittedId]);

  // Re-sync when URL ?id changes externally
  useEffect(() => {
    if (search.id && search.id !== submittedId) {
      setInput(search.id);
      setSubmittedId(search.id);
    }
  }, [search.id, submittedId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = trackSchema.safeParse({ id: input });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid order ID");
      return;
    }
    const id = parsed.data.id.toUpperCase();
    setSearching(true);
    setTimeout(() => {
      setSubmittedId(id);
      navigate({ search: { id } });
      setSearching(false);
    }, 450);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero text-hero-foreground relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cta mb-3">
            Order Tracking
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
            Where's my <span className="text-gradient">order</span>?
          </h1>
          <p className="mt-4 text-hero-foreground/70 max-w-xl mx-auto">
            Enter the order ID from your confirmation email to see live status updates and your
            estimated delivery date.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl glass-dark">
              <div className="flex items-center flex-1 gap-2 px-3">
                <Search className="h-4 w-4 text-hero-foreground/60 flex-shrink-0" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. PH-1042"
                  maxLength={20}
                  className="w-full bg-transparent text-hero-foreground placeholder:text-hero-foreground/40 text-sm py-2 outline-none font-mono"
                  aria-label="Order ID"
                />
              </div>
              <Button
                type="submit"
                variant="cta"
                size="lg"
                disabled={searching}
                className="sm:w-auto w-full"
              >
                {searching ? "Searching…" : "Track Order"}
              </Button>
            </div>
            {error && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs bg-destructive/15 text-destructive border border-destructive/30 rounded-full px-3 py-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </div>
            )}
            <p className="mt-3 text-xs text-hero-foreground/50">
              Try sample IDs:{" "}
              {Object.keys(SAMPLE_ORDERS).map((id, i) => (
                <span key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(id);
                      setSubmittedId(id);
                      navigate({ search: { id } });
                    }}
                    className="font-mono text-cta hover:underline"
                  >
                    {id}
                  </button>
                  {i < Object.keys(SAMPLE_ORDERS).length - 1 && (
                    <span className="text-hero-foreground/30"> · </span>
                  )}
                </span>
              ))}
            </p>
          </form>
        </div>
      </section>

      {/* Result */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!submittedId && <EmptyState key="empty" />}
          {submittedId && !order && <NotFoundState key="notfound" id={submittedId} />}
          {submittedId && order && <OrderDetail key={order.id} order={order} />}
        </AnimatePresence>
      </section>
    </div>
  );
}

/* ===== States ===== */

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex h-14 w-14 rounded-2xl bg-cta/10 text-cta items-center justify-center mb-4">
        <Package className="h-6 w-6" />
      </div>
      <h2 className="font-heading text-xl font-bold text-foreground">Track any order</h2>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
        Your order ID was sent in your confirmation email. It starts with{" "}
        <span className="font-mono text-foreground">PH-</span> followed by 4 digits.
      </p>
    </motion.div>
  );
}

function NotFoundState({ id }: { id: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-card border border-border rounded-2xl p-8 text-center max-w-xl mx-auto"
    >
      <div className="inline-flex h-14 w-14 rounded-2xl bg-destructive/10 text-destructive items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="font-heading text-xl font-bold text-foreground">
        Order <span className="font-mono">{id}</span> not found
      </h2>
      <p className="text-sm text-muted-foreground mt-2">
        Double-check the ID from your confirmation email, or contact our team and we'll find it for
        you.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <Link to="/contact">
          <Button variant="cta">Contact Support</Button>
        </Link>
        <a href="tel:1300555123">
          <Button variant="outline">
            <Phone className="h-4 w-4" /> 1300 555 123
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

function OrderDetail({ order }: { order: MockOrder }) {
  const currentIndex = STAGES.findIndex((s) => s.id === order.currentStage);
  const isDelivered = order.currentStage === "delivered";
  const progress = ((currentIndex + 1) / STAGES.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Summary card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-accent/40 to-card p-5 sm:p-6 flex flex-wrap items-start justify-between gap-4 border-b border-border">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Order ID
            </p>
            <p className="font-heading text-2xl font-extrabold text-foreground mt-1 font-mono">
              {order.id}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {order.product} · Qty {order.quantity}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                isDelivered ? "bg-success/15 text-success" : "bg-cta/10 text-cta"
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              {STAGES[currentIndex].label}
            </span>
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-2">
              {isDelivered ? "Delivered" : "Estimated delivery"}
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{order.eta}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 sm:px-6 pt-5">
          <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-cta"
            />
          </div>
        </div>

        {/* Stage pipeline */}
        <div className="px-5 sm:px-6 py-5 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {STAGES.map((s, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            const Icon = s.icon;
            return (
              <div key={s.id} className="text-center">
                <div
                  className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-all ${
                    done
                      ? "bg-success/15 text-success"
                      : current
                        ? "bg-cta text-cta-foreground shadow-cta animate-pulse-glow"
                        : "bg-accent text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <p
                  className={`text-[10px] sm:text-xs font-semibold mt-2 ${
                    current ? "text-cta" : done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: timeline + shipping */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-cta" />
            <h3 className="font-heading text-lg font-bold text-foreground">Order timeline</h3>
          </div>
          <ol className="relative border-l-2 border-border ml-2 space-y-5">
            {order.history.map((h, i) => {
              const stage = STAGES.find((s) => s.id === h.stage);
              if (!stage) return null;
              const Icon = stage.icon;
              const isLatest = i === order.history.length - 1;
              return (
                <motion.li
                  key={`${h.stage}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="ml-5 relative"
                >
                  <span
                    className={`absolute -left-[30px] top-0 h-7 w-7 rounded-full flex items-center justify-center ring-4 ring-background ${
                      isLatest ? "bg-cta text-cta-foreground" : "bg-success/20 text-success"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {h.timestamp}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">{h.note}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Shipping & customer */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-cta" />
              <h3 className="font-heading text-base font-bold text-foreground">Shipping</h3>
            </div>
            <dl className="space-y-2.5 text-xs">
              <Row label="Recipient" value={order.customer} />
              <Row
                label="Destination"
                value={
                  <span className="inline-flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    {order.destination}
                  </span>
                }
              />
              <Row label="Courier" value={order.courier} />
              <Row
                label="Tracking #"
                value={<span className="font-mono">{order.trackingNumber}</span>}
              />
            </dl>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="h-4 w-4 text-cta" />
              <h3 className="font-heading text-base font-bold text-foreground">Order details</h3>
            </div>
            <dl className="space-y-2.5 text-xs">
              <Row label="Placed" value={order.placedAt} />
              <Row
                label="Total paid"
                value={
                  <span className="font-mono font-bold text-foreground">
                    AUD ${order.total.toFixed(2)}
                  </span>
                }
              />
            </dl>
          </div>

          <div className="bg-gradient-to-br from-accent/40 to-card border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground">Need help with this order?</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="tel:1300555123">
                <Button size="sm" variant="cta" className="w-full">
                  <Phone className="h-3.5 w-3.5" /> 1300 555 123
                </Button>
              </a>
              <a href="mailto:info@printhub.com.au">
                <Button size="sm" variant="outline" className="w-full">
                  <Mail className="h-3.5 w-3.5" /> Email support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground font-medium text-right">{value}</dd>
    </div>
  );
}
