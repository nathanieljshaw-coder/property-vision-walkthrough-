import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { servicePages } from "@/content/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our Services | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "Cinematic walkthroughs and professional websites for holiday rentals, hotels, golf courses and businesses of every size.",
      },
      { property: "og:title", content: "Our Services | LUMEN Digital Experiences" },
      {
        property: "og:description",
        content:
          "Walkthroughs and websites for holiday rentals, hotels, golf resorts and premium businesses.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          What We Create
        </p>
        <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">Our Services</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every service is built around your business, your existing content and the customers you
          want to reach.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {servicePages.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="card-lift rounded-2xl border border-border bg-surface p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {s.priceLabel}
              </p>
              <h2 className="mt-4 font-display text-3xl text-foreground">{s.nav}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.lead}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
