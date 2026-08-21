import { Link } from "@tanstack/react-router";
import type { ServicePage } from "@/content/services";
import { BuyButton } from "@/components/buy-button";

export function OfferingPage({ offering }: { offering: ServicePage }) {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          {offering.eyebrow}
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl">
          {offering.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{offering.lead}</p>

        <div className="mt-14 space-y-12">
          {offering.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-display text-3xl text-gold">{section.heading}</h2>
              )}
              <div className={section.heading ? "mt-4 space-y-4" : "space-y-4"}>
                {section.body.map((p, j) => (
                  <p key={j} className="leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-surface p-10 text-center bg-noise">
          <h2 className="font-display text-4xl text-foreground">{offering.priceLabel}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{offering.priceNote}</p>
          <div className="mx-auto mt-8 max-w-sm">
            <BuyButton slug={offering.slug} label={offering.ctaLabel} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Secure payment via Stripe. Prefer to talk first?{" "}
            <Link to="/contact" className="text-gold hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
