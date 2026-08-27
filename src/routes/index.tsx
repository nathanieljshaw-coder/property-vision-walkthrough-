import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Building2, Home, Landmark, Mountain } from "lucide-react";
import { servicePages } from "@/content/services";

function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isAppleDevice);

    const handler = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Android/Chrome - direct install
  if (canInstall) {
    return (
      <button
        onClick={async () => {
          const event = (window as any).deferredPrompt;
          if (event) {
            await event.prompt();
            (window as any).deferredPrompt = null;
          }
        }}
        className="text-sm text-gold transition-colors hover:text-gold/80"
      >
        📱 Install the LUMEN App
      </button>
    );
  }

  // iOS - show instructions modal
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="text-sm text-gold transition-colors hover:text-gold/80"
        >
          📱 Install the LUMEN App
        </button>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-sm rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="font-display text-xl text-foreground">Install LUMEN</h3>
              <ol className="mt-4 space-y-3 text-left text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">1</span>
                  <span>Tap the <strong className="text-foreground">Share</strong> button in Safari</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">2</span>
                  <span>Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">3</span>
                  <span>Tap <strong className="text-foreground">Add</strong> in the top right</span>
                </li>
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">LUMEN will appear on your home screen like a native app.</p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-6 w-full rounded-full gold-fill px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

import villaHero from "@/assets/portfolio/villa-sereno-hero.jpg";
import alpineHero from "@/assets/portfolio/grand-alpine-hero.jpg";
import golfHero from "@/assets/portfolio/pine-valley-hero.jpg";

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
          "Let customers explore your property, hotel or course before they arrive. Websites and cinematic walkthroughs from £100.",
      },
    ],
  }),
  component: Index,
});

const icons = {
  "ski-biking-resorts": Mountain,
  airbnb: Home,
  hotels: Building2,
  golf: Landmark,
} as const;

const cardImages: Record<string, string> = {
  "ski-biking-resorts": alpineHero,
  airbnb: villaHero,
  hotels: alpineHero,
  golf: golfHero,
};

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
          preload="auto"
          poster={villaHero}
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlay={(event) => {
            event.currentTarget.play().catch(() => undefined);
          }}
        >
          <source src="/walkthroughs/hero-montage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/75 via-background/40 to-transparent" />
        <div
          aria-hidden
          className="absolute -right-40 top-24 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-gold/10 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                Professional Websites, Walkthroughs & Adverts
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.05] text-foreground [text-shadow:0_2px_18px_rgba(2,6,17,0.9),0_1px_3px_rgba(2,6,17,0.95)] sm:text-7xl lg:text-8xl">
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
              const hero = cardImages[s.slug];
              const card = (
                <>
                  {hero && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={hero}
                        alt={s.nav}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold/90 shadow-lg">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="font-display text-2xl text-foreground">{s.nav}</h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {s.lead}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                      {s.priceLabel} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </>
              );
              return (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="card-lift group overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  {card}
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
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              to="/how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              See how it works →
            </Link>
            <InstallButton />
          </div>
        </div>
      </section>
    </div>
  );
}
