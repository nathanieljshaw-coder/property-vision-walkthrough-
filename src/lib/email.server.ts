import fs from "fs";
import path from "path";

const ADMIN_EMAIL = "nathaniel.j.shaw@outlook.com";
const BUSINESS_EMAIL = "hello-lumenexperiences@outlook.com";
const CONTACT_PHONE = "+44 (0)20 7946 0913";

type ConfirmationInput = {
  email: string;
  name: string;
  phone: string | null;
  whatsappOptIn: boolean;
  productName: string;
  amount: number;
  slug: string;
  orderId: string;
  origin: string;
};

type DemoReadyInput = {
  email: string;
  name: string;
  productName: string;
  demoUrl: string;
  origin: string;
  /** Pay-after-approval orders: tell the customer to approve & pay from the dashboard. */
  pendingPayment?: boolean;
};

type DispatchOptions = {
  subject: string; // subject for the customer copy
  previewSubject: string; // subject for the admin preview copy
  html: string;
  replyTo: string;
  /** FormSubmit fallback rows (label -> value). */
  fallbackRows: [string, string][];
};

export type EmailDispatchStatus = {
  provider: "resend" | "formsubmit" | "brevo";
  admin: "delivered" | "blocked";
  customer: "delivered" | "blocked" | "skipped";
  /** Human-readable detail, e.g. the reason a copy was blocked. */
  detail?: string;
};

function money(pence: number): string {
  return `£${(pence / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
}

function readLogoBase64(): string | null {
  try {
    const p = path.join(process.cwd(), "public", "logo.png");
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p).toString("base64");
  } catch {
    return null;
  }
}

/**
 * Branded HTML for the order confirmation. Dark theme (#030304) matches the
 * logo's own background so the wordmark blends seamlessly.
 */
export function buildOrderConfirmationHtml(input: ConfirmationInput, logoSrc: string): string {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const rows = [
    ["Customer", input.name || input.email],
    ["Email", input.email],
    ["Phone", input.phone || "—"],
    ["WhatsApp updates", input.whatsappOptIn ? "Yes — opt-in received" : "No"],
    ["Order reference", input.orderId.slice(-8).toUpperCase()],
    ["Date", date],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #1c1f26;color:#8b93a1;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">${k}</td><td style="padding:10px 0;border-bottom:1px solid #1c1f26;color:#f5f2ea;font-size:14px;text-align:right;">${v}</td></tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#030304;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030304;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#0c0e12;border:1px solid #1c1f26;border-radius:16px;">
          <tr>
            <td align="center" style="padding:40px 40px 8px 40px;">
              <img src="${logoSrc}" alt="LUMEN Digital Experiences" width="240" style="display:block;max-width:240px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 40px 8px 40px;">
              <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Order Confirmation</p>
              <h1 style="margin:12px 0 0 0;color:#f5f2ea;font-size:30px;font-weight:normal;">Thank you, ${input.name.split(" ")[0] || "there"}.</h1>
              <p style="margin:12px 0 0 0;color:#8b93a1;font-size:14px;line-height:1.7;">Your project is booked in and we'll be in touch shortly to gather your photographs, videos and brand details.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#11141a;border:1px solid #1c1f26;border-radius:12px;padding:16px 20px;">
                <tr>
                  <td style="padding:12px 20px;color:#8b93a1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Package</td>
                  <td style="padding:12px 20px;color:#f5f2ea;font-size:15px;text-align:right;">${input.productName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#8b93a1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Total paid</td>
                  <td style="padding:12px 20px;color:#d4af37;font-size:22px;text-align:right;">${money(input.amount)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 40px 40px 40px;">
              <p style="margin:0;color:#8b93a1;font-size:12px;line-height:1.8;">
                LUMEN Digital Experiences<br />
                <a href="mailto:${BUSINESS_EMAIL}" style="color:#d4af37;text-decoration:none;">${BUSINESS_EMAIL}</a> · ${CONTACT_PHONE}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type BrandedTemplate = "work_started" | "demo_ready" | "need_info" | "delivered" | "custom";

type BrandedEmailInput = {
  email: string;
  name: string;
  productName: string;
  template: BrandedTemplate;
  /** The message body — template copy or a custom message. */
  message: string;
  demoUrl?: string | null;
  origin: string;
};

const TEMPLATE_META: Record<
  BrandedTemplate,
  { subject: string; kicker: string; heading: (name: string) => string; cta?: (input: BrandedEmailInput) => { label: string; url: string } }
> = {
  work_started: {
    subject: "We've started on your LUMEN project",
    kicker: "Project Update",
    heading: () => "Your project is underway.",
  },
  demo_ready: {
    subject: "Your LUMEN walkthrough is ready for review!",
    kicker: "Your Walkthrough Is Ready",
    heading: (name) => `${name.split(" ")[0] || "Hi"}, your demo is ready for review.`,
    cta: (input) =>
      input.demoUrl
        ? { label: "Watch Your Walkthrough", url: input.demoUrl }
        : { label: "View Your Dashboard", url: `${input.origin}/dashboard` },
  },
  need_info: {
    subject: "We need a few more details for your LUMEN project",
    kicker: "Action Needed",
    heading: () => "We need a little more from you.",
    cta: () => ({ label: "Reply to This Email", url: `mailto:${BUSINESS_EMAIL}` }),
  },
  delivered: {
    subject: "Your LUMEN walkthrough has been delivered!",
    kicker: "Delivered",
    heading: () => "It's yours — enjoy your walkthrough.",
    cta: (input) =>
      input.demoUrl
        ? { label: "Watch Your Walkthrough", url: input.demoUrl }
        : { label: "View Your Dashboard", url: `${input.origin}/dashboard` },
  },
  custom: {
    subject: "An update from LUMEN",
    kicker: "Update",
    heading: (name) => `Hello ${name.split(" ")[0] || "there"}.`,
    cta: () => ({ label: "Reply to This Email", url: `mailto:${BUSINESS_EMAIL}` }),
  },
};

/**
 * Branded HTML for a preset/custom project email (work started, demo ready,
 * need info, delivered, or any custom message).
 */
export function buildBrandedEmailHtml(input: BrandedEmailInput, logoSrc: string): string {
  const meta = TEMPLATE_META[input.template];
  const cta = meta.cta?.(input);
  const safeMessage = input.message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  const ctaBlock = cta
    ? `
          <tr>
            <td align="center" style="padding:32px 40px 8px 40px;">
              <a href="${cta.url}" style="display:inline-block;background-color:#d4af37;color:#0a0c10;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:15px 36px;border-radius:999px;">${cta.label}</a>
            </td>
          </tr>`
    : "";

  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#030304;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030304;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#0c0e12;border:1px solid #1c1f26;border-radius:16px;">
          <tr>
            <td align="center" style="padding:40px 40px 8px 40px;">
              <img src="${logoSrc}" alt="LUMEN Digital Experiences" width="240" style="display:block;max-width:240px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 40px 8px 40px;">
              <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">${meta.kicker}</p>
              <h1 style="margin:12px 0 0 0;color:#f5f2ea;font-size:28px;font-weight:normal;">${meta.heading(input.name)}</h1>
              <p style="margin:12px 0 0 0;color:#8b93a1;font-size:14px;line-height:1.7;">${safeMessage}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#11141a;border:1px solid #1c1f26;border-radius:12px;padding:16px 20px;">
                <tr>
                  <td style="padding:12px 20px;color:#8b93a1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Package</td>
                  <td style="padding:12px 20px;color:#f5f2ea;font-size:15px;text-align:right;">${input.productName}</td>
                </tr>
              </table>
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td align="center" style="padding:32px 40px 40px 40px;">
              <p style="margin:0;color:#8b93a1;font-size:12px;line-height:1.8;">
                LUMEN Digital Experiences<br />
                <a href="mailto:${BUSINESS_EMAIL}" style="color:#d4af37;text-decoration:none;">${BUSINESS_EMAIL}</a> · ${CONTACT_PHONE}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send a branded email for a preset/custom template (work started, demo
 * ready, need info, delivered, or custom message).
 */
export async function sendBrandedEmail(input: BrandedEmailInput): Promise<EmailDispatchStatus> {
  const logoBase64 = readLogoBase64();
  const html = buildBrandedEmailHtml(
    input,
    logoBase64 ? "cid:lumen-logo" : `${input.origin}/logo.png`
  );
  return dispatchEmail({
    subject: TEMPLATE_META[input.template].subject,
    previewSubject: `[Preview] ${TEMPLATE_META[input.template].subject}`,
    html,
    replyTo: input.email,
    fallbackRows: [
      ["Customer", input.name || input.email],
      ["Email", input.email],
      ["Package", input.productName],
      ["Message", input.message],
    ],
  });
}

/**
 * Branded HTML for the "demo is ready for review" email.
 */
export function buildDemoReadyHtml(input: DemoReadyInput, logoSrc: string): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#030304;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#030304;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#0c0e12;border:1px solid #1c1f26;border-radius:16px;">
          <tr>
            <td align="center" style="padding:40px 40px 8px 40px;">
              <img src="${logoSrc}" alt="LUMEN Digital Experiences" width="240" style="display:block;max-width:240px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 40px 8px 40px;">
              <p style="margin:0;color:#d4af37;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Your Walkthrough Is Ready</p>
              <h1 style="margin:12px 0 0 0;color:#f5f2ea;font-size:30px;font-weight:normal;">${input.name.split(" ")[0] || "Hi"}, your demo is ready for review.</h1>
              <p style="margin:12px 0 0 0;color:#8b93a1;font-size:14px;line-height:1.7;">We've finished ${input.productName}. Take a look and let us know if you'd like any changes.</p>
              ${
                input.pendingPayment
                  ? `<p style="margin:16px 0 0 0;color:#d4af37;font-size:14px;line-height:1.7;">Once you've watched it, log into your dashboard to <strong>approve the demo and pay</strong> — you only pay if you're happy with it.</p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#11141a;border:1px solid #1c1f26;border-radius:12px;padding:16px 20px;">
                <tr>
                  <td style="padding:12px 20px;color:#8b93a1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Package</td>
                  <td style="padding:12px 20px;color:#f5f2ea;font-size:15px;text-align:right;">${input.productName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#8b93a1;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Demo link</td>
                  <td style="padding:12px 20px;color:#d4af37;font-size:14px;text-align:right;word-break:break-all;">${input.demoUrl}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 40px 8px 40px;">
              <a href="${input.demoUrl}" style="display:inline-block;background-color:#d4af37;color:#0a0c10;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:15px 36px;border-radius:999px;">Watch Your Walkthrough</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 40px 40px 40px;">
              <p style="margin:0;color:#8b93a1;font-size:12px;line-height:1.8;">
                Can't see the button? Open this link:<br />
                <a href="${input.demoUrl}" style="color:#d4af37;text-decoration:none;word-break:break-all;">${input.demoUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 40px 40px;">
              <p style="margin:0;color:#8b93a1;font-size:12px;line-height:1.8;">
                LUMEN Digital Experiences<br />
                <a href="mailto:${BUSINESS_EMAIL}" style="color:#d4af37;text-decoration:none;">${BUSINESS_EMAIL}</a> · ${CONTACT_PHONE}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Shared delivery:
 * 1. Resend (if RESEND_API_KEY is set) — branded HTML with the logo inline,
 *    sent to the admin email (preview) first and best-effort to the customer.
 * 2. FormSubmit fallback — plain table email with the logo attached (no key).
 */
/** Send via Brevo (free tier, no domain/DNS needed — just a verified sender email). */
async function sendViaBrevo(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
  attachments?: { filename: string; content: string; content_id?: string }[];
}): Promise<void> {
  const key = process.env["BREVO_API_KEY"];
  const senderEmail = process.env["BREVO_SENDER_EMAIL"];
  const senderName = process.env["BREVO_SENDER_NAME"] || "LUMEN Digital Experiences";
  if (!key || !senderEmail) throw new Error("Brevo is not configured (BREVO_API_KEY + BREVO_SENDER_EMAIL).");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
      replyTo: { email: opts.replyTo },
      ...(opts.attachments?.length
        ? {
            attachment: opts.attachments.map((a) => ({
              name: a.filename,
              content: a.content,
              contentType: "image/png",
            })),
          }
        : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo failed (${res.status}): ${text.slice(0, 300)}`);
  }
}

async function dispatchEmail(opts: DispatchOptions): Promise<EmailDispatchStatus> {
  const resendKey = process.env["RESEND_API_KEY"];
  const logoBase64 = readLogoBase64();
  const fromEmail = process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";
  const fromName = process.env["RESEND_FROM_NAME"] || "LUMEN Digital Experiences";
  const attachments = logoBase64
    ? [
        {
          filename: "logo.png",
          content: logoBase64,
          content_id: "lumen-logo",
          disposition: "inline" as const,
        },
      ]
    : [];

  // Resend is the primary provider. The admin copy always delivers (free tier
  // allows sending to the account owner's own address); the customer copy uses
  // Brevo as a fallback when Resend blocks the recipient (no domain verified).
  if (resendKey) {
    // 1. Admin copy — always deliverable on the free tier.
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [ADMIN_EMAIL],
        subject: opts.previewSubject,
        html: opts.html,
        reply_to: opts.replyTo,
        attachments,
      }),
    });
    if (!adminRes.ok) {
      const text = await adminRes.text();
      throw new Error(`Resend failed (${adminRes.status}): ${text.slice(0, 300)}`);
    }

    // 2. Customer copy — Resend first, Brevo fallback when blocked.
    try {
      const customerRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [opts.replyTo],
          subject: opts.subject,
          html: opts.html,
          reply_to: opts.replyTo,
          attachments,
        }),
      });
      if (!customerRes.ok) {
        const text = await customerRes.text();
        console.error(
          `Customer copy not delivered to ${opts.replyTo} (${customerRes.status}): ${text.slice(0, 200)}`
        );
        // Brevo fallback — free tier sends to any recipient with just a
        // verified sender email (no domain/DNS needed).
        try {
          await sendViaBrevo({
            to: opts.replyTo,
            subject: opts.subject,
            html: opts.html,
            replyTo: opts.replyTo,
            attachments,
          });
          return {
            provider: "brevo",
            admin: "delivered",
            customer: "delivered",
            detail: "Delivered to the customer via Brevo (Resend blocked the customer address — no domain verified).",
          };
        } catch (brevoErr) {
          const detail =
            brevoErr instanceof Error ? brevoErr.message : "Brevo fallback failed.";
          console.error(`Brevo fallback failed for ${opts.replyTo}: ${detail}`);
          return {
            provider: "resend",
            admin: "delivered",
            customer: "blocked",
            detail: `Customer copy blocked by Resend (${customerRes.status}); Brevo fallback failed: ${detail}`,
          };
        }
      }
      return { provider: "resend", admin: "delivered", customer: "delivered" };
    } catch (err) {
      console.error("Customer copy failed to send:", err instanceof Error ? err.message : err);
      return {
        provider: "resend",
        admin: "delivered",
        customer: "blocked",
        detail: "Customer copy failed to send.",
      };
    }
  }

  // No Resend key → FormSubmit fallback (same free service as the contact form).
  // Table email with the logo attached — no API key needed.
  const form = new FormData();
  form.set("_subject", opts.subject);
  form.set("_template", "table");
  form.set("_captcha", "false");
  form.set("_replyto", opts.replyTo);
  form.set("_cc", ADMIN_EMAIL);
  for (const [k, v] of opts.fallbackRows) form.set(k, v);
  if (logoBase64) {
    const buf = Buffer.from(logoBase64, "base64");
    form.set("logo", new File([buf], "lumen-logo.png", { type: "image/png" }));
  }

  const res = await fetch(`https://formsubmit.co/ajax/${BUSINESS_EMAIL}`, {
    method: "POST",
    // FormSubmit's AJAX endpoint rejects requests without a web origin.
    headers: {
      Origin: "https://lumen.co.uk",
      Referer: "https://lumen.co.uk/",
    },
    body: form,
  });
  const text = await res.text();
  let success = false;
  let message = `FormSubmit failed (${res.status})`;
  try {
    const json = JSON.parse(text) as { success?: string; message?: string };
    success = json.success === "true";
    if (json.message) message = `FormSubmit: ${json.message}`;
  } catch {
    success = res.ok;
  }
  if (!success) throw new Error(message);
  return {
    provider: "formsubmit",
    admin: "delivered",
    customer: "skipped",
    detail: "FormSubmit delivers to the business inbox only (hello-lumenexperiences@outlook.com).",
  };
}

/**
 * Send the order confirmation email.
 */
export async function sendOrderConfirmation(input: ConfirmationInput): Promise<EmailDispatchStatus> {
  const logoBase64 = readLogoBase64();
  const html = buildOrderConfirmationHtml(
    input,
    logoBase64 ? "cid:lumen-logo" : `${input.origin}/logo.png`
  );
  return dispatchEmail({
    subject: `Your LUMEN order is confirmed — ${input.productName}`,
    previewSubject: `[Preview] Your LUMEN order is confirmed — ${input.productName}`,
    html,
    replyTo: input.email,
    fallbackRows: [
      ["Customer", input.name || input.email],
      ["Email", input.email],
      ["Phone", input.phone || "—"],
      ["WhatsApp updates", input.whatsappOptIn ? "Yes — opt-in received" : "No"],
      ["Package", input.productName],
      ["Total paid", money(input.amount)],
      ["Order reference", input.orderId.slice(-8).toUpperCase()],
    ],
  });
}

/**
 * Send the "your walkthrough demo is ready" email with the review link.
 */
export async function sendDemoReadyEmail(input: DemoReadyInput): Promise<EmailDispatchStatus> {
  const logoBase64 = readLogoBase64();
  const html = buildDemoReadyHtml(
    input,
    logoBase64 ? "cid:lumen-logo" : `${input.origin}/logo.png`
  );
  return dispatchEmail({
    subject: `Your LUMEN walkthrough is ready for review!`,
    previewSubject: `[Preview] Demo ready — ${input.productName}`,
    html,
    replyTo: input.email,
    fallbackRows: [
      ["Customer", input.name || input.email],
      ["Email", input.email],
      ["Package", input.productName],
      ["Demo link", input.demoUrl],
    ],
  });
}
