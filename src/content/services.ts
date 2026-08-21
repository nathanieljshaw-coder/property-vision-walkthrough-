export type ContentSection = {
  heading?: string;
  body: string[];
};

export type ServicePage = {
  slug: string;
  nav: string;
  eyebrow: string;
  title: string;
  lead: string;
  sections: ContentSection[];
  priceLabel: string;
  priceNote: string;
  ctaLabel: string;
  /** amount in pence, GBP */
  amount: number;
  productName: string;
  metaTitle: string;
  metaDescription: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "airbnb",
    nav: "Airbnb & Holiday Rentals",
    eyebrow: "Airbnb & Holiday Rentals",
    title: "Give Guests More Than Photos",
    lead: "A great holiday property deserves more than a collection of photographs. Give potential guests the opportunity to experience your property before they arrive with a professional digital walkthrough designed around the spaces that matter most.",
    sections: [
      {
        body: [
          "We take your existing photographs and videos and turn them into a smooth, cinematic experience that allows visitors to explore your property from anywhere. Guests can move through bedrooms, bathrooms, kitchens, living areas, gardens, balconies and other spaces in a way that feels much more engaging than scrolling through a standard photo gallery.",
        ],
      },
      {
        heading: "Showcase Your Entire Property",
        body: [
          "Every property is different, which is why your walkthrough is created around your specific space. Whether you own a small apartment, a countryside cottage, a luxury villa or a large holiday home, we can create an experience that highlights the features that make your property special.",
          "We can guide visitors through the property in a natural order, creating a journey from the entrance through the main living spaces and into the bedrooms, outdoor areas and additional facilities. Important features can be given more attention, helping potential guests understand exactly what they can expect when they arrive.",
        ],
      },
      {
        heading: "Turn Existing Content Into Something More",
        body: [
          "You don't need expensive filming equipment or a professional production crew to get started. Your existing photographs and videos can be used as the foundation for your digital experience.",
          "We enhance presentation, create natural movement between scenes and build transitions that make the property feel connected. The result is a polished walkthrough that can be shared with potential guests before they make a booking.",
        ],
      },
      {
        heading: "Connect It To Your Website",
        body: [
          "Your walkthrough can be integrated directly into your existing website, allowing visitors to explore your property without leaving your site. It can also be provided as a shareable link that you can use across your marketing channels.",
          "The experience can be designed to work across phones, tablets and computers, making it easy for potential guests to explore your property wherever they are.",
        ],
      },
      {
        heading: "Designed Around Your Brand",
        body: [
          "Your property should feel unique. We can incorporate your logo, colours, fonts and other branding elements into the experience so that everything feels consistent with your existing identity.",
          "Whether your property has a modern, luxury, traditional or minimalist style, the presentation can be adapted to match it.",
        ],
      },
      {
        heading: "Perfect For",
        body: [
          "This service is designed for Airbnb hosts, holiday-let owners, villas, apartments, cottages, chalets, property managers and short-term rental businesses looking for a more engaging way to present their properties.",
        ],
      },
    ],
    priceLabel: "Starting From £199",
    priceNote: "Give potential guests a better way to experience your property.",
    ctaLabel: "Create Your Property Experience",
    amount: 19900,
    productName: "Property Experience — Airbnb & Holiday Rentals",
    metaTitle: "Airbnb & Holiday Rental Walkthroughs | LUMEN",
    metaDescription:
      "Cinematic digital walkthroughs for Airbnb hosts, villas, cottages and holiday lets. Let guests explore your property before they book. From £199.",
  },
  {
    slug: "hotels",
    nav: "Hotels",
    eyebrow: "Hotels",
    title: "Let Guests Explore Before They Arrive",
    lead: "Choosing a hotel is about more than seeing a few photographs. Guests want to understand what their room looks like, where they will be staying and what facilities are available.",
    sections: [
      {
        body: [
          "Our hotel experiences give potential guests a more complete way to explore your property before making a booking. From individual bedrooms and suites to restaurants, spas, pools and outdoor spaces, your hotel can be presented as a complete digital experience.",
        ],
      },
      {
        heading: "Showcase Every Part Of Your Hotel",
        body: [
          "A hotel has countless details that photographs alone may not fully communicate. We can create individual experiences for different room categories, suites and accommodation options, allowing guests to compare the spaces available to them.",
          "Common areas can also be showcased, including reception, lounges, restaurants, bars, conference rooms, spas, gyms, pools and outdoor spaces.",
          "This gives visitors a much better understanding of the complete experience your hotel provides.",
        ],
      },
      {
        heading: "Room Experiences",
        body: [
          "Different room types can be presented individually, allowing guests to explore exactly what they could be booking.",
          "Showcase the layout, furniture, bathrooms, views, balconies, features and overall atmosphere of each room. These experiences can then be connected to the relevant sections of your website or booking journey.",
        ],
      },
      {
        heading: "Facilities & Hospitality",
        body: [
          "Your hotel isn't just a bedroom.",
          "Show potential guests what happens beyond their room. Showcase your restaurant, bar, spa, swimming pool, gym, gardens, event spaces and other facilities through professional digital experiences.",
          "This can help communicate the atmosphere and character of your hotel before guests arrive.",
        ],
      },
      {
        heading: "Built Around Your Brand",
        body: [
          "Every hotel has its own identity. Your digital experience can be designed around your existing branding, including your logo, colours, typography and visual style.",
          "The goal is to make the walkthrough feel like an extension of your hotel rather than a separate product.",
        ],
      },
      {
        heading: "Integrate Everything Into Your Website",
        body: [
          "Your experiences can be integrated directly into your hotel's existing website, allowing visitors to explore rooms and facilities while they browse.",
          "Multiple experiences can be organised into different sections, making it easy for guests to find exactly what they are looking for.",
        ],
      },
      {
        heading: "Designed For Hotels Of Every Size",
        body: [
          "Whether you operate a small boutique hotel, a countryside B&B, a luxury resort or a large hospitality group, the experience can be scaled around your property.",
          "Larger hotels can have multiple room categories, facilities and locations connected together to create one complete digital journey.",
        ],
      },
    ],
    priceLabel: "Starting From £599",
    priceNote: "Give potential guests a reason to explore your hotel before they book.",
    ctaLabel: "Create Your Hotel Experience",
    amount: 59900,
    productName: "Hotel Digital Experience",
    metaTitle: "Hotel Digital Experiences & Room Walkthroughs | LUMEN",
    metaDescription:
      "Let guests explore rooms, suites, restaurants, spas and facilities before they book with cinematic hotel walkthroughs. From £599.",
  },
  {
    slug: "golf",
    nav: "Golf Courses & Resorts",
    eyebrow: "Golf Courses & Golf Resorts",
    title: "Let Visitors Experience Your Course Before They Play",
    lead: "A golf course is difficult to understand from a handful of photographs.",
    sections: [
      {
        body: [
          "Show potential visitors what makes your course special with an immersive digital experience that allows them to explore your facilities, clubhouse and course before they arrive.",
          "From individual holes to the clubhouse, restaurant and practice facilities, create a digital presence that represents the complete experience of visiting your club.",
        ],
      },
      {
        heading: "Showcase Your Course",
        body: [
          "Give visitors a better understanding of your course by creating experiences around individual holes, key areas and the overall layout.",
          "Highlight the character of the course, important features and the environment surrounding it. Visitors can explore the areas that matter to them before deciding to visit.",
        ],
      },
      {
        heading: "Hole-by-Hole Experiences",
        body: [
          "Create dedicated experiences for individual holes or selected sections of your course.",
          "This can be particularly useful for visitors who have never played the course before, members introducing friends to the club or golfers considering booking a round.",
          "Each experience can be presented as part of a larger digital journey across the course.",
        ],
      },
      {
        heading: "More Than The Course",
        body: [
          "A golf club is about more than eighteen holes.",
          "Showcase your clubhouse, restaurant, bar, pro shop, changing facilities, driving range, putting greens and other practice areas.",
          "If your club offers accommodation, weddings, events or other hospitality services, these can also be incorporated into the experience.",
        ],
      },
      {
        heading: "Attract Visitors & Members",
        body: [
          "Your digital experience can help potential members understand what your club offers before they visit.",
          "For golf resorts, it can also give visitors considering a trip a better understanding of the complete experience, from accommodation and dining to the course itself.",
        ],
      },
      {
        heading: "Built Around Your Club",
        body: [
          "Your club's branding can be incorporated throughout the website and walkthrough experience.",
          "Use your existing logo, colours, fonts and photography to create a digital presence that feels like a natural extension of your club.",
        ],
      },
      {
        heading: "Create A Complete Golf Resort Experience",
        body: [
          "For larger clubs and resorts, we can combine multiple experiences into one complete digital platform.",
          "Visitors could move from the course to the clubhouse, explore the restaurant, view accommodation and discover additional facilities from a single website.",
        ],
      },
    ],
    priceLabel: "Starting From £799",
    priceNote: "Give golfers a reason to explore your course before they arrive.",
    ctaLabel: "Create Your Golf Experience",
    amount: 79900,
    productName: "Golf Course & Resort Experience",
    metaTitle: "Golf Course & Resort Digital Experiences | LUMEN",
    metaDescription:
      "Hole-by-hole walkthroughs, clubhouse tours and complete digital platforms for golf courses and resorts. From £799.",
  },
  {
    slug: "websites",
    nav: "Business Websites",
    eyebrow: "Business Websites",
    title: "A Website Built Around Your Business",
    lead: "Your website is often the first interaction a potential customer has with your business.",
    sections: [
      {
        body: [
          "It should immediately communicate who you are, what you offer and why someone should choose you.",
          "We create professional websites designed around your business rather than forcing your business into a generic template.",
        ],
      },
      {
        heading: "Designed Around Your Brand",
        body: [
          "Your website should look and feel like your business.",
          "We can build your website around your existing logo, colours, typography, photography and visual identity. If you don't have an established brand, we can help create a consistent visual direction for your website.",
          "The result is a website that feels professional, recognisable and specific to your business.",
        ],
      },
      {
        heading: "More Than A Website",
        body: [
          "A modern business website should do more than display information.",
          "Your website can include professional galleries, cinematic walkthroughs, contact forms, location information, social media integration, booking features and other tools designed to help visitors take the next step.",
          "For properties, hotels and venues, walkthroughs can be placed directly within the website so customers can explore the space while learning about the business.",
        ],
      },
      {
        heading: "Designed For Every Screen",
        body: [
          "Your customers may discover your business from a phone, tablet, laptop or desktop computer.",
          "Every website is designed to provide a smooth experience across different screen sizes, ensuring your content remains easy to navigate and your most important information is always accessible.",
        ],
      },
      {
        heading: "Help Customers Find You",
        body: [
          "Your website can be structured with search engines in mind, helping them understand your business, services and location.",
          "We can provide strong SEO foundations, clear page structures and professionally written content designed around the people you want to reach.",
        ],
      },
      {
        heading: "Keep Your Website Looking Professional",
        body: [
          "Your business changes over time, and your website should be able to change with it.",
          "New services, photographs, properties, opening times and information can be added as your business develops.",
          "We can also provide ongoing maintenance and support for businesses that want someone to look after their website.",
        ],
      },
    ],
    priceLabel: "Starting From £199",
    priceNote: "Create a website that represents your business properly.",
    ctaLabel: "Create Your Website",
    amount: 19900,
    productName: "Business Website",
    metaTitle: "Professional Business Website Design | LUMEN",
    metaDescription:
      "Bespoke business websites with galleries, walkthrough integration, SEO foundations and mobile-first design. From £199.",
  },
];

export const packagePages: ServicePage[] = [
  {
    slug: "professional",
    nav: "Professional Website",
    eyebrow: "Professional Website",
    title: "A Complete Online Presence For Your Business",
    lead: "The Professional Website package is designed for businesses that want more than a basic website.",
    sections: [
      {
        body: [
          "It provides the structure and features needed to create a polished online presence while leaving room for your business to grow.",
        ],
      },
      {
        heading: "What's Included",
        body: [
          "Your website can include up to eight professionally designed pages, custom branding, modern animations, professional galleries, contact forms, walkthrough integration, analytics and mobile optimisation.",
          "Each page is designed around its purpose, whether that means introducing your business, showcasing your services, presenting your property or encouraging visitors to get in touch.",
        ],
      },
      {
        heading: "Designed Around Your Customers",
        body: [
          "A professional website should make it easy for visitors to find the information they need.",
          "We create clear navigation and page structures that guide visitors through your business and towards important actions such as contacting you, making an enquiry, booking or exploring your property.",
        ],
      },
      {
        heading: "Perfect For Growing Businesses",
        body: [
          "This package is particularly suited to restaurants, hotels, property businesses, golf clubs, professional services and established local businesses.",
          "It provides enough flexibility to create a distinctive website without the complexity of a large custom project.",
        ],
      },
    ],
    priceLabel: "From £399",
    priceNote: "Create a stronger online presence with a website designed around your business.",
    ctaLabel: "Build Your Professional Website",
    amount: 39900,
    productName: "Professional Website Package",
    metaTitle: "Professional Website Package | LUMEN",
    metaDescription:
      "Up to eight designed pages, custom branding, galleries, walkthrough integration and analytics. From £399.",
  },
  {
    slug: "business",
    nav: "Business Website",
    eyebrow: "Business Website",
    title: "A More Powerful Digital Presence",
    lead: "The Business Website package is designed for companies that require a larger, more advanced online presence.",
    sections: [
      {
        body: [
          "Rather than simply providing a collection of pages, we create a complete digital platform around your business.",
        ],
      },
      {
        heading: "Built For Larger Businesses",
        body: [
          "Your website can include multiple pages, advanced animations, multiple walkthroughs, booking and contact integrations, analytics, advanced SEO, custom domain setup and bespoke sections.",
          "This allows the website to grow around your business rather than becoming restrictive as your requirements increase.",
        ],
      },
      {
        heading: "Multiple Experiences",
        body: [
          "Businesses with multiple properties, locations or facilities can bring everything together in one place.",
          "Hotels can showcase different room types. Golf resorts can showcase courses and accommodation. Property companies can present multiple properties. Restaurants can create separate experiences for different venues.",
        ],
      },
      {
        heading: "Completely Bespoke",
        body: [
          "Every business has different requirements.",
          "Your website can include custom sections and functionality designed around the way your business operates and the way your customers interact with you.",
        ],
      },
      {
        heading: "Ongoing Support",
        body: [
          "Your website can continue to evolve after launch.",
          "We can provide ongoing support, updates and maintenance so that your online presence stays current as your business develops.",
        ],
      },
    ],
    priceLabel: "From £799",
    priceNote: "For businesses that need more than a standard website.",
    ctaLabel: "Create Your Business Website",
    amount: 79900,
    productName: "Business Website Package",
    metaTitle: "Business Website Package | LUMEN",
    metaDescription:
      "A larger digital platform with multiple walkthroughs, integrations, advanced SEO and bespoke sections. From £799.",
  },
  {
    slug: "complete",
    nav: "Complete Digital Experience",
    eyebrow: "Complete Digital Experience",
    title: "Your Entire Business In One Experience",
    lead: "Some businesses need more than a website.",
    sections: [
      {
        body: [
          "Hotels, golf resorts, property companies and larger businesses often have multiple locations, facilities, services and experiences that need to be brought together.",
          "The Complete Digital Experience combines a professional website with cinematic walkthroughs, interactive experiences and custom digital features.",
        ],
      },
      {
        heading: "One Platform. Everything You Offer.",
        body: [
          "Visitors can explore your website, discover your services, view your facilities, explore properties and walkthroughs, find your location and contact your business from one central experience.",
          "Everything is designed to work together rather than feeling like separate services.",
        ],
      },
      {
        heading: "Completely Custom",
        body: [
          "There is no fixed structure for a Complete Digital Experience.",
          "Your project can include multiple cinematic walkthroughs, interactive galleries, custom sections, advanced branding, analytics, SEO, domain setup and other functionality based on your requirements.",
        ],
      },
      {
        heading: "Designed For Your Business",
        body: [
          "We work around your business, your customers and your goals.",
          "Whether you're trying to increase bookings, attract new members, showcase properties, promote a venue or simply create a stronger online presence, the experience can be designed around the outcome you want.",
        ],
      },
    ],
    priceLabel: "From £1,499",
    priceNote:
      "For businesses that want a complete digital presence rather than a standard website.",
    ctaLabel: "Create Your Digital Experience",
    amount: 149900,
    productName: "Complete Digital Experience",
    metaTitle: "Complete Digital Experience | LUMEN",
    metaDescription:
      "A professional website combined with cinematic walkthroughs, interactive experiences and custom digital features. From £1,499.",
  },
];

export const allOfferings = [...servicePages, ...packagePages];

export function findOffering(slug: string) {
  return allOfferings.find((o) => o.slug === slug);
}
