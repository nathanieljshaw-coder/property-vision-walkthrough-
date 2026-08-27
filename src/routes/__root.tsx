import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent, getCookieConsent } from "@/components/cookie-consent";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Lost Your Way?
        </p>
        <h1 className="mt-6 font-display text-8xl font-bold tracking-tight text-foreground">
          404
        </h1>
        <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
          This page doesn't exist
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The page you're looking for may have been moved or no longer exists.
          Let's get you back on track.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Go Home
          </Link>
          <Link
            to="/pricing"
            className="inline-flex rounded-full border border-border px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            View Pricing
          </Link>
          <Link
            to="/contact"
            className="inline-flex rounded-full border border-border px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-16 border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Popular Pages
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-4">
            <Link to="/services" className="transition-colors hover:text-gold">
              Services
            </Link>
            <Link to="/portfolio" className="transition-colors hover:text-gold">
              Demo
            </Link>
            <Link to="/about" className="transition-colors hover:text-gold">
              About
            </Link>
            <Link to="/faq" className="transition-colors hover:text-gold">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LUMEN | Digital Experiences" },
      {
        name: "description",
        content:
          "LUMEN creates professional websites and cinematic digital walkthroughs for holiday rentals, hotels, golf resorts and premium businesses.",
      },
      { name: "author", content: "LUMEN Digital Experiences" },
      { property: "og:title", content: "LUMEN | Digital Experiences" },
      {
        property: "og:description",
        content: "Professional websites and cinematic walkthroughs for premium businesses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.json" },
      { name: "theme-color", content: "#C9A84C" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "LUMEN" },
      { rel: "apple-touch-icon", href: "/icons/icon-192x192.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function TawkChat() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    // Check initial consent
    const consent = getCookieConsent();
    if (consent?.marketing) {
      setLoad(true);
      return;
    }

    // Listen for consent changes
    function onUpdate() {
      const updated = getCookieConsent();
      if (updated?.marketing) setLoad(true);
    }
    window.addEventListener("cookie-consent-updated", onUpdate);
    return () => window.removeEventListener("cookie-consent-updated", onUpdate);
  }, []);

  useEffect(() => {
    if (!load) return;
    const TAWK_PROPERTY_ID = "6a88d97c6fd53a34448c73ed";
    const TAWK_WIDGET_ID = "1k0j933td";

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, [load]);

  return null;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TawkChat />
        <CookieConsent />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration.scope);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}

