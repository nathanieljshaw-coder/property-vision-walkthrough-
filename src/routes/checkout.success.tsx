import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Payment Confirmed | LUMEN" },
      { name: "description", content: "Your payment was successful and your project is booked in." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Payment Confirmed | LUMEN" },
      { property: "og:description", content: "Thank you — your LUMEN project is confirmed." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="max-w-lg rounded-3xl border border-border bg-surface p-12 text-center bg-noise">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-6 font-display text-4xl text-foreground">Payment Confirmed</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you. Your project is booked in and we'll email you shortly to gather your
          photographs, videos and brand details.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
