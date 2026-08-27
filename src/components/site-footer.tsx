import { Link } from "@tanstack/react-router";
import { servicePages, packagePages } from "@/content/services";
import { advertPages } from "@/content/adverts";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-foreground">
            LUMEN
          </span>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Professional websites and cinematic digital walkthroughs for properties, hotels,
            golf resorts and premium businesses.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Services</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {servicePages.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="transition-colors hover:text-gold"
                >
                  {s.nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Adverts</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {advertPages.map((advert) => (
              <li key={advert.slug}>
                <Link
                  to="/adverts/$slug"
                  params={{ slug: advert.slug }}
                  className="transition-colors hover:text-gold"
                >
                  {advert.nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Website Packages</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {packagePages.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/packages/$slug"
                  params={{ slug: s.slug }}
                  className="transition-colors hover:text-gold"
                >
                  {s.nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Company</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="transition-colors hover:text-gold">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition-colors hover:text-gold">
                Demo
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="transition-colors hover:text-gold">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-gold">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="transition-colors hover:text-gold">
                Client Dashboard
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition-colors hover:text-gold">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="transition-colors hover:text-gold">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs tracking-wider text-muted-foreground">
        © {new Date().getFullYear()} LUMEN Digital Experiences. All rights reserved.
      </div>
    </footer>
  );
}
