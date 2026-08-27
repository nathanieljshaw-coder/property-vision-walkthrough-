/**
 * WhatsApp Cloud API (Meta) — free tier, no Twilio.
 * Requires two env vars in `.env.local`:
 *   WHATSAPP_ACCESS_TOKEN  — permanent token from Meta (WhatsApp > API Setup)
 *   WHATSAPP_PHONE_NUMBER_ID — your business number's ID (same page)
 */

function config() {
  return {
    token: process.env["WHATSAPP_ACCESS_TOKEN"],
    phoneNumberId: process.env["WHATSAPP_PHONE_NUMBER_ID"],
  };
}

export function whatsappConfigured(): boolean {
  const { token, phoneNumberId } = config();
  return Boolean(token && phoneNumberId);
}

/** Normalize any UK/international phone format to E.164 (+44…). */
export function normalizePhoneE164(phone: string): string | null {
  let digits = phone.trim().replace(/[\s()-]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "44" + digits.slice(1);
  if (!/^\d{10,15}$/.test(digits)) return null;
  return "+" + digits;
}

/** Send a plain-text WhatsApp message to a single recipient. */
export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  const { token, phoneNumberId } = config();
  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp is not configured (WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID).");
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WhatsApp failed (${res.status}): ${text.slice(0, 300)}`);
  }
}
