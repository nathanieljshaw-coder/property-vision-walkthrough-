import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/adverts", label: "Adverts" },
  { to: "/portfolio", label: "Demo" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email === "nathaniel.j.shaw@outlook.com") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 glass-panel border-b border-border">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex flex-col justify-center">
            <span className="font-display text-2xl font-bold tracking-[0.25em] text-foreground transition-colors group-hover:text-gold">
              LUMEN
            </span>
            <span className="-mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
              Digital Experiences
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wider text-muted-foreground md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-gold" }}
                className="py-2 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold sm:inline-flex"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden rounded-full border border-gold/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 sm:inline-flex"
              >
                Admin
              </Link>
            )}
            <Link
              to="/pricing"
              className="hidden rounded-full gold-fill px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 sm:inline-flex"
            >
              Buy Now
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-foreground transition-colors hover:text-gold md:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-between bg-background/95 p-8 pt-28 backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-6 text-center">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Navigation
            </span>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl tracking-wider text-foreground transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="font-display text-2xl tracking-wider text-gold transition-colors hover:text-gold/80"
              >
                Admin
              </Link>
            )}
            <div className="border-t border-border pt-6">
              <Link
                to="/pricing"
                onClick={() => setOpen(false)}
                className="inline-block w-full rounded-full gold-fill px-8 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow"
              >
                Buy Now
              </Link>
            </div>
          </div>
          <p className="text-center text-xs tracking-wider text-muted-foreground">
            © LUMEN Digital Experiences. All rights reserved.
          </p>
        </div>
      )}
    </>
  );
}
