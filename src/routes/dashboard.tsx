import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Film,
  Download,
  LogOut,
  ExternalLink,
  ArrowRight,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Lock,
  Settings,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard | LUMEN Client Dashboard" }],
  }),
  component: DashboardPage,
});

type UserData = { id: number; email: string; name: string };
type Order = {
  id: number;
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

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Payment Pending", color: "text-yellow-400", icon: Clock },
  paid: { label: "Order Received", color: "text-blue-400", icon: Package },
  in_progress: { label: "In Progress", color: "text-gold", icon: Loader2 },
  review: { label: "Ready for Review", color: "text-purple-400", icon: ExternalLink },
  completed: { label: "Completed", color: "text-green-400", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "text-green-400", icon: CheckCircle2 },
};

const walkthroughConfig: Record<string, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "text-muted-foreground" },
  queued: { label: "Queued", color: "text-yellow-400" },
  in_progress: { label: "Being created", color: "text-gold" },
  review: { label: "Ready for review", color: "text-purple-400" },
  completed: { label: "Complete", color: "text-green-400" },
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<{ id: number; product_name: string; message: string }[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setOrders(data.orders);

      // Check for pending image requests
      try {
        const reqRes = await fetch("/api/image-requests");
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setPendingRequests(reqData.pending || []);
        }
      } catch {}
    } catch {
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    navigate({ to: "/" });
  }

  async function handleDecision(orderId: number, decision: "agree" | "decline") {
    try {
      const res = await fetch("/api/order-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (decision === "agree" && data.url) {
        const opened = window.open(data.url, "_blank", "noopener,noreferrer");
        if (!opened) {
          try {
            window.top!.location.href = data.url;
          } catch {
            window.location.href = data.url;
          }
        }
      }
      // Refresh to reflect the new approval state.
      await loadDashboard();
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              Client Dashboard
            </p>
            <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
              Welcome, {user?.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {user?.email} · {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/account"
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Pending Image Requests Banner */}
        {pendingRequests.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-gold" />
              <h3 className="font-display text-lg text-foreground">
                {pendingRequests.length} image request{pendingRequests.length !== 1 ? "s" : ""} pending
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              We need a few more photos to create your walkthrough. Please upload them when you can.
            </p>
            <div className="mt-4 space-y-2">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.product_name}</p>
                    <p className="text-xs text-muted-foreground/60 line-clamp-1">{req.message}</p>
                  </div>
                  <Link
                    to="/upload-images"
                    search={{ request: String(req.id) }}
                    className="rounded-full gold-fill px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
                  >
                    Upload
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Package className="h-5 w-5 text-gold" />
            <p className="mt-3 text-2xl font-display text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Loader2 className="h-5 w-5 text-gold" />
            <p className="mt-3 text-2xl font-display text-foreground">
              {orders.filter((o) => o.status === "in_progress").length}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <CheckCircle2 className="h-5 w-5 text-gold" />
            <p className="mt-3 text-2xl font-display text-foreground">
              {orders.filter((o) => o.status === "completed" || o.status === "delivered").length}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Orders */}
        <div className="mt-12">
          <h2 className="font-display text-2xl text-foreground">Your Orders</h2>

          {orders.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-xl text-foreground">No orders yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When you purchase a walkthrough or website, it will appear here.
              </p>
              <Link
                to="/pricing"
                className="mt-6 inline-flex items-center gap-2 rounded-full gold-fill px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
              >
                View Pricing <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] ?? statusConfig["pending"];
                const walkthrough = walkthroughConfig[order.walkthrough_status] ?? walkthroughConfig["not_started"];
                const StatusIcon = status?.icon ?? Clock;

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl text-foreground">
                            {order.product_name}
                          </h3>
                          <span className={`flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${status?.color ?? 'text-muted-foreground'}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status?.label ?? 'Unknown'}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                          <div>
                            <span className="text-xs uppercase tracking-wider">Ordered</span>
                            <p>{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider">Amount</span>
                            <p>£{(order.amount / 100).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider">Walkthrough</span>
                            <p className={walkthrough?.color ?? 'text-muted-foreground'}>{walkthrough?.label ?? 'Unknown'}</p>
                          </div>
                          {order.notes && (
                            <div>
                              <span className="text-xs uppercase tracking-wider">Notes</span>
                              <p>{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pay-after-approval: demo ready & not yet paid → Agree / Decline */}
                      {order.status === "pending" &&
                        order.walkthrough_status === "review" &&
                        order.approval_status === "pending" &&
                        order.walkthrough_url && (
                          <div className="mt-4 w-full rounded-xl border border-gold/30 bg-gold/5 p-5">
                            <p className="text-xs font-bold uppercase tracking-widest text-gold">
                              Your demo is ready — approve it to pay
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Watch your walkthrough below. If you're happy with it, approve and
                              you'll be taken to secure payment. Not quite right? Decline and we'll
                              revise it.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <a
                                href={order.walkthrough_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full border border-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold transition-colors hover:bg-gold/10"
                              >
                                <Film className="h-3.5 w-3.5" />
                                Watch Demo
                              </a>
                              <button
                                onClick={() => handleDecision(order.id, "agree")}
                                className="flex items-center gap-2 rounded-full gold-fill px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-gold-glow transition hover:brightness-110"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                Agree — Pay £{(order.amount / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                              </button>
                              <button
                                onClick={() => handleDecision(order.id, "decline")}
                                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-red-400 hover:text-red-400"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                Decline — Request Changes
                              </button>
                            </div>
                          </div>
                        )}

                      {order.approval_status === "agreed" && order.status === "pending" && (
                        <div className="mt-4 w-full rounded-xl border border-border bg-surface/60 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                            Approved — payment in progress
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            You approved the demo. If the payment window didn't open, pay now:
                          </p>
                          <button
                            onClick={() => handleDecision(order.id, "agree")}
                            className="mt-3 flex items-center gap-2 rounded-full gold-fill px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-gold-glow transition hover:brightness-110"
                          >
                            <Lock className="h-3.5 w-3.5" />
                            Pay £{(order.amount / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                          </button>
                        </div>
                      )}

                      {order.approval_status === "declined" && order.status === "pending" && (
                        <div className="mt-4 w-full rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                            Demo declined
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            You've asked for changes — we're on it and will send an updated demo.
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {order.walkthrough_url && (
                          <a
                            href={order.walkthrough_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
                          >
                            <Film className="h-3.5 w-3.5" />
                            Watch Walkthrough
                          </a>
                        )}
                        {order.walkthrough_url && (
                          <a
                            href={order.walkthrough_url}
                            download
                            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Domino's-style step tracker */}
                    {(() => {
                      const steps = [
                        { key: "received", label: "Order Received", icon: Package },
                        { key: "in_progress", label: "Filming & Editing", icon: Loader2 },
                        { key: "review", label: "Ready for Review", icon: ExternalLink },
                        { key: "complete", label: "Delivered", icon: CheckCircle2 },
                      ];

                      // Map order status + walkthrough_status to current step index
                      let currentStep = 0;
                      if (order.status === "completed" || order.status === "delivered") currentStep = 3;
                      else if (order.walkthrough_status === "review") currentStep = 2;
                      else if (order.status === "in_progress" || order.walkthrough_status === "in_progress") currentStep = 1;
                      else if (order.status === "paid") currentStep = 0;

                      return (
                        <div className="mt-6 rounded-xl border border-border bg-background/50 p-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-4">
                            Order Tracker
                          </p>
                          <div className="flex items-start justify-between">
                            {steps.map((step, i) => {
                              const isComplete = i < currentStep;
                              const isCurrent = i === currentStep;
                              const StepIcon = step.icon;

                              return (
                                <div key={step.key} className="flex flex-1 flex-col items-center relative">
                                  {/* Connector line (not on first step) */}
                                  {i > 0 && (
                                    <div
                                      className={`absolute top-3 right-1/2 h-[2px] w-full transition-colors duration-500 ${
                                        isComplete || isCurrent ? "bg-gold" : "bg-border"
                                      }`}
                                    />
                                  )}

                                  {/* Step circle */}
                                  <div
                                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                      isComplete
                                        ? "border-gold bg-gold text-primary-foreground"
                                        : isCurrent
                                        ? "border-gold bg-gold/20 text-gold"
                                        : "border-border bg-surface text-muted-foreground/40"
                                    }`}
                                  >
                                    {isComplete ? (
                                      <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                      <StepIcon className={`h-3 w-3 ${isCurrent ? "animate-pulse" : ""}`} />
                                    )}
                                  </div>

                                  {/* Label */}
                                  <p
                                    className={`mt-2 text-center text-[10px] font-medium uppercase tracking-wider leading-tight ${
                                      isComplete || isCurrent ? "text-gold" : "text-muted-foreground/40"
                                    }`}
                                  >
                                    {step.label}
                                  </p>

                                  {/* Current step indicator */}
                                  {isCurrent && (
                                    <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gold/60">
                                      ← Current
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="font-display text-2xl text-foreground">Need Something Else?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Browse our services or get in touch with the team.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/pricing"
              className="rounded-full gold-fill px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
            >
              View Pricing
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-border px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
