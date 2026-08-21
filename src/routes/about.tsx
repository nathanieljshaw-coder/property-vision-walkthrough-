import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Clapperboard, Zap, HeartHandshake } from "lucide-react";
import { BeforeAfter } from "@/components/before-after";
import villaHero from "@/assets/portfolio/villa-sereno-hero-degraded.jpg";
import villaWalkthrough from "@/assets/portfolio/villa-sereno-walkthrough.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LUMEN | Digital Experiences Built Around Your Business" },
      {
        name: "description",
        content:
          "LUMEN turns your existing photographs and videos into professional websites and cinematic walkthroughs for properties, hotels and premium businesses.",
      },
      { property: "og:title", content: "About LUMEN | Digital Experiences" },
      {
        property: "og:description",
        content:
          "Quality, creativity and personal service. We build digital experiences around your business, not a template.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Gem, title: "Uncompromising", text: "Every detail is considered, from typography to transitions." },
  { icon: Clapperboard, title: "Cinematic", text: "Your spaces presented as a journey, not a photo gallery." },
  { icon: Zap, title: "Lightning Fast", text: "Modern, optimised websites that load quickly on any device." },
  { icon: HeartHandshake, title: "Personalised", text: "We work around your brand, your customers and your goals." },
];

function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">About LUMEN</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
          Digital Experiences Built Around Your Business
        </h1>

        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            You already have the photographs, videos, information and ideas. We turn them into a
            professional digital experience that allows your customers to see, explore and
            understand your business before they arrive.
          </p>
          <p>
            We work with holiday-let owners, hotels, golf clubs, restaurants, property companies and
            established local businesses — creating websites and cinematic walkthroughs designed
            around each brand rather than a generic template.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card-lift rounded-2xl border border-border bg-surface p-8">
              <v.icon className="h-7 w-7 text-gold" />
              <h2 className="mt-5 font-display text-2xl text-foreground">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Before & After</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              The same property. A different feeling.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We enhance and connect the media you already have — the property stays exactly
              as it is. Drag the slider to compare your photographs with the cinematic AI
              walkthrough we build from them.
            </p>
          </div>
          <BeforeAfter
            beforeSrc={villaHero}
            afterSrc={villaWalkthrough}
            beforeLabel="Your Photos"
            afterLabel="Your AI Walkthrough"
            alt="Villa Sereno compared before and after"
          />
        </div>

        <div className="mt-16">
          <Link
            to="/contact"
            className="inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Start A Conversation
          </Link>
        </div>
      </div>
    </div>
  );
}
