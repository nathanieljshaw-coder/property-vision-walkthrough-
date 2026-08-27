export type Addon = {
  id: string;
  label: string;
  detail: string;
  /** amount in pence, GBP */
  amount: number;
};

export const ADDONS: Addon[] = [
  {
    id: "extra-room",
    label: "Extra Room Walkthrough",
    detail: "Additional room or space included in your walkthrough.",
    amount: 7500,
  },
  {
    id: "drone",
    label: "Drone Footage",
    detail: "Aerial shots of the exterior and grounds woven into the experience.",
    amount: 7500,
  },
  {
    id: "rush",
    label: "Rush Delivery",
    detail: "Priority delivery in 5 working days instead of the standard turnaround.",
    amount: 5000,
  },
  {
    id: "unlimited-revisions",
    label: "Unlimited Revisions",
    detail: "Unlimited rounds of changes until the walkthrough is exactly right.",
    amount: 7500,
  },
  {
    id: "extended",
    label: "Extended Walkthrough",
    detail: "A longer, more detailed tour of the property or venue.",
    amount: 7500,
  },
  {
    id: "music",
    label: "Customizable Music",
    detail: "A soundtrack tailored to your property — you choose the style, mood and length.",
    amount: 7500,
  },
  {
    id: "extra-page",
    label: "Extra Website Page",
    detail: "An additional designed page for your website.",
    amount: 7500,
  },
  {
    id: "add-walkthrough",
    label: "Add a Cinematic Walkthrough",
    detail: "Include a cinematic walkthrough of your property or venue in the website.",
    amount: 7500,
  },
];

/** Add-on ids that apply to walkthrough-based packages (property, hotel, golf). */
export const WALKTHROUGH_ADDONS = ["extra-room", "drone", "rush", "unlimited-revisions", "extended", "music"];

/** Add-on ids that apply to website packages. */
export const WEBSITE_ADDONS = ["extra-page", "add-walkthrough", "rush", "unlimited-revisions"];

/** Add-on ids that apply to advert packages. */
export const ADVERT_ADDONS = ["drone", "rush", "unlimited-revisions", "music"];

/** Complete Digital Experience combines a website with walkthroughs — all add-ons apply. */
export const COMPLETE_ADDONS = Array.from(new Set([...WALKTHROUGH_ADDONS, ...WEBSITE_ADDONS]));

const ADVERT_SLUGS = ["social-media-advert", "cinematic-advert", "advert-campaign"];

export function isWalkthroughPackage(slug: string): boolean {
  return ["airbnb", "hotels", "golf", "ski-biking-resorts"].includes(slug);
}

export function addonsForSlug(slug: string): string[] {
  if (ADVERT_SLUGS.includes(slug)) return ADVERT_ADDONS;
  if (slug === "complete") return COMPLETE_ADDONS;
  return isWalkthroughPackage(slug) ? WALKTHROUGH_ADDONS : WEBSITE_ADDONS;
}

export function addonAmount(addonIds: string[]): number {
  return ADDONS.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.amount, 0);
}
