import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/install")({
  component: InstallPage,
});

function InstallPage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      setPlatform("ios");
    } else if (/Android/.test(ua)) {
      setPlatform("android");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
          <span className="text-5xl">📱</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Install LUMEN
        </p>
        <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
          Add to your Home Screen
        </h1>
        <p className="mt-4 text-muted-foreground">
          Get the full LUMEN experience — fast loading, offline access, and push notifications.
        </p>

        {/* iOS Instructions */}
        {platform === "ios" && (
          <div className="mt-10 text-left">
            <h2 className="mb-4 text-center font-display text-xl text-foreground">
              iPhone / iPad Instructions
            </h2>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Open in Safari</p>
                  <p className="text-sm text-muted-foreground">
                    This page must be opened in <strong>Safari</strong> — not Chrome or another browser.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground">
                    It's the square icon with an arrow pointing up, at the bottom of the screen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground">
                    Scroll down in the share menu and tap the option.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  4
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">
                    In the top right corner. LUMEN now appears on your home screen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Android Instructions */}
        {platform === "android" && (
          <div className="mt-10 text-left">
            <h2 className="mb-4 text-center font-display text-xl text-foreground">
              Android Instructions
            </h2>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Open in Chrome</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure you're using Chrome browser.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap the menu (3 dots)</p>
                  <p className="text-sm text-muted-foreground">
                    In the top right corner of Chrome.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Tap "Install app"</p>
                  <p className="text-sm text-muted-foreground">
                    Or "Add to Home Screen" — LUMEN will install like a native app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Instructions */}
        {platform === "desktop" && (
          <div className="mt-10 text-left">
            <h2 className="mb-4 text-center font-display text-xl text-foreground">
              Desktop Instructions
            </h2>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Open in Chrome or Edge</p>
                  <p className="text-sm text-muted-foreground">
                    PWA installation works best in Chromium-based browsers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Look for the install icon</p>
                  <p className="text-sm text-muted-foreground">
                    Click the install icon in the address bar, or go to menu → "Install LUMEN".
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Confirm installation</p>
                  <p className="text-sm text-muted-foreground">
                    LUMEN will appear in your apps/taskbar with full offline support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Go to LUMEN <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
