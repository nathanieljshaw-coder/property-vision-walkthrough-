import villaHero from "@/assets/portfolio/villa-sereno-hero.jpg";
import villa1 from "@/assets/portfolio/villa-sereno-1.jpg";
import villa2 from "@/assets/portfolio/villa-sereno-2.jpg";

import alpineHero from "@/assets/portfolio/grand-alpine-hero.jpg";
import alpine1 from "@/assets/portfolio/grand-alpine-1.jpg";
import alpine2 from "@/assets/portfolio/grand-alpine-2.jpg";

import golfHero from "@/assets/portfolio/pine-valley-hero.jpg";
import golf1 from "@/assets/portfolio/pine-valley-1.jpg";
import golf2 from "@/assets/portfolio/pine-valley-2.jpg";

import auraHero from "@/assets/portfolio/aura-dining-hero.jpg";
import aura1 from "@/assets/portfolio/aura-dining-1.jpg";
import aura2 from "@/assets/portfolio/aura-dining-2.jpg";

import cotswoldHero from "@/assets/portfolio/cotswold-haven-hero.jpg";
import cotswold1 from "@/assets/portfolio/cotswold-haven-1.jpg";
import cotswold2 from "@/assets/portfolio/cotswold-haven-2.jpg";

import apexHero from "@/assets/portfolio/apex-estate-hero.jpg";
import apex1 from "@/assets/portfolio/apex-estate-1.jpg";
import apex2 from "@/assets/portfolio/apex-estate-2.jpg";

export type PortfolioProject = {
  slug: string;
  name: string;
  type: string;
  note: string;
  /** demo mini-site content */
  location: string;
  tagline: string;
  intro: string;
  heroImage: string;
  videoUrl: string;
  navItems: string[];
  highlights: { title: string; body: string }[];
  gallery: { src: string; alt: string }[];
  offers: { name: string; detail: string; price: string }[];
  ctaLabel: string;
  ctaNote: string;
  delivered: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "villa-sereno",
    name: "Villa Sereno",
    type: "Holiday Rental",
    note: "Cinematic villa walkthrough and booking site.",
    location: "Costa Blanca, Spain",
    tagline: "A private villa above the sea",
    intro:
      "Five bedrooms, a heated infinity pool and terraces that catch the sun from morning until late evening. Explore every room before you book.",
    heroImage: villaHero,
    videoUrl: "/walkthroughs/villa-sereno.mp4",
    navItems: ["The Villa", "Gallery", "Rates", "Book"],
    highlights: [
      { title: "Sleeps 10", body: "Five en-suite bedrooms across two floors, each with sea or garden views." },
      { title: "Heated Infinity Pool", body: "Twelve metres of pool, lit at night, with shaded loungers and an outdoor kitchen." },
      { title: "Ten Minutes To The Coast", body: "Quiet hillside setting with beaches, marinas and restaurants a short drive away." },
    ],
    gallery: [
      { src: villa1, alt: "Master bedroom with arched sea-view window" },
      { src: villa2, alt: "Open-plan kitchen and shaded dining terrace" },
    ],
    offers: [
      { name: "Low Season", detail: "Nov – Mar · 3 night minimum", price: "£420 / night" },
      { name: "Shoulder Season", detail: "Apr – Jun, Sep – Oct · 5 night minimum", price: "£680 / night" },
      { name: "Peak Summer", detail: "Jul – Aug · 7 night minimum", price: "£950 / night" },
    ],
    ctaLabel: "Check Availability",
    ctaNote: "Direct booking · no platform fees",
    delivered: [
      "Cinematic walkthrough built from the owner's existing photography",
      "Five-page booking website with enquiry form and availability calendar",
      "Custom branding, typography and mobile-first layout",
    ],
  },
  {
    slug: "villa-sereno-full",
    name: "Villa Sereno — Full Estate Tour",
    type: "Holiday Rental",
    note: "Three-minute cinematic tour through every room of the villa.",
    location: "Costa Blanca, Spain",
    tagline: "Every room, one continuous tour",
    intro:
      "A full three-minute walkthrough of Villa Sereno — from the exterior reveal through all twenty-eight rooms: every bedroom, both bathrooms, the kitchens, dining room, bars, libraries, pool, gym, court, theatre, spa and more.",
    heroImage: villaHero,
    videoUrl: "/walkthroughs/villa-sereno-full.mp4",
    navItems: ["The Villa", "Gallery", "Rates", "Book"],
    highlights: [
      { title: "Sleeps 10", body: "Five en-suite bedrooms across two floors, each with sea or garden views." },
      { title: "Heated Infinity Pool", body: "Twelve metres of pool, lit at night, with shaded loungers and an outdoor kitchen." },
      { title: "Ten Minutes To The Coast", body: "Quiet hillside setting with beaches, marinas and restaurants a short drive away." },
    ],
    gallery: [
      { src: villa1, alt: "Master bedroom with arched sea-view window" },
      { src: villa2, alt: "Open-plan kitchen and shaded dining terrace" },
    ],
    offers: [
      { name: "Low Season", detail: "Nov – Mar · 3 night minimum", price: "£420 / night" },
      { name: "Shoulder Season", detail: "Apr – Jun, Sep – Oct · 5 night minimum", price: "£680 / night" },
      { name: "Peak Summer", detail: "Jul – Aug · 7 night minimum", price: "£950 / night" },
    ],
    ctaLabel: "Check Availability",
    ctaNote: "Direct booking · no platform fees",
    delivered: [
      "Three-minute full-property tour across all twenty-eight rooms",
      "Cinematic drone reveal and gentle room-by-room camera moves",
      "Built entirely from the owner's existing photography",
    ],
  },
  {
    slug: "grand-alpine",
    name: "The Grand Alpine Hotel",
    type: "Hotel",
    note: "Room experiences, spa and restaurant tours.",
    location: "Haute-Savoie, France",
    tagline: "Mountain hospitality, quietly grand",
    intro:
      "Forty-two rooms and suites, a candlelit spa and a restaurant with a view of the valley. Walk through every space before you arrive.",
    heroImage: alpineHero,
    videoUrl: "/walkthroughs/grand-alpine.mp4",
    navItems: ["Rooms", "Spa", "Dining", "Reserve"],
    highlights: [
      { title: "42 Rooms & Suites", body: "Six room categories, each with its own walkthrough so guests can compare before booking." },
      { title: "Thermal Spa", body: "Indoor pool, steam rooms and treatment suites open from early morning until late." },
      { title: "Valley Restaurant", body: "Seasonal alpine menu served beside floor-to-ceiling mountain windows." },
    ],
    gallery: [
      { src: alpine1, alt: "Alpine suite with fireplace and mountain view" },
      { src: alpine2, alt: "Candlelit indoor spa pool" },
    ],
    offers: [
      { name: "Classic Room", detail: "Queen bed · valley or garden view", price: "from €240" },
      { name: "Balcony Suite", detail: "King bed · fireplace · private balcony", price: "from €395" },
      { name: "Spa Escape", detail: "Two nights · dinner · full spa access", price: "from €710" },
    ],
    ctaLabel: "Reserve A Room",
    ctaNote: "Best rate guaranteed when booking direct",
    delivered: [
      "Individual walkthroughs for six room categories",
      "Spa, restaurant and lounge experiences linked from the booking journey",
      "Full hotel website with reservation integration and analytics",
    ],
  },
  {
    slug: "pine-valley",
    name: "Pine Valley Golf Resort",
    type: "Golf Resort",
    note: "Hole-by-hole previews and clubhouse journey.",
    location: "Perthshire, Scotland",
    tagline: "Eighteen holes through the pines",
    intro:
      "A championship parkland course, a clubhouse built for long evenings and practice facilities open year round. Play the course before you play the course.",
    heroImage: golfHero,
    videoUrl: "/walkthroughs/pine-valley.mp4",
    navItems: ["The Course", "Clubhouse", "Membership", "Tee Times"],
    highlights: [
      { title: "Hole-By-Hole Preview", body: "Every hole filmed and mapped, with yardages and playing notes from the club pro." },
      { title: "Clubhouse & Dining", body: "Lounge, bar and restaurant overlooking the eighteenth green." },
      { title: "Practice Facilities", body: "Floodlit driving range, short game area and two putting greens." },
    ],
    gallery: [
      { src: golf1, alt: "Clubhouse lounge overlooking the course" },
      { src: golf2, alt: "Par three green beside water at sunrise" },
    ],
    offers: [
      { name: "Visitor Green Fee", detail: "18 holes · weekday", price: "£75" },
      { name: "Day Ticket", detail: "Unlimited golf · lunch included", price: "£120" },
      { name: "Full Membership", detail: "Annual · unlimited play · guest rates", price: "£1,850" },
    ],
    ctaLabel: "Book A Tee Time",
    ctaNote: "Visitors welcome seven days a week",
    delivered: [
      "Hole-by-hole digital experience across all eighteen holes",
      "Clubhouse, restaurant and practice facility walkthroughs",
      "Membership and tee-time platform with course branding throughout",
    ],
  },
  {
    slug: "aura-dining",
    name: "Aura Fine Dining",
    type: "Restaurant",
    note: "Brand-led website with venue walkthrough.",
    location: "Edinburgh, Scotland",
    tagline: "Twelve tables, one tasting menu",
    intro:
      "A small candlelit dining room and a seasonal menu that changes every six weeks. See the room before you reserve it.",
    heroImage: auraHero,
    videoUrl: "/walkthroughs/aura-dining.mp4",
    navItems: ["Menu", "The Room", "Bar", "Reserve"],
    highlights: [
      { title: "Seasonal Tasting Menu", body: "Seven courses built around Scottish producers, changed every six weeks." },
      { title: "Twelve Covers", body: "An intimate room where every table has a view of the pass." },
      { title: "The Bar", body: "Aperitifs and low-intervention wine from six until late, walk-ins welcome." },
    ],
    gallery: [
      { src: aura1, alt: "Plated tasting menu course on dark ceramic" },
      { src: aura2, alt: "Backlit cocktail bar with brass shelving" },
    ],
    offers: [
      { name: "Tasting Menu", detail: "Seven courses · 2.5 hours", price: "£95 pp" },
      { name: "Wine Pairing", detail: "Six glasses selected by the sommelier", price: "£65 pp" },
      { name: "Private Dining", detail: "Full room hire · up to 12 guests", price: "from £1,400" },
    ],
    ctaLabel: "Reserve A Table",
    ctaNote: "Bookings open eight weeks ahead",
    delivered: [
      "Cinematic venue walkthrough of the dining room and bar",
      "Brand-led website with menu, reservations and private dining enquiries",
      "Photography direction and content written for the restaurant",
    ],
  },
  {
    slug: "aura-dining-full",
    name: "Aura Fine Dining — Full Walkthrough",
    type: "Restaurant",
    note: "Two-minute cinematic tour through the dining room and bar.",
    location: "Edinburgh, Scotland",
    tagline: "The room, one continuous tour",
    intro:
      "A full two-minute walkthrough of Aura — from the entrance through the candlelit dining room and across the bar, in one continuous cinematic camera move.",
    heroImage: auraHero,
    videoUrl: "/walkthroughs/aura-dining-full.mp4",
    navItems: ["Menu", "The Room", "Bar", "Reserve"],
    highlights: [
      { title: "Seasonal Tasting Menu", body: "Seven courses built around Scottish producers, changed every six weeks." },
      { title: "Twelve Covers", body: "An intimate room where every table has a view of the pass." },
      { title: "The Bar", body: "Aperitifs and low-intervention wine from six until late, walk-ins welcome." },
    ],
    gallery: [
      { src: aura1, alt: "Plated tasting menu course on dark ceramic" },
      { src: aura2, alt: "Backlit cocktail bar with brass shelving" },
    ],
    offers: [
      { name: "Tasting Menu", detail: "Seven courses · 2.5 hours", price: "£95 pp" },
      { name: "Wine Pairing", detail: "Six glasses selected by the sommelier", price: "£65 pp" },
      { name: "Private Dining", detail: "Full room hire · up to 12 guests", price: "from £1,400" },
    ],
    ctaLabel: "Reserve A Table",
    ctaNote: "Bookings open eight weeks ahead",
    delivered: [
      "Two-minute full walkthrough of the dining room and bar",
      "One continuous cinematic camera move through the whole space",
      "Built from the owner's own cinematic footage",
    ],
  },
  {
    slug: "cotswold-haven",
    name: "Cotswold Haven",
    type: "Holiday Cottage",
    note: "Property experience built from existing photos.",
    location: "Gloucestershire, England",
    tagline: "A honey-stone cottage for slow weekends",
    intro:
      "Three bedrooms, a wood-burning fire and a walled garden, five minutes from the village pub. Built entirely from the owner's existing photographs.",
    heroImage: cotswoldHero,
    videoUrl: "/walkthroughs/cotswold-haven.mp4",
    navItems: ["The Cottage", "Gallery", "Rates", "Book"],
    highlights: [
      { title: "Sleeps 6", body: "Three bedrooms, two bathrooms and a snug that doubles as a fourth sleeping space." },
      { title: "Wood-Burning Fire", body: "Logs included through the winter months, with beams and flagstone floors throughout." },
      { title: "Walled Garden", body: "Private garden with outdoor dining, roses and space for children to run." },
    ],
    gallery: [
      { src: cotswold1, alt: "Beamed living room with log fire" },
      { src: cotswold2, alt: "Country kitchen with range cooker" },
    ],
    offers: [
      { name: "Midweek Break", detail: "Mon – Fri · 3 nights", price: "£420" },
      { name: "Weekend", detail: "Fri – Mon · 3 nights", price: "£510" },
      { name: "Full Week", detail: "7 nights · changeover Friday", price: "£890" },
    ],
    ctaLabel: "Check Dates",
    ctaNote: "Dogs welcome · linen included",
    delivered: [
      "Walkthrough created from the owner's existing photo library — no new filming",
      "Three-page booking site with enquiry form",
      "Warm, countryside-led brand direction",
    ],
  },
  {
    slug: "apex-estate",
    name: "Apex Real Estate",
    type: "Property Company",
    note: "Multi-property digital platform.",
    location: "London, United Kingdom",
    tagline: "Prime residences, explored properly",
    intro:
      "A portfolio platform where every listing carries its own cinematic walkthrough, floor plan and enquiry route.",
    heroImage: apexHero,
    videoUrl: "/walkthroughs/apex-estate.mp4",
    navItems: ["Listings", "Buildings", "Sell With Us", "Enquire"],
    highlights: [
      { title: "Walkthrough Per Listing", body: "Every property on the platform ships with its own guided digital tour." },
      { title: "Building Pages", body: "Lobby, amenities and shared spaces presented once and linked to every unit." },
      { title: "Qualified Enquiries", body: "Buyers arrive having already toured the property, so viewings convert faster." },
    ],
    gallery: [
      { src: apex1, alt: "Penthouse living room overlooking the city skyline" },
      { src: apex2, alt: "Marble residential lobby with concierge desk" },
    ],
    offers: [
      { name: "Skyline Penthouse", detail: "3 bed · 2 bath · 2,140 sq ft", price: "£3.45m" },
      { name: "Riverside Duplex", detail: "2 bed · 2 bath · 1,380 sq ft", price: "£1.95m" },
      { name: "Garden Residence", detail: "4 bed · 3 bath · 2,760 sq ft", price: "£4.20m" },
    ],
    ctaLabel: "Arrange A Viewing",
    ctaNote: "Private appointments seven days a week",
    delivered: [
      "Multi-property platform with a walkthrough attached to every listing",
      "Reusable building pages for shared amenities",
      "Advanced SEO foundations and enquiry tracking",
    ],
  },
];

export function getProject(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}
