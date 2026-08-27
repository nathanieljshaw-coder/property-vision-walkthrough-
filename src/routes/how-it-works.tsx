import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  Palette,
  Eye,
  Rocket,
  Camera,
  Film,
  Globe,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "See how LUMEN transforms your existing photos and videos into professional websites and cinematic walkthroughs — in four simple steps.",
      },
      { property: "og:title", content: "How It Works | LUMEN Digital Experiences" },
      {
        property: "og:description",
        content:
          "From your first enquiry to a live digital experience — here's the simple process.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Share Your Content",
    description:
      "Send us your existing photographs, videos, floor plans, and any information about your business. We work with what you already have — no need for a professional photoshoot.",
    details: [
      "Upload photos via our simple form or a shared drive",
      "Include any existing video footage you have",
      "Share your brand guidelines, logo, and colour preferences",
      "Tell us about your business and your customers",
    ],
  },
  {
    num: "02",
    icon: Palette,
    title: "We Design & Build",
    description:
      "Our team crafts a bespoke digital experience around your brand. Every project is unique — we don't use templates. We enhance your media with AI upscaling and cinematic camera movements.",
    details: [
      "Custom design tailored to your brand identity",
      "AI-enhanced imagery for sharper, richer visuals",
      "Cinematic walkthrough creation with drone-style camera moves",
      "Professional website built for speed and elegance",
    ],
  },
  {
    num: "03",
    icon: Eye,
    title: "Preview & Refine",
    description:
      "You'll receive a preview of your digital experience before it goes live. We refine until every detail feels right — the number of revisions depends on your package.",
    details: [
      "Review your walkthrough and website in full quality",
      "Request changes to any aspect of the design",
      "Ensure every room, feature, and detail is represented",
      "Approve the final version before launch",
    ],
  },
  {
    num: "04",
    icon: Rocket,
    title: "Launch & Share",
    description:
      "We deploy your digital experience and hand over everything you need to share it. Your customers can now explore your business from anywhere in the world.",
    details: [
      "Live website with your custom domain",
      "HD walkthrough videos ready for social media",
      "Embed codes for your existing website or listing",
      "Shareable links for emails, brochures, and QR codes",
    ],
  },
];

const walkthroughSteps = [
  {
    icon: Camera,
    title: "Your Photos",
    text: "We take the photographs you've already taken of your property — exterior, interior, details.",
  },
  {
    icon: Film,
    title: "AI Enhancement",
    text: "Each image is upscaled and enhanced using Real-ESRGAN AI, bringing out detail the originals lack.",
  },
  {
    icon: Globe,
    title: "Cinematic Camera",
    text: "We apply drone-style reveal shots, gentle push-ins, and smooth transitions to bring your spaces to life.",
  },
  {
    icon: Rocket,
    title: "However Long You Like",
    text: "The final result: a professional video tour of any length that lets customers explore your property before they arrive.",
  },
];

const faqs = [
  {
    q: "How long does the whole process take?",
    a: "Walkthroughs are typically delivered within 3–7 business days. Websites take 5–10 business days depending on the package. Rush delivery is available as an add-on.",
  },
  {
    q: "Do I need professional photographs?",
    a: "No. We work with photos taken on a smartphone or camera. Our AI enhancement pipeline sharpens and upscales them to near-professional quality.",
  },
  {
    q: "Can I make changes after delivery?",
    a: "Yes. Each package includes revision rounds. Additional rounds are available as add-ons if you need more adjustments.",
  },
  {
    q: "What do I receive at the end?",
    a: "A live website (with your domain if you have one), HD walkthrough videos, embed codes, and shareable links. You own the content.",
  },
];

function HowItWorksPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          The Process
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
          From Photos to Digital Experience
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          You already have everything we need. Here's how we turn your
          photographs and videos into a professional website and cinematic
          walkthrough — in four simple steps.
        </p>

        {/* Main Steps */}
        <div className="mt-20 space-y-8">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="card-lift rounded-2xl border border-border bg-surface p-8 sm:p-10"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <step.icon className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tracking-widest text-gold/60">
                      STEP {step.num}
                    </span>
                    {i < steps.length - 1 && (
                      <ArrowRight className="hidden h-3 w-3 text-gold/30 sm:block" />
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-3xl text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {step.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Walkthrough Pipeline */}
        <div className="mt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Walkthrough Pipeline
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
            How Your Walkthrough Is Made
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every walkthrough goes through our four-stage pipeline — from your
            raw photos to a cinematic video tour.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {walkthroughSteps.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <s.icon className="mt-4 h-6 w-6 text-gold" />
                <h3 className="mt-3 font-display text-xl text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
                {i < walkthroughSteps.length - 1 && (
                  <ArrowRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/30 lg:right-auto lg:bottom-4 lg:left-1/2 lg:translate-x-[-50%] lg:translate-y-0 lg:rotate-90" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Timeline
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            What to Expect
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <span className="font-display text-2xl font-bold text-gold">1</span>
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">Day 1</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your content. We review and confirm the scope, timeline,
                and any questions.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <span className="font-display text-2xl font-bold text-gold">2–7</span>
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">Days 2–7</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We build your walkthrough and/or website. You'll receive a
                preview link to review.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <span className="font-display text-2xl font-bold text-gold">8+</span>
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">Launch Day</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Approve the final version. We deploy your site and deliver your
                walkthrough videos.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Common Questions
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Frequently Asked
          </h2>

          <div className="mt-10 space-y-6">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              >
                <h3 className="font-display text-xl text-foreground">{f.q}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="text-sm font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
            >
              View all FAQs →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-border bg-surface p-10 text-center sm:p-14">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            It all begins with a conversation. Tell us about your business and
            we'll show you what's possible.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
            >
              Start A Conversation
            </Link>
            <Link
              to="/pricing"
              className="inline-flex rounded-full border border-border px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
