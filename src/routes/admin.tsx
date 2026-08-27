import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Package,
  Clock,
  CheckCircle2,
  Film,
  Loader2,
  Mail,
  ExternalLink,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Send,
  Upload,
  Check,
  Phone,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | LUMEN" }],
  }),
  component: AdminPage,
});

type AdminOrder = {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  user_phone: string | null;
  phone: string | null;
  whatsapp_opt_in: boolean;
  auto_email: boolean;
  slug: string;
  product_name: string;
  amount: number;
  status: string;
  approval_status: "pending" | "agreed" | "declined" | null;
  walkthrough_status: string;
  walkthrough_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const orderStatuses = [
  { value: "pending", label: "Payment Pending", color: "text-yellow-400 bg-yellow-400/10" },
  { value: "paid", label: "Paid", color: "text-blue-400 bg-blue-400/10" },
  { value: "in_progress", label: "In Progress", color: "text-gold bg-gold/10" },
  { value: "review", label: "Ready for Review", color: "text-purple-400 bg-purple-400/10" },
  { value: "completed", label: "Completed", color: "text-green-400 bg-green-400/10" },
  { value: "delivered", label: "Delivered", color: "text-green-400 bg-green-400/10" },
];

const walkthroughStatuses = [
  { value: "not_started", label: "Not Started", color: "text-muted-foreground" },
  { value: "queued", label: "Queued", color: "text-yellow-400" },
  { value: "in_progress", label: "Being Created", color: "text-gold" },
  { value: "review", label: "Ready for Review", color: "text-purple-400" },
  { value: "completed", label: "Complete", color: "text-green-400" },
];

const quickMessages = [
  { key: "work_started", label: "Work started", message: "Hi {name}, we've started working on your {product}. We'll keep you updated!" },
  { key: "demo_ready", label: "Demo ready", message: "Hi {name}, your {product} demo is ready for review! Check your dashboard for the preview link." },
  { key: "need_info", label: "Need info", message: "Hi {name}, we need some additional information to complete your {product}. Could you please get back to us?" },
  { key: "delivered", label: "Delivered", message: "Hi {name}, your {product} has been delivered! You can watch it from your dashboard. Thank you for choosing LUMEN!" },
];

type BrandedTemplate = "work_started" | "demo_ready" | "need_info" | "delivered";

function renderTemplate(message: string, name: string, product: string, url: string | null) {
  return message
    .replace("{name}", name)
    .replace("{product}", product)
    .replace("{url}", url || "your dashboard");
}

function AdminPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [demoUrlOrderId, setDemoUrlOrderId] = useState<number | null>(null);
  const [demoUrlValue, setDemoUrlValue] = useState("");
  const [madeWalkthroughs, setMadeWalkthroughs] = useState<{ name: string; url: string }[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
    // Load the walkthrough videos that were made for the portfolio so they can
    // be picked directly as the demo instead of typing a link.
    fetch("/api/admin/walkthroughs")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.walkthroughs) setMadeWalkthroughs(d.walkthroughs);
      })
      .catch(() => {});
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch {
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }

  async function updateField(orderId: number, field: string, value: string) {
    setUpdatingId(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, field, value }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, [field]: value, updated_at: new Date().toISOString() } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.user_name.toLowerCase().includes(q) ||
        o.user_email.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Revenue only counts orders that have actually been paid for.
  const paidOrders = orders.filter(
    (o) =>
      o.status === "paid" ||
      o.status === "in_progress" ||
      o.status === "review" ||
      o.status === "completed" ||
      o.status === "delivered"
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending" || o.status === "paid").length,
    inProgress: orders.filter((o) => o.status === "in_progress").length,
    review: orders.filter((o) => o.status === "review").length,
    completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
    revenue: paidOrders.reduce((sum, o) => sum + o.amount, 0),
    revenuePending: pendingOrders.reduce((sum, o) => sum + o.amount, 0),
    avgOrder: paidOrders.length
      ? Math.round(paidOrders.reduce((sum, o) => sum + o.amount, 0) / paidOrders.length)
      : 0,
  };

  // Revenue by product category (slug -> friendly name).
  const categoryNames: Record<string, string> = {
    airbnb: "Airbnb & Rentals",
    "airbnb-holiday-rentals": "Airbnb & Rentals",
    hotels: "Hotels",
    golf: "Golf Courses & Resorts",
    "ski-biking-resorts": "Ski & Biking Resorts",
    websites: "Websites",
    professional: "Professional Website",
    business: "Business Website",
    complete: "Complete Digital Experience",
  };
  const categorySlugs = ["airbnb", "airbnb-holiday-rentals", "hotels", "golf", "websites", "professional", "business", "complete"];
  // Group paid orders by resolved category name (merges legacy slugs like
  // airbnb-holiday-rentals into the same bucket as airbnb).
  const byCat = new Map<string, { name: string; count: number; amount: number }>();
  for (const o of paidOrders) {
    const name = categoryNames[o.slug] ?? o.slug;
    const existing = byCat.get(name) ?? { name, count: 0, amount: 0 };
    existing.count += 1;
    existing.amount += o.amount;
    byCat.set(name, existing);
  }
  const revenueByCategory = [...byCat.values()]
    .sort((a, b) => b.amount - a.amount);

  // Monthly revenue trend — last 6 months (incl. current), from paid orders.
  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const now = new Date();
  const months: { key: string; label: string; amount: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: d.toLocaleDateString("en-GB", { month: "short" }), amount: 0, count: 0 });
  }
  const monthIndex = new Map(months.map((m) => [m.key, m]));
  for (const o of paidOrders) {
    const m = monthIndex.get(monthKey(new Date(o.created_at)));
    if (m) {
      m.amount += o.amount;
      m.count += 1;
    }
  }
  const maxMonthAmount = Math.max(...months.map((m) => m.amount), 1);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                Admin Dashboard
              </p>
            </div>
            <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
              Order Management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage orders, update statuses, and contact customers.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Package className="h-4 w-4 text-gold" />
            <p className="mt-2 text-2xl font-display text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Clock className="h-4 w-4 text-yellow-400" />
            <p className="mt-2 text-2xl font-display text-foreground">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Awaiting Action</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Loader2 className="h-4 w-4 text-gold" />
            <p className="mt-2 text-2xl font-display text-foreground">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Eye className="h-4 w-4 text-purple-400" />
            <p className="mt-2 text-2xl font-display text-foreground">{stats.review}</p>
            <p className="text-xs text-muted-foreground">For Review</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <p className="mt-2 text-2xl font-display text-foreground">
              £{(stats.revenue / 100).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                Revenue Overview
              </p>
              <h2 className="mt-2 font-display text-2xl text-foreground">
                £{(stats.revenue / 100).toFixed(0)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  confirmed · {paidOrders.length} paid order{paidOrders.length === 1 ? "" : "s"}
                </span>
              </h2>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Average order</p>
                <p className="font-display text-lg text-foreground">
                  £{(stats.avgOrder / 100).toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Awaiting payment</p>
                <p className="font-display text-lg text-yellow-400">
                  £{(stats.revenuePending / 100).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {revenueByCategory.length > 0 ? (
            <div className="mt-6 space-y-4">
              {revenueByCategory.map((cat) => {
                const pct = stats.revenue > 0 ? (cat.amount / stats.revenue) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <span className="text-muted-foreground">
                        £{(cat.amount / 100).toFixed(0)}{" "}
                        <span className="text-xs">· {cat.count} order{cat.count === 1 ? "" : "s"} · {pct.toFixed(0)}%</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              No paid orders yet — revenue appears here once a checkout completes.
            </p>
          )}

          {/* Monthly revenue trend */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                Monthly Revenue Trend
              </p>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="mt-5 flex h-40 items-end gap-3 sm:gap-4">
              {months.map((m) => {
                const pct = maxMonthAmount > 0 ? (m.amount / maxMonthAmount) * 100 : 0;
                const barH = Math.max((pct / 100) * 120, m.amount > 0 ? 8 : 3);
                const isCurrent = m.key === monthKey(now);
                return (
                  <div key={m.key} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative flex h-[120px] w-full items-end justify-center">
                      {m.amount > 0 && (
                        <span className="absolute -top-1 text-[10px] font-semibold text-foreground">
                          £{(m.amount / 100).toFixed(0)}
                        </span>
                      )}
                      <div
                        title={`${m.label}: £${(m.amount / 100).toFixed(0)} · ${m.count} order${m.count === 1 ? "" : "s"}`}
                        className={`w-full max-w-14 rounded-t-lg transition-all ${
                          isCurrent
                            ? "bg-gradient-to-t from-gold/60 to-gold"
                            : "bg-gradient-to-t from-gold/30 to-gold/60"
                        }`}
                        style={{ height: `${barH}px` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {["all", "paid", "in_progress", "review", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === f
                    ? "gold-fill text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                }`}
              >
                {f === "all" ? "All" : orderStatuses.find((s) => s.value === f)?.label ?? f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold sm:w-80"
          />
        </div>

        {/* Orders List */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-xl text-foreground">No orders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search ? "Try a different search term." : "No orders match the current filter."}
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const isExpanded = expandedId === order.id;
              const isUpdating = updatingId === order.id;
              const orderStatus = orderStatuses.find((s) => s.value === order.status);
              const walkStatus = walkthroughStatuses.find((s) => s.value === order.walkthrough_status);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-surface overflow-hidden"
                >
                  {/* Main Row */}
                  <div
                    className="flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-surface/80"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display text-lg text-foreground truncate">
                          {order.product_name}
                        </h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${orderStatus?.color ?? ""}`}>
                          {orderStatus?.label ?? order.status}
                        </span>
                        {order.walkthrough_status !== "not_started" && (
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${walkStatus?.color ?? ""}`}>
                            Walkthrough: {walkStatus?.label ?? order.walkthrough_status}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {order.user_name} ({order.user_email})
                        </span>
                        {order.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.phone}
                          </span>
                        )}
                        {order.whatsapp_opt_in && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                            WhatsApp opt-in
                          </span>
                        )}
                        {order.status === "pending" && order.approval_status === "pending" && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                            Awaiting customer approval
                          </span>
                        )}
                        {order.approval_status === "agreed" && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                            Approved — pay link sent
                          </span>
                        )}
                        {order.approval_status === "declined" && (
                          <span className="flex items-center gap-1 rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                            Customer declined demo
                          </span>
                        )}
                        <span>£{(order.amount / 100).toFixed(2)}</span>
                        <span>{new Date(order.created_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${order.user_email}?subject=Your LUMEN ${order.product_name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                        title="Email customer"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Panel */}
                  {isExpanded && (
                    <div className="border-t border-border bg-background/50 p-6 space-y-6">
                      {/* Status Controls */}
                      <div className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Auto-send emails & WhatsApp
                          </p>
                          <p className="text-[11px] text-muted-foreground/70">
                            Status changes send the matching email and WhatsApp message automatically
                          </p>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={order.auto_email !== false}
                            onChange={(e) =>
                              updateField(order.id, "auto_email", e.target.checked ? "true" : "false")
                            }
                            className="h-4 w-4 shrink-0 accent-[#d4af37]"
                          />
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {order.auto_email !== false ? "On" : "Off"}
                          </span>
                        </label>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Order Status
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {orderStatuses.map((s) => (
                              <button
                                key={s.value}
                                disabled={isUpdating}
                                onClick={() => updateField(order.id, "status", s.value)}
                                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                                  order.status === s.value
                                    ? s.color + " ring-1 ring-current"
                                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                                } disabled:opacity-50`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Walkthrough Status
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {walkthroughStatuses.map((s) => (
                              <button
                                key={s.value}
                                disabled={isUpdating}
                                onClick={() => {
                                  if (s.value === "review") {
                                    // Demo ready — ask for the demo URL first
                                    setDemoUrlOrderId(order.id);
                                    setDemoUrlValue(order.walkthrough_url ?? "");
                                  } else {
                                    updateField(order.id, "walkthrough_status", s.value);
                                  }
                                }}
                                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                                  order.walkthrough_status === s.value
                                    ? "border border-current text-gold ring-1 ring-gold"
                                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                                } disabled:opacity-50`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Demo URL prompt (shown when Ready for Review clicked) */}
                      {demoUrlOrderId === order.id && (
                        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                            Add Your Demo Link
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paste the demo/video URL to share with {order.user_name}, then
                            confirm to mark it ready for review.
                          </p>
                          <input
                            type="url"
                            value={demoUrlValue}
                            onChange={(e) => setDemoUrlValue(e.target.value)}
                            placeholder="https://... or upload a file below"
                            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                          />
                          {madeWalkthroughs.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Pick one we made
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {madeWalkthroughs.map((w) => (
                                  <button
                                    key={w.url}
                                    type="button"
                                    onClick={() => setDemoUrlValue(w.url)}
                                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                                      demoUrlValue === w.url
                                        ? "border-gold bg-gold/10 text-gold"
                                        : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                                    }`}
                                  >
                                    {w.name.replace(/-/g, " ")}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <UploadFileButton
                            onUploaded={(url) => setDemoUrlValue(url)}
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={isUpdating || !demoUrlValue.trim()}
                              onClick={async () => {
                                await updateField(order.id, "walkthrough_url", demoUrlValue.trim());
                                await updateField(order.id, "walkthrough_status", "review");
                                setDemoUrlOrderId(null);
                              }}
                              className="rounded-full gold-fill px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:opacity-50"
                            >
                              Save & Mark Ready
                            </button>
                            <button
                              onClick={() => setDemoUrlOrderId(null)}
                              className="rounded-full border border-border px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Walkthrough URL */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Walkthrough URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            defaultValue={order.walkthrough_url ?? ""}
                            placeholder="https://..."
                            onBlur={(e) => {
                              if (e.target.value !== (order.walkthrough_url ?? "")) {
                                updateField(order.id, "walkthrough_url", e.target.value);
                              }
                            }}
                            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                          />
                          {order.walkthrough_url && (
                            <a
                              href={order.walkthrough_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <div className="mt-2">
                          <UploadFileButton
                            onUploaded={(url) => updateField(order.id, "walkthrough_url", url)}
                          />
                        </div>
                      </div>

                      {/* Request Images from Customer */}
                      <RequestImagesButton orderId={order.id} orderName={order.user_name} productName={order.product_name} />

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Internal Notes
                        </label>
                        <textarea
                          defaultValue={order.notes ?? ""}
                          placeholder="Add notes about this order (only visible to you)..."
                          rows={3}
                          onBlur={(e) => {
                            if (e.target.value !== (order.notes ?? "")) {
                              updateField(order.id, "notes", e.target.value);
                            }
                          }}
                          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                        />
                      </div>

                      {/* Message Composer */}
                      <MessageComposer
                        order={order}
                        onUpdatePhone={async (phone) => {
                          await updateField(order.id, "phone", phone);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Message Composer ──────────────────────────────────── */

function MessageComposer({ order, onUpdatePhone }: { order: AdminOrder; onUpdatePhone: (phone: string) => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(order.user_phone ?? "");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "both">("email");
  const [template, setTemplate] = useState<BrandedTemplate>("work_started");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function applyTemplate(key: BrandedTemplate, tmpl: string) {
    setTemplate(key);
    setMessage(renderTemplate(tmpl, order.user_name, order.product_name, order.walkthrough_url));
    setResult(null);
  }

  async function send() {
    if (!message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      if (channel === "whatsapp") {
        if (!phone.trim()) {
          setResult({ ok: false, text: "Enter a phone number first." });
          setSending(false);
          return;
        }
        // WhatsApp — works reliably on Mac desktop + phone
        let normalized = phone.trim().replace(/[\s()-]/g, "");
        if (normalized.startsWith("0")) normalized = "44" + normalized.slice(1);
        else normalized = normalized.replace(/^\+/, "");
        const waUrl = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
        setResult({ ok: true, text: "WhatsApp opened — hit send to message them." });
      } else if (channel === "both") {
        if (!phone.trim()) {
          setResult({ ok: false, text: "Enter a phone number first." });
          setSending(false);
          return;
        }
        // WhatsApp + email draft, opened together
        let normalized = phone.trim().replace(/[\s()-]/g, "");
        if (normalized.startsWith("0")) normalized = "44" + normalized.slice(1);
        else normalized = normalized.replace(/^\+/, "");
        const waUrl = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
        const subject = "Your LUMEN " + order.product_name;
        const mailUrl = `mailto:${order.user_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailUrl;
        setResult({ ok: true, text: "WhatsApp and your email draft both opened — hit send in each." });
      } else {
        // Branded email — sent by the server with the LUMEN logo and template styling
        const res = await fetch("/api/admin/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, template, message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send.");
        const d = data.delivery;
        if (d?.customer === "blocked") {
          setResult({
            ok: false,
            text: `Delivered to your admin inbox, but the customer copy was blocked${d.detail ? ` — ${d.detail}` : ""}`,
          });
        } else if (d?.customer === "delivered") {
          setResult({ ok: true, text: `Email delivered to ${data.sentTo || order.user_email}.` });
        } else {
          setResult({ ok: true, text: `Email sent to ${data.sentTo || order.user_email}.` });
        }
      }
    } catch (err: any) {
      setResult({ ok: false, text: err.message || "Failed to send." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Send Message to {order.user_name}
        </label>

        {/* Channel + recipient */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-border p-1">
            <button
              onClick={() => setChannel("email")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                channel === "email" ? "gold-fill text-primary-foreground" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <Mail className="h-3 w-3" />
              Email
            </button>
            <button
              onClick={() => setChannel("whatsapp")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                channel === "whatsapp" ? "gold-fill text-primary-foreground" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </button>
            <button
              onClick={() => setChannel("both")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                channel === "both" ? "gold-fill text-primary-foreground" : "text-muted-foreground hover:text-gold"
              }`}
            >
              <Send className="h-3 w-3" />
              WhatsApp + Email
            </button>
          </div>

          {(channel === "whatsapp" || channel === "both") && (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => {
                if (phone !== (order.user_phone ?? "")) onUpdatePhone(phone);
              }}
              placeholder="Phone number, e.g. 07700 900123"
              className="flex-1 min-w-56 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          )}
          {channel === "email" && (
            <span className="text-xs text-muted-foreground">{order.user_email}</span>
          )}
        </div>

        {/* Recipient summary (shown for WhatsApp + Email) */}
        {channel === "both" && (
          <div className="mt-3 rounded-xl border border-border bg-background/50 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recipients
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <Mail className="h-3.5 w-3.5 text-gold" />
                {order.user_email}
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-gold" />
                {phone.trim() ? phone : "No phone number set"}
              </span>
            </div>
          </div>
        )}

        {/* Templates */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickMessages.map((qm) => (
            <button
              key={qm.key}
              onClick={() => applyTemplate(qm.key as BrandedTemplate, qm.message)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                channel === "email" && template === qm.key
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted-foreground hover:border-gold hover:text-gold"
              }`}
            >
              <Send className="h-3 w-3" />
              {qm.label}
            </button>
          ))}
        </div>
        {channel === "email" && (
          <p className="text-[11px] text-muted-foreground">
            Sent with the LUMEN logo and template styling. Pick a preset above or write your own below.
          </p>
        )}

        {/* Message body */}
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (channel === "email") setTemplate("custom" as BrandedTemplate);
          }}
          rows={3}
          placeholder="Write a custom message, or click a template above. Use {name}, {product}, {url} — they'll be filled in automatically."
          className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
        />

        {/* Send + status */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={send}
            disabled={sending || !message.trim()}
            className="flex items-center gap-2 rounded-full gold-fill px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {sending
              ? "Sending..."
              : channel === "whatsapp"
              ? "Open WhatsApp"
              : channel === "both"
              ? "Open Both"
              : "Send Email"}
          </button>          {result && (
            <span className={`text-xs ${result.ok ? "text-green-400" : "text-red-400"}`}>
              {result.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── File Upload Button ────────────────────────────────── */

function UploadFileButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    setDone(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUploaded(data.url);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-gold/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gold transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : done ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        {uploading ? "Uploading..." : done ? "Uploaded — saved!" : "Upload walkthrough file"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/*,.mp4,.mov"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Request Images Button ─────────────────────────────── */

function RequestImagesButton({ orderId, orderName, productName }: { orderId: number; orderName: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(`Hi ${orderName.split(" ")[0] || "there"},\n\nWe need a few more photos to create your ${productName} walkthrough. Could you please upload:\n\n• 5-10 high-quality interior photos\n• 2-3 exterior/entrance shots\n• Any brand logos or signage\n\nUse the link below to upload them directly:\n`);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [existingRequests, setExistingRequests] = useState<any[]>([]);

  async function loadRequests() {
    try {
      const res = await fetch(`/api/admin/request-images?orderId=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setExistingRequests(data.requests || []);
      }
    } catch {}
  }

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/request-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult({ ok: true, text: "Image request sent!" });
      loadRequests();
    } catch (err: any) {
      setResult({ ok: false, text: err.message || "Failed" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <button
        onClick={() => { setOpen(!open); if (!open) loadRequests(); }}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors"
      >
        <Camera className="h-4 w-4" />
        {open ? "Hide" : "Request Images from Customer"}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
            placeholder="Describe what images you need..."
          />

          {result && (
            <p className={`text-xs ${result.ok ? "text-gold" : "text-red-400"}`}>
              {result.text}
            </p>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="rounded-full gold-fill px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Request"}
          </button>

          {existingRequests.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Previous Requests
              </p>
              <div className="space-y-2">
                {existingRequests.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-GB")}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase ${
                        r.status === "fulfilled" ? "text-green-400" : "text-gold"
                      }`}>
                        {r.status === "fulfilled" ? "Fulfilled" : "Pending"}
                      </span>
                    </div>
                    {r.uploads?.length > 0 && (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {r.uploads.length} image{r.uploads.length !== 1 ? "s" : ""} uploaded
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}