import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ImagePlus, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { findOffering } from "@/content/services";
import { startCheckout } from "@/lib/checkout.functions";
import { ADDONS, addonAmount, addonsForSlug, isWalkthroughPackage } from "@/lib/addons";

export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ params }) => {
    const offering = findOffering(params.slug);
    if (!offering) throw notFound();
    return {
      slug: offering.slug,
      title: offering.title,
      nav: offering.nav,
      priceLabel: offering.priceLabel,
      priceNote: offering.priceNote,
      productName: offering.productName,
      amount: offering.amount,
      lead: offering.lead,
    };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Checkout — ${loaderData.productName}` : "Checkout";
    const description = loaderData
      ? `Secure Stripe checkout for ${loaderData.productName}.`
      : "Secure checkout.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-gold">Package not found</h1>
      <p className="mt-4 text-muted-foreground">Choose a package from the pricing page to continue.</p>
      <Link to="/pricing" className="mt-8 inline-block text-xs font-bold uppercase tracking-widest text-gold">
        View pricing
      </Link>
    </div>
  ),
  component: CheckoutPage,
});

function CheckoutPage() {
  const item = Route.useLoaderData();
  const checkout = useServerFn(startCheckout);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [payMode, setPayMode] = useState<"now" | "later">("now");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  const availableAddons = ADDONS.filter((a) => addonsForSlug(item.slug).includes(a.id));
  const total = item.amount + addonAmount(addonIds);

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (files.length) setImages((prev) => [...prev, ...files]);
  }

  function toggleAddon(id: string) {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  async function handlePay() {
    setError(null);

    // Validation
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter your email address so we can send your receipt.");
      setLoading(false);
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number so we can reach you about your order.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      setLoading(false);
      return;
    }
    if (payMode === "later") {
      if (!name.trim()) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError("Please create a password of at least 8 characters to log in later.");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      if (payMode === "later") {
        // Pay-after-approval: place the order without payment, create the
        // account, and land the customer on their dashboard.
        const res = await fetch("/api/order-place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: item.slug,
            origin: window.location.origin,
            email: email.trim(),
            name: name.trim(),
            phone: phone.trim(),
            password,
            whatsappOptIn,
            ...(addonIds.length ? { addonIds } : {}),
            ...(images.length ? { photoCount: images.length } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not place your order.");
        navigate({ to: "/dashboard" });
        return;
      }

      const res = await checkout({
        data: {
          slug: item.slug,
          origin: window.location.origin,
          email: email.trim(),
          phone: phone.trim(),
          whatsappOptIn,
          ...(addonIds.length ? { addonIds } : {}),
          ...(images.length ? { photoCount: images.length } : {}),
        },
      });
      setPayUrl(res.url);
      // Break out of the preview iframe so Stripe can load.
      const opened = window.open(res.url, "_blank", "noopener,noreferrer");
      if (!opened) {
        try {
          window.top!.location.href = res.url;
        } catch {
          window.location.href = res.url;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        to="/pricing"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-gold"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to pricing
      </Link>

      <h1 className="mt-8 font-display text-4xl text-gold sm:text-5xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Review your selection and continue to our secure Stripe payment page.
      </p>

      <div className="glass mt-10 rounded-2xl border border-border p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.nav}</p>
        <h2 className="mt-2 font-display text-2xl">{item.productName}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{item.lead}</p>

        <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.priceNote}</p>
            {addonIds.length > 0 && (
              <p className="mt-1 text-xs text-gold">
                {addonIds.length} add-on{addonIds.length === 1 ? "" : "s"} selected · +£
                {(addonAmount(addonIds) / 100).toLocaleString("en-GB", { minimumFractionDigits: 0 })}
              </p>
            )}
          </div>
          <p className="font-display text-3xl text-gold">
            £{(total / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Payment mode — pay now, or pay after you approve the demo */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">When would you like to pay?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPayMode("now")}
              className={`rounded-xl border p-4 text-left transition ${
                payMode === "now" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">Pay now</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pay £{(total / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })} today with Stripe — we start right away.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPayMode("later")}
              className={`rounded-xl border p-4 text-left transition ${
                payMode === "later" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">Pay after you approve the demo</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No payment today. We build your demo, you review it, and only pay if you're happy — via your dashboard.
              </p>
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email <span className="normal-case tracking-normal text-gold">(required)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-full border border-border bg-transparent px-5 py-3 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Phone <span className="normal-case tracking-normal text-gold">(required)</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07700 900123"
              className="mt-2 w-full rounded-full border border-border bg-transparent px-5 py-3 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-gold"
            />
          </label>
        </div>

        {payMode === "later" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your name <span className="normal-case tracking-normal text-gold">(required)</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="mt-2 w-full rounded-full border border-border bg-transparent px-5 py-3 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-gold"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Create a password <span className="normal-case tracking-normal text-gold">(8+ chars)</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Used to log in to your dashboard"
                className="mt-2 w-full rounded-full border border-border bg-transparent px-5 py-3 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:border-gold"
              />
            </label>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              We'll create your customer account now so you can review the demo and pay from your dashboard later.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4 rounded-xl border border-border p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              I have read and agree to the{" "}
              <Link to="/terms" className="text-gold underline underline-offset-4 hover:text-gold/80">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gold underline underline-offset-4 hover:text-gold/80">
                Privacy Policy
              </Link>
              . <span className="text-gold">(required)</span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={whatsappOptIn}
              onChange={(e) => setWhatsappOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              I&apos;d like to receive updates about my project on WhatsApp (optional)
            </span>
          </label>
          {whatsappOptIn && (
            <p className="text-xs text-muted-foreground">
              Great — we&apos;ll send project updates to <span className="text-foreground">{phone.trim() || "your phone number above"}</span>.
            </p>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Add Images <span className="font-normal normal-case tracking-normal">(no limit)</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isWalkthroughPackage(item.slug)
              ? "Add the photographs you'd like us to work with — drag them in or browse. We'll use them all to build your walkthrough."
              : "Add the photographs you'd like us to work with — drag them in or browse. We'll use them across your website."}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-6 py-8 text-center transition hover:border-gold hover:text-gold"
          >
            <ImagePlus className="h-8 w-8 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {images.length > 0 ? `${images.length} image${images.length === 1 ? "" : "s"} added` : "Click to browse or drag & drop"}
            </span>
            <span className="text-[11px] text-muted-foreground">JPEG, PNG, HEIC — add as many as you like</span>
          </button>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((f, i) => (
                <div key={`${f.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                  <img src={previewUrls[i]} alt={f.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label={`Remove ${f.name}`}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-border p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add-ons</p>
          <ul className="mt-3 space-y-3">
            {availableAddons.map((a) => {
              const checked = addonIds.includes(a.id);
              return (
                <li key={a.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-background/50">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(a.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4af37]"
                    />
                    <span className="flex-1">
                      <span className="block text-sm text-foreground">{a.label}</span>
                      <span className="block text-xs text-muted-foreground">{a.detail}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      {checked ? (
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-gold">Added</span>
                      ) : null}
                      <span className="block text-sm font-semibold text-gold">
                        +£{(a.amount / 100).toLocaleString("en-GB", { minimumFractionDigits: 0 })}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={loading || (payMode === "later" && password.length < 8)}
          className="gold-fill shadow-gold-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {loading
            ? "Placing your order…"
            : payMode === "later"
            ? "Place order — pay after you approve the demo"
            : `Pay £${(total / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })} with Stripe`}
        </button>

        {payUrl && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Payment page didn&apos;t open?{" "}
            <a href={payUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
              Open Stripe checkout
            </a>
          </p>
        )}
        {error && <p className="mt-4 text-center text-xs text-destructive">{error}</p>}

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {payMode === "later" ? "No payment today — you only pay once you approve your demo" : "Secure payment handled by Stripe"}
        </p>
      </div>
    </div>
  );
}
