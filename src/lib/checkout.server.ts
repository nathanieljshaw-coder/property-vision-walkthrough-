type CheckoutInput = {
  slug: string;
  productName: string;
  amount: number;
  origin: string;
  email?: string | undefined;
  phone?: string | undefined;
  whatsappOptIn?: boolean | undefined;
  addonIds?: string[] | undefined;
  photoCount?: number | undefined;
  /** When set, the completed checkout marks THIS existing order paid (pay-after-approval flow). */
  orderId?: number | undefined;
};

export async function createStripeCheckoutSession(input: CheckoutInput) {
  const key = process.env["STRIPE_RESTRICTED_API_KEY"];
  if (!key) throw new Error("Stripe is not configured.");

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${input.origin}/checkout/cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "gbp");
  params.set("line_items[0][price_data][unit_amount]", String(input.amount));
  params.set("line_items[0][price_data][product_data][name]", input.productName);
  params.set("metadata[slug]", input.slug);
  if (input.addonIds?.length) params.set("metadata[addons]", input.addonIds.join(","));
  if (input.photoCount != null) params.set("metadata[photo_count]", String(input.photoCount));
  if (input.orderId != null) params.set("metadata[order_id]", String(input.orderId));
  if (input.phone) params.set("metadata[phone]", input.phone);
  if (input.whatsappOptIn != null) params.set("metadata[whatsapp_opt_in]", String(input.whatsappOptIn));
  if (input.email) params.set("customer_email", input.email);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !json.url) {
    throw new Error(json.error?.message ?? "Could not start checkout. Please try again.");
  }
  return { url: json.url };
}
