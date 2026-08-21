import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createStripeCheckoutSession } from "./checkout.server";
import { findOffering } from "@/content/services";
import { addonAmount, addonsForSlug } from "./addons";

const schema = z.object({
  slug: z.string().min(1),
  origin: z.string().url(),
  email: z.string().email().optional(),
  addonIds: z.array(z.string()).optional(),
  photoCount: z.number().int().min(0).max(1000).optional(),
});

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const offering = findOffering(data.slug);
    if (!offering) throw new Error("Unknown package.");
    const allowed = addonsForSlug(offering.slug);
    const addons = (data.addonIds ?? []).filter((id) => allowed.includes(id));
    return createStripeCheckoutSession({
      slug: offering.slug,
      productName: offering.productName,
      amount: offering.amount + addonAmount(addons),
      origin: data.origin,
      email: data.email,
      addonIds: addons,
      photoCount: data.photoCount,
    });
  });
