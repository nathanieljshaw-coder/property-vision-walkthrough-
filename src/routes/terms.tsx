import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "Terms and conditions governing the use of LUMEN Digital Experiences website and services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: August 2026
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl text-foreground">1. Agreement to Terms</h2>
            <p className="mt-3">
              By accessing or using the LUMEN Digital Experiences website and services
              ("Services"), you agree to be bound by these Terms &amp; Conditions. If you do
              not agree to these terms, please do not use our Services. These terms apply to
              all visitors, clients, and users of the website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">2. Services</h2>
            <p className="mt-3">
              LUMEN Digital Experiences provides professional website design, cinematic
              property walkthroughs, and related digital services for businesses including,
              but not limited to, holiday-let owners, hotels, golf clubs, restaurants, and
              property companies.
            </p>
            <p className="mt-3">
              All services are delivered digitally. We work with the photographs, videos,
              and information you provide to create bespoke digital experiences tailored to
              your brand. We do not provide hosting services directly; websites are deployed
              to third-party hosting platforms (such as Vercel, Netlify, or Lovable) as part
              of our service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">3. Orders and Payment</h2>
            <p className="mt-3">
              All orders are placed through our website checkout powered by Stripe. Prices
              are displayed in British Pounds (GBP) and include VAT where applicable.
              Payment is taken in full at the time of order unless otherwise agreed in
              writing.
            </p>
            <p className="mt-3">
              We reserve the right to refuse or cancel any order at our discretion. If we
              cancel an order after payment has been taken, we will provide a full refund
              within 14 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">4. Delivery</h2>
            <p className="mt-3">
              Delivery timescales are estimates and not guaranteed. Typical delivery is
              5–10 business days for websites and 3–7 business days for walkthroughs, though
              this may vary depending on the scope of your project and the information
              provided. We will communicate estimated delivery dates at the point of order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">5. Revisions</h2>
            <p className="mt-3">
              Each package includes a set number of revision rounds as specified at the
              point of purchase. Additional revision rounds are available as add-ons. If you
              require changes beyond the included revisions and have not purchased additional
              rounds, we will provide a quote before proceeding.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">6. Intellectual Property</h2>
            <p className="mt-3">
              Upon full payment, you receive a perpetual, non-exclusive licence to use the
              digital deliverables (website, walkthrough videos, and associated assets) for
              your business purposes. LUMEN retains the right to use completed work for
              portfolio and marketing purposes unless you request otherwise in writing.
            </p>
            <p className="mt-3">
              You are responsible for ensuring you have the necessary rights and
              permissions for all photographs, videos, text, and other content you provide
              to us. LUMEN accepts no liability for third-party intellectual property
              claims arising from content you supply.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">7. Refunds and Cancellations</h2>
            <p className="mt-3">
              As our services involve bespoke digital work, refunds are handled as follows:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Cancellation before work begins:</strong> Full refund within 14
                business days.
              </li>
              <li>
                <strong>Cancellation after work has begun:</strong> A partial refund
                reflecting work completed to date will be issued.
              </li>
              <li>
                <strong>Completed work:</strong> Refunds are not available for completed
                and delivered work. If you are dissatisfied, please contact us to discuss
                how we can resolve the issue.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, LUMEN Digital Experiences shall not
              be liable for any indirect, incidental, special, consequential, or punitive
              damages arising out of your use of our Services. Our total liability shall
              not exceed the amount you paid for the specific service giving rise to the
              claim.
            </p>
            <p className="mt-3">
              We are not liable for any loss of revenue, profit, data, or business
              opportunity resulting from the use of our digital deliverables.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">9. Third-Party Services</h2>
            <p className="mt-3">
              Our Services may integrate with or rely on third-party platforms (including
              but not limited to Stripe for payments, Vercel/Netlify for hosting, and
              Google Analytics for traffic monitoring). We are not responsible for the
              availability, accuracy, or practices of these third-party services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">10. Changes to Terms</h2>
            <p className="mt-3">
              We reserve the right to update these Terms &amp; Conditions at any time.
              Changes will be posted on this page with an updated "Last updated" date.
              Continued use of our Services after changes constitutes acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">11. Governing Law</h2>
            <p className="mt-3">
              These Terms &amp; Conditions are governed by and construed in accordance with
              the laws of England and Wales. Any disputes shall be subject to the exclusive
              jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">12. Contact</h2>
            <p className="mt-3">
              If you have any questions about these Terms &amp; Conditions, please contact
              us at{" "}
              <a
                href="mailto:hello-lumenexperiences@outlook.com"
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
              >
                hello-lumenexperiences@outlook.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16">
          <Link
            to="/contact"
            className="inline-flex rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
