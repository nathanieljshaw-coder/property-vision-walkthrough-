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
    amount: 4900,
  },
  {
    id: "drone",
    label: "Drone Footage",
    detail: "Aerial shots of the exterior and grounds woven into the experience.",
    amount: 9900,
  },
  {
    id: "rush",
    label: "Rush Delivery",
    detail: "Priority delivery in 5 working days instead of the standard turnaround.",
    amount: 7500,
  },
  {
    id: "unlimited-revisions",
    label: "Unlimited Revisions",
    detail: "Unlimited rounds of changes until the walkthrough is exactly right.",
    amount: 14900,
  },
  {
    id: "extended",
    label: "Extended Walkthrough",
    detail: "A longer, more detailed tour of the property or venue.",
    amount: 12900,
  },
  {
    id: "extra-page",
    label: "Extra Website Page",
    detail: "An additional designed page for your website.",
    amount: 4900,
  },
  {
    id: "add-walkthrough",
    label: "Add a Cinematic Walkthrough",
    detail: "Include a cinematic walkthrough of your property or venue in the website.",
    amount: 19900,
  },
];

/** Add-on ids that apply to walkthrough-based packages (property, hotel, golf). */
export const WALKTHROUGH_ADDONS = ["extra-room", "drone", "rush", "unlimited-revisions", "extended"];

/** Add-on ids that apply to website packages. */
export const WEBSITE_ADDONS = ["extra-page", "add-walkthrough", "rush", "unlimited-revisions"];

/** Complete Digital Experience combines a website with walkthroughs — all add-ons apply. */
export const COMPLETE_ADDONS = Array.from(new Set([...WALKTHROUGH_ADDONS, ...WEBSITE_ADDONS]));

export function isWalkthroughPackage(slug: string): boolean {
  return ["airbnb", "hotels", "golf"].includes(slug);
}

export function addonsForSlug(slug: string): string[] {
  if (slug === "complete") return COMPLETE_ADDONS;
  return isWalkthroughPackage(slug) ? WALKTHROUGH_ADDONS : WEBSITE_ADDONS;
}

export function addonAmount(addonIds: string[]): number {
  return ADDONS.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.amount, 0);
}
