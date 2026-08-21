import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { packagePages, servicePages } from "@/content/services";
import { BuyButton } from "@/components/buy-button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Packages | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "Simple, honest pricing for websites and cinematic walkthroughs. Professional websites from £399, complete digital experiences from £1,499.",
      },
      { property: "og:title", content: "Pricing & Packages | LUMEN Digital Experiences" },
      {
        property: "og:description",
        content:
          "Websites and cinematic walkthroughs from £199. Pay securely online and we'll start your project.",
      },
    ],
  }),
  component: PricingPage,
});

const features: Record<string, string[]> = {
  professional: [
    "Up to eight designed pages",
    "Custom branding & animations",
    "Professional galleries",
    "Contact forms & analytics",
    "Walkthrough integration",
    "Mobile optimisation",
  ],
  business: [
    "Multiple pages & bespoke sections",
    "Advanced animations",
    "Multiple walkthroughs",
    "Booking & contact integrations",
    "Advanced SEO & analytics",
    "Custom domain setup",
  ],
  complete: [
    "Website + cinematic walkthroughs",
    "Interactive experiences",
    "Multiple properties & locations",
    "Advanced branding",
    "SEO, analytics & domain setup",
    "Fully custom functionality",
  ],
};

const addOns = [
  { name: "Cinematic Walkthrough", price: "From £99" },
  { name: "Additional Property", price: "From £149" },
  { name: "Custom Branding", price: "From £49" },
  { name: "Website Maintenance", price: "From £25/mo" },
  { name: "Custom Domain", price: "From £20/yr" },
  { name: "Bespoke Experience", price: "On request" },
];

function PricingPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Packages</p>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            Simple, Honest Pricing
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Choose a package and pay securely with Stripe. We'll be in touch straight away to start
            your project.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packagePages.map((p, i) => (
            <div
              key={p.slug}
              className={`flex flex-col rounded-3xl border bg-surface p-10 ${
                i === 1 ? "border-gold shadow-gold-glow" : "border-border"
              }`}
            >
              {i === 1 && (
                <span className="mb-4 self-start rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  Most Popular
                </span>
              )}
              <h2 className="font-display text-3xl text-foreground">{p.nav}</h2>
              <p className="mt-2 font-display text-5xl text-gold">{p.priceLabel}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.lead}</p>

              <ul className="mt-8 flex-1 space-y-3 text-sm text-muted-foreground">
                {features[p.slug]?.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <BuyButton
                  slug={p.slug}
                  label={p.ctaLabel}
                  variant={i === 1 ? "solid" : "outline"}
                />
                <Link
                  to="/packages/$slug"
                  params={{ slug: p.slug }}
                  className="block text-center text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
                >
                  Full details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="font-display text-3xl text-foreground">Individual Experiences</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicePages.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-display text-xl text-foreground">{s.nav}</h3>
                <p className="mt-1 text-sm font-semibold text-gold">{s.priceLabel}</p>
                <div className="mt-6">
                  <BuyButton slug={s.slug} label="Get Started" variant="outline" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-surface p-10 bg-noise">
          <h2 className="font-display text-3xl text-foreground">Optional Add-Ons</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between rounded-xl border border-border px-5 py-4"
              >
                <span className="text-sm font-semibold text-foreground">{a.name}</span>
                <span className="text-xs font-bold text-gold">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
