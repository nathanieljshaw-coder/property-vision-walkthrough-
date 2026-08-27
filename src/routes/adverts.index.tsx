import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Megaphone } from "lucide-react";
import { advertPages } from "@/content/adverts";

export const Route = createFileRoute("/adverts/")({
  head: () => ({
    meta: [
      { title: "Adverts | LUMEN Digital Experiences" },
      {
        name: "description",
        content: "Professional adverts built from your existing photographs and videos for social media, websites and campaigns.",
      },
    ],
  }),
  component: AdvertsPage,
});

function AdvertsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">What We Create</p>
        <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">Adverts</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Professional advert content built around your brand, your message and the customers you want to reach.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {advertPages.map((advert) => (
            <Link
              key={advert.slug}
              to="/adverts/$slug"
              params={{ slug: advert.slug }}
              className="card-lift rounded-2xl border border-border bg-surface p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <Megaphone className="h-5 w-5 text-gold" />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{advert.priceLabel}</p>
              <h2 className="mt-4 font-display text-3xl text-foreground">{advert.nav}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{advert.lead}</p>
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
