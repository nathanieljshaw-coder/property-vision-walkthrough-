import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | LUMEN Digital Experiences" },
      {
        name: "description",
        content:
          "How LUMEN Digital Experiences collects, uses, and protects your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Legal
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: August 2026
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl text-foreground">
              1. Who We Are
            </h2>
            <p className="mt-3">
              LUMEN Digital Experiences ("we", "us", "our") is operated from the United
              Kingdom. We provide professional website design, cinematic property
              walkthroughs, and related digital services. We are committed to protecting
              your personal data and respecting your privacy in accordance with the UK
              General Data Protection Regulation (UK GDPR) and the Data Protection Act
              2018.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              We may collect and process the following categories of personal data:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Identity data:</strong> your name, business name, and job title.
              </li>
              <li>
                <strong>Contact data:</strong> your email address, phone number, and
                postal address.
              </li>
              <li>
                <strong>Transaction data:</strong> details of purchases you make through
                our website, including payment information (processed securely by Stripe —
                we do not store card details).
              </li>
              <li>
                <strong>Technical data:</strong> IP address, browser type, operating
                system, device information, and browsing activity on our website.
              </li>
              <li>
                <strong>Content data:</strong> photographs, videos, text, and other
                materials you provide for us to create your digital experience.
              </li>
              <li>
                <strong>Communication data:</strong> records of correspondence with us,
                including messages sent via our contact form, email, or live chat.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              3. How We Use Your Data
            </h2>
            <p className="mt-3">We use your personal data to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Fulfil orders and deliver our services to you.</li>
              <li>Communicate with you about your project, orders, and enquiries.</li>
              <li>Process payments securely through Stripe.</li>
              <li>
                Improve our website and services through analytics (Google Analytics).
              </li>
              <li>
                Send marketing communications about our services (only with your consent,
                and you can opt out at any time).
              </li>
              <li>
                Comply with legal obligations and resolve any disputes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              4. Legal Basis for Processing
            </h2>
            <p className="mt-3">
              Under UK GDPR, we process your data on the following legal bases:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Contract:</strong> processing is necessary for the performance of
                a contract with you (e.g., delivering your order).
              </li>
              <li>
                <strong>Legitimate interests:</strong> processing is necessary for our
                legitimate business interests (e.g., improving our website), provided
                these are not overridden by your rights.
              </li>
              <li>
                <strong>Consent:</strong> where you have given explicit consent (e.g.,
                marketing emails).
              </li>
              <li>
                <strong>Legal obligation:</strong> where we are required by law to process
                your data (e.g., tax records).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              5. Cookies
            </h2>
            <p className="mt-3">
              Our website uses cookies and similar tracking technologies to distinguish
              you from other users, improve your experience, and analyse website traffic.
              Cookies are small text files placed on your device.
            </p>
            <p className="mt-3">
              We use the following types of cookies:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Essential cookies:</strong> required for the website to function
                (e.g., session management). These cannot be disabled.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Google Analytics cookies that help us
                understand how visitors use our website.
              </li>
              <li>
                <strong>Third-party cookies:</strong> cookies set by embedded services
                such as our live chat widget (Tawk.to).
              </li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling essential
              cookies may impair the website's functionality.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              6. Data Sharing
            </h2>
            <p className="mt-3">
              We may share your personal data with the following third parties for the
              purposes described in this policy:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Stripe:</strong> payment processing. Stripe's privacy policy
                applies to data processed by them.
              </li>
              <li>
                <strong>Vercel / Netlify / Lovable:</strong> website hosting and
                deployment.
              </li>
              <li>
                <strong>Google Analytics:</strong> website traffic analysis.
              </li>
              <li>
                <strong>Tawk.to:</strong> live chat functionality.
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We require all third
              parties to respect the security of your data and treat it in accordance with
              the law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              7. Data Retention
            </h2>
            <p className="mt-3">
              We retain your personal data only for as long as necessary to fulfil the
              purposes for which it was collected:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Order data:</strong> retained for 6 years after the transaction
                (required for UK tax and accounting purposes).
              </li>
              <li>
                <strong>Marketing consent:</strong> retained until you withdraw consent.
              </li>
              <li>
                <strong>Website analytics:</strong> aggregated and anonymised after 26
                months (Google Analytics default).
              </li>
              <li>
                <strong>Enquiry data:</strong> retained for 12 months if no order is
                placed, then deleted.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              8. Your Rights
            </h2>
            <p className="mt-3">Under UK GDPR, you have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Access</strong> the personal data we hold about you.
              </li>
              <li>
                <strong>Rectify</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erase</strong> your data ("right to be forgotten") where there is
                no compelling reason for its continued processing.
              </li>
              <li>
                <strong>Restrict</strong> processing in certain circumstances.
              </li>
              <li>
                <strong>Object</strong> to processing based on legitimate interests.
              </li>
              <li>
                <strong>Data portability</strong> — receive your data in a structured,
                commonly used, machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time where we rely on consent to
                process your data.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:hello-lumenexperiences@outlook.com"
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
              >
                hello-lumenexperiences@outlook.com
              </a>
              . We will respond within one month.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              9. Data Security
            </h2>
            <p className="mt-3">
              We take appropriate technical and organisational measures to protect your
              personal data against unauthorised access, alteration, disclosure, or
              destruction. These include encrypted data transmission (HTTPS), secure
              payment processing via Stripe, and access controls on our internal systems.
            </p>
            <p className="mt-3">
              However, no method of transmission over the internet is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              10. International Transfers
            </h2>
            <p className="mt-3">
              Our third-party service providers (such as Stripe, Google, and Vercel) may
              operate outside the United Kingdom. Where data is transferred internationally,
              we ensure appropriate safeguards are in place, including Standard Contractual
              Clauses or equivalent mechanisms as required by UK GDPR.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              11. Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Changes will be posted
              on this page with an updated "Last updated" date. We encourage you to review
              this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">
              12. Contact
            </h2>
            <p className="mt-3">
              For any questions about this Privacy Policy or to exercise your data
              protection rights, please contact us at{" "}
              <a
                href="mailto:hello-lumenexperiences@outlook.com"
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
              >
                hello-lumenexperiences@outlook.com
              </a>
              .
            </p>
            <p className="mt-3">
              You also have the right to lodge a complaint with the Information
              Commissioner's Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
              >
                ico.org.uk
              </a>{" "}
              if you believe your data protection rights have been infringed.
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
