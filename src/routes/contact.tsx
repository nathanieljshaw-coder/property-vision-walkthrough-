import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LUMEN | Start Your Digital Experience" },
      {
        name: "description",
        content:
          "Tell us about your property, hotel, golf club or business and we'll design a website or cinematic walkthrough around it.",
      },
      { property: "og:title", content: "Contact LUMEN" },
      {
        property: "og:description",
        content: "Let's create something great — get in touch about your project.",
      },
    ],
  }),
  component: ContactPage,
});

const CONTACT_EMAIL = "hello-lumenexperiences@outlook.com";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Contact</p>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            Let's Create Something Great
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Tell us about your business and what you'd like your customers to experience. We'll come
            back with ideas and a clear price.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-gold">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" /> +44 (0)20 7946 0913
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gold" /> United Kingdom — working worldwide
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8 bg-noise">
          {sent ? (
            <div className="py-16 text-center">
              <h2 className="font-display text-3xl text-foreground">Enquiry Received</h2>
              <p className="mt-3 text-muted-foreground">
                Thank you — we'll be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const name = String(data.get("name") ?? "");
                const email = String(data.get("email") ?? "");
                const budget = String(data.get("budget") ?? "");
                const message = String(data.get("message") ?? "");

                setSending(true);
                setError(null);
                try {
                  const res = await fetch(
                    `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Accept: "application/json" },
                      body: JSON.stringify({
                        name,
                        email,
                        budget,
                        message,
                        _subject: `New enquiry from ${name}`,
                        _template: "table",
                        _captcha: "false",
                      }),
                    }
                  );
                  if (!res.ok) throw new Error(`Request failed (${res.status})`);
                  const json = (await res.json()) as { success?: string; message?: string };
                  if (json.success !== "true") {
                    throw new Error(
                      json.message || "Your enquiry was not accepted — please try again."
                    );
                  }
                  setSent(true);
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Something went wrong sending your enquiry."
                  );
                } finally {
                  setSending(false);
                }
              }}
            >
              <div>
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-gold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-gold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="budget" className="text-xs uppercase tracking-widest text-gold">
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                >
                  <option>£100 - £500</option>
                  <option>£500 - £1,000</option>
                  <option>£1,000 - £2,500</option>
                  <option>£2,500+</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-gold">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                />
              </div>
              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
