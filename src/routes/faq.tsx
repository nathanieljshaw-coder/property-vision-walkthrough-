import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "Answers to common questions about LUMEN's websites, cinematic walkthroughs, pricing, turnaround times and more.",
      },
      { property: "og:title", content: "FAQ | LUMEN Digital Experiences" },
      {
        property: "og:description",
        content:
          "Everything you need to know about our digital experiences, from how they work to what's included.",
      },
    ],
  }),
  component: FaqPage,
});

const general = [
  {
    q: "What does LUMEN actually do?",
    a: "We turn your existing photographs and videos into professional websites and cinematic digital walkthroughs. Instead of customers scrolling through a flat photo gallery, they get a smooth, guided journey through your property, hotel, golf course or business — built around your brand.",
  },
  {
    q: "Do I need new photos or videos taken?",
    a: "No. Everything is built from the photographs and videos you already have. We enhance, connect and present them in a cinematic format. If your existing content is high quality, the results will be too.",
  },
  {
    q: "What types of businesses do you work with?",
    a: "We work with Airbnb hosts, holiday-let owners, hotels, golf courses, resorts, restaurants, property companies and established local businesses. If you have physical spaces that customers visit, we can create a digital experience around them.",
  },
  {
    q: "What is a digital walkthrough?",
    a: "A digital walkthrough is a smooth, cinematic video or interactive experience that guides visitors through your property or business. It uses your existing photos and videos, enhanced with transitions, movement and pacing to feel like a real journey — not a slideshow.",
  },
  {
    q: "How is this different from a standard website?",
    a: "A standard website displays information. A LUMEN experience lets customers explore your space before they arrive. Walkthroughs, galleries and interactive elements are designed around your brand and your property, giving visitors a much richer sense of what you offer.",
  },
  {
    q: "Can I use the walkthrough on social media?",
    a: "Yes. Every walkthrough comes as a shareable video file and a hosted link. You can post it on Instagram, Facebook, TikTok, YouTube, X and any other platform, or share it directly via email and messaging apps.",
  },
];

const process = [
  {
    q: "How does the process work?",
    a: "1. Choose a package and complete your purchase.\n2. Send us your photographs, videos and any branding assets (logo, colours, fonts).\n3. We create your walkthrough or website and send a preview for your feedback.\n4. You request any changes.\n5. We deliver the final files and a live link, ready to share or embed on your site.",
  },
  {
    q: "How long does it take?",
    a: "Most projects are delivered within 5–7 working days. Larger projects like the Complete Digital Experience may take 2–3 weeks. Rush delivery is available as an add-on if you need it faster.",
  },
  {
    q: "How many revisions are included?",
    a: "Every package includes revision rounds so you can request changes to pacing, transitions, branding, room order and other details. If you need unlimited revisions until it's exactly right, that's available as an add-on.",
  },
  {
    q: "What if I don't like the first draft?",
    a: "We'll revise it. The included revision rounds exist specifically so you can request changes. We'll keep working until the walkthrough or website feels right for your business.",
  },
  {
    q: "Can I add more rooms or properties later?",
    a: "Yes. You can purchase additional walkthroughs at any time. If your needs grow, the Business Website and Complete Digital Experience packages are designed to scale with multiple properties and locations.",
  },
  {
    q: "Do you build the website too, or just the walkthrough?",
    a: "Both. We offer standalone walkthroughs, standalone websites and complete packages that combine the two. Everything is built around your brand and your business.",
  },
];

const pricing = [
  {
    q: "How much does it cost?",
    a: "Standalone walkthroughs start from £100. Website packages start from £399. The Complete Digital Experience, which combines a website with walkthroughs and custom features, starts from £1,499. All prices are fixed — no hidden fees.",
  },
  {
    q: "Are there any hidden costs?",
    a: "No. The price you see is the price you pay. Add-ons like drone footage, rush delivery, extra rooms, unlimited revisions and extended walkthroughs are optional and clearly priced before you commit.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major debit and credit cards through Stripe. Payment is taken securely at checkout. We don't store your card details.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Not currently, but this is something we're looking into. For larger projects, get in touch and we can discuss options.",
  },
  {
    q: "What's included in the Complete Digital Experience?",
    a: "The Complete Digital Experience includes a fully designed website, multiple cinematic walkthroughs, interactive galleries, advanced branding, SEO setup, analytics, custom domain configuration and ongoing support. It's our most comprehensive package for businesses that want everything in one place.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "We deliver a preview before the final files. If you're not happy after revisions, we'll work with you to make it right. If we can't deliver what was promised, we'll refund you.",
  },
];

const technical = [
  {
    q: "What format are the walkthrough files?",
    a: "Walkthroughs are delivered as high-quality MP4 video files and as hosted links you can share anywhere. They work across phones, tablets, laptops and desktops without any special software.",
  },
  {
    q: "Can I embed the walkthrough on my existing website?",
    a: "Yes. We provide an embed code you can paste into any website builder, CMS or custom site. It works with WordPress, Squarespace, Wix, Shopify and most other platforms.",
  },
  {
    q: "What resolution are the walkthroughs?",
    a: "All walkthroughs are delivered in 4K (3840×2160) using AI-enhanced source photos for maximum sharpness and detail.",
  },
  {
    q: "Will the walkthrough work on mobile?",
    a: "Yes. Every walkthrough and website is designed mobile-first. They load quickly and look great on phones, tablets and desktops.",
  },
  {
    q: "Do you provide hosting?",
    a: "Yes. Your walkthrough is hosted on our platform and accessible via a shareable link. If you choose a website package, hosting is included.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. The Business Website and Complete Digital Experience packages include custom domain setup. We'll connect your domain and configure everything for you.",
  },
  {
    q: "What about SEO?",
    a: "All website packages include strong SEO foundations — proper page structures, meta tags, descriptions and content written with search engines in mind. The Complete package includes advanced SEO setup.",
  },
];

const addons = [
  {
    q: "What add-ons are available?",
    a: "Walkthrough packages offer: Extra Room Walkthrough (+£75), Drone Footage (+£75), Rush Delivery (+£50), Unlimited Revisions (+£75), Extended Walkthrough (+£75) and Customizable Music (+£75). Website packages offer: Rush Delivery (+£50), Unlimited Revisions (+£75), Extra Website Page (+£75) and Add a Cinematic Walkthrough (+£75).",
  },
  {
    q: "Can I add drone footage?",
    a: "Yes. Drone footage add-on is available for walkthrough packages. We'll incorporate aerial shots into your walkthrough to give visitors an outside-in perspective of your property or grounds.",
  },
  {
    q: "What does rush delivery mean?",
    a: "Rush delivery fast-tracks your project to the front of the queue. Instead of the standard 5–7 day turnaround, we aim to deliver within 48–72 hours.",
  },
  {
    q: "Can I add a walkthrough to a website package?",
    a: "Yes. The 'Add a Cinematic Walkthrough' add-on is available on website packages for £75. It gives you a full walkthrough built from your photos, integrated directly into your new website.",
  },
];

function FaqSection({
  title,
  items,
}: {
  title: string;
  items: { q: string; a: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
        {title}
      </h2>
      <Accordion type="multiple" className="mt-6 space-y-3">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`${title}-${i}`}
            className="rounded-2xl border border-border bg-surface px-6"
          >
            <AccordionTrigger className="py-5 text-left font-display text-lg text-foreground hover:no-underline hover:text-gold [&[data-state=open]]:text-gold">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function FaqPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Frequently Asked Questions
        </p>
        <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
          Everything You Need To Know
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Can't find what you're looking for?{" "}
          <Link to="/contact" className="text-gold underline underline-offset-4 hover:text-gold/80">
            Get in touch
          </Link>{" "}
          and we'll be happy to help.
        </p>

        <div className="mt-16 space-y-16">
          <FaqSection title="General" items={general} />
          <FaqSection title="How It Works" items={process} />
          <FaqSection title="Pricing & Payment" items={pricing} />
          <FaqSection title="Technical" items={technical} />
          <FaqSection title="Add-Ons" items={addons} />
        </div>

        <div className="mt-20 rounded-3xl border border-border bg-surface p-10 text-center">
          <h2 className="font-display text-3xl text-foreground">
            Still have questions?
          </h2>
          <p className="mt-3 text-muted-foreground">
            We're happy to chat about your project and find the right package for your business.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
