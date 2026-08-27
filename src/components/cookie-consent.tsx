import { useState, useEffect } from "react";
import { Cookie, Shield, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CONSENT_KEY = "lumen_cookie_consent";

export type CookieConsentData = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export function getCookieConsent(): CookieConsentData | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(data: CookieConsentData) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true, timestamp: new Date().toISOString() });
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false, timestamp: new Date().toISOString() });
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }

  function savePreferences() {
    saveConsent({ analytics, marketing, timestamp: new Date().toISOString() });
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Cookie className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">
                Cookie Preferences
              </h3>
              <p className="text-xs text-muted-foreground">
                We respect your privacy
              </p>
            </div>
          </div>
          <button
            onClick={rejectAll}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Reject all cookies"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use cookies to provide our live chat service and understand how
            visitors use our website. You can accept all cookies, reject
            non-essential ones, or customise your preferences below.
          </p>

          {/* Detail toggles */}
          {showDetails && (
            <div className="mt-5 space-y-4 rounded-xl border border-border bg-background/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Essential Cookies
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  Always On
                </span>
              </div>

              <div className="border-t border-border" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Analytics Cookies
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Google Analytics — helps us understand how visitors use our
                    site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnalytics((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    analytics ? "bg-gold" : "bg-border"
                  }`}
                  role="switch"
                  aria-checked={analytics}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      analytics ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-border" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Marketing Cookies
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Live chat widget (Tawk.to) and social media integrations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMarketing((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    marketing ? "bg-gold" : "bg-border"
                  }`}
                  role="switch"
                  aria-checked={marketing}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      marketing ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={acceptAll}
              className="rounded-full gold-fill px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
            >
              Accept All
            </button>
            <button
              onClick={rejectAll}
              className="rounded-full border border-border px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Reject All
            </button>
            {showDetails ? (
              <button
                onClick={savePreferences}
                className="rounded-full border border-border px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="text-xs font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
              >
                Customise
              </button>
            )}
          </div>

          {/* Links */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <Link
              to="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-gold"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              to="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-gold"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
