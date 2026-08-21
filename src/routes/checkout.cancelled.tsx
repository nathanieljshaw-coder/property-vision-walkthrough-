import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/checkout/cancelled")({
  head: () => ({
    meta: [
      { title: "Checkout Cancelled | LUMEN" },
      { name: "description", content: "Your checkout was cancelled and you have not been charged." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout Cancelled | LUMEN" },
      { property: "og:description", content: "No payment was taken — you can pick up where you left off." },
    ],
  }),
  component: CancelledPage,
});

function CancelledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="max-w-lg rounded-3xl border border-border bg-surface p-12 text-center bg-noise">
        <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 font-display text-4xl text-foreground">Checkout Cancelled</h1>
        <p className="mt-4 text-muted-foreground">
          No payment was taken. You can return to pricing whenever you're ready, or contact us with
          any questions first.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/pricing"
            className="rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Back To Pricing
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-border px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-gold transition hover:bg-gold hover:text-primary-foreground"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
