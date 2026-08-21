import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Film, Home, Landmark } from "lucide-react";
import { servicePages } from "@/content/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUMEN | Websites & Cinematic Walkthroughs" },
      {
        name: "description",
        content:
          "LUMEN creates professional websites and cinematic digital walkthroughs for holiday rentals, hotels, golf resorts and premium businesses.",
      },
      { property: "og:title", content: "LUMEN | Websites & Cinematic Walkthroughs" },
      {
        property: "og:description",
        content:
          "Let customers explore your property, hotel or course before they arrive. Websites and cinematic walkthroughs from £199.",
      },
    ],
  }),
  component: Index,
});

const icons = { airbnb: Home, hotels: Building2, golf: Landmark, websites: Film } as const;

function Index() {
  return (
    <div>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          src="/walkthroughs/hero-montage.mp4"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background to-surface-raised opacity-85" />
        <div
          aria-hidden
          className="absolute -right-40 top-24 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-gold/10 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                Professional Websites & Cinematic Walkthroughs
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.05] text-foreground sm:text-7xl lg:text-8xl">
              Your Business.
              <br />
              Your Story.
              <br />
              <span className="gold-text">Your Experience.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              You already have the photographs, videos, information and ideas. We turn them into a
              professional digital experience that allows your customers to see, explore and
              understand your business before they arrive.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
              >
                Create Your Experience <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center rounded-full border border-border px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-gold transition hover:bg-gold hover:text-primary-foreground"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Tailored Solutions
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Designed around the way your customers decide
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicePages.map((s) => {
              const Icon = icons[s.slug as keyof typeof icons];
              return (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="card-lift group rounded-2xl border border-border bg-surface p-8"
                >
                  <Icon className="h-7 w-7 text-gold" />
                  <h3 className="mt-6 font-display text-2xl text-foreground">{s.nav}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {s.lead}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                    {s.priceLabel} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-24 bg-noise">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Give customers a reason to explore before they arrive
          </h2>
          <p className="mt-5 text-muted-foreground">
            Websites, cinematic walkthroughs and complete digital platforms, built around your
            brand and delivered from your existing photographs and videos.
          </p>
          <Link
            to="/pricing"
            className="mt-10 inline-flex items-center gap-2 rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            See Pricing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
