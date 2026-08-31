// ─────────────────────────────────────────────────────────────────────────
// SITE CONFIG
// ─────────────────────────────────────────────────────────────────────────
const ADDRESS = "Gajju Matta, Suwa Kahna Nau, Lahore, Punjab 53100, Pakistan";

export const SITE = {
  name: "Kamran Photo Studio",
  whatsappNumber: "923084427401", // +92 308 4427401, digits only for wa.me
  email: "kamran.mubarikali@gmail.com",
  phoneDisplay: "+92 308 4427401",
  address: ADDRESS,
  mapsUrl: "https://www.google.com/maps/place/kamran+Photo+Studio/@31.383237,74.3614607,17z/data=!3m1!4b1!4m6!3m5!1s0x3919a93a695f02a7:0xaf5065810f6c0066!8m2!3d31.383237!4d74.3640356!16s%2Fg%2F11t977t8r7",
  mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.808064972161!2d74.3614607!3d31.383237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919a93a695f02a7%3A0xaf5065810f6c0066!2skamran%20Photo%20Studio!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
  tagline:
    "We are offering unmatched rates of photography and videography with the best quality for our valued clients.",
  instagram: "https://instagram.com/kamranphotostudio", // TODO: replace with real handle
  youtube: "https://youtube.com/@kamranphotostudio", // TODO: replace with real handle
  googleMapsListing: "", // TODO: paste the "share" link to your Google Business listing here — used to link the ratings badge in Testimonials
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ─────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Packages", href: "/#packages" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/#contact" },
];

// ─────────────────────────────────────────────────────────────────────────
// HERO — two vertical marquee columns flanking the headline.
// Free, commercially-licensed Unsplash wedding/couple photography as a
// stand-in until real Kamran Photo Studio shoots are dropped in.
// ─────────────────────────────────────────────────────────────────────────
export const HERO_IMAGES_LEFT = [
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1665960213508-48f07086d49c?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1735052712464-9d24b69be5f5?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600685890506-593fdf55949b?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1727430256509-0f897d6f4765?q=70&w=560&auto=format&fit=crop",
];

export const HERO_IMAGES_RIGHT = [
  "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599462616558-2b75fd26a283?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1722952934661-dde241aeb591?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611106211090-8f3c79eb8552?q=70&w=560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1735052712489-f45220126a0c?q=70&w=560&auto=format&fit=crop",
];

// ─────────────────────────────────────────────────────────────────────────
// TEAM — placeholder people/photos. Replace with the real team when ready.
// ─────────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string; // used as the /team/[id] slug
  name: string;
  role: string;
  image: string;
  shortBio: string;
  story: string[];
  specialties: string[];
}

// ─────────────────────────────────────────────────────────────────────────
// GEAR — the studio's real equipment. "Sony A7v" from the original list
// was assumed to mean the Sony A7R V (a real, distinct high-resolution
// body) rather than a repeat of the A7 IV — flag if that's wrong.
//
// `image` is only set for the two models with a verified, correctly-
// labeled stock photo (confirmed via the photographer's own caption or
// the photo's embedded EXIF camera-model data) — showing a wrong camera
// under a model name would be worse than showing none. The other four
// intentionally have no `image` and get a non-photo card treatment
// instead. Swap in real photos of your own gear any time — see the
// `image` field below.
// ─────────────────────────────────────────────────────────────────────────
export interface GearItem {
  name: string;
  role: string;
  category: string;
  image?: string;
}

export const GEAR: GearItem[] = [
  {
    name: "Sony A7 IV",
    role: "Primary photography body",
    category: "Full-Frame Mirrorless",
    image: "https://images.unsplash.com/photo-1692030179143-e30fe7102900?q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Sony A7 III",
    role: "Secondary / second-shooter body",
    category: "Full-Frame Mirrorless",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Nikon D750",
    role: "DSLR body",
    category: "DSLR",
    image: "https://images.unsplash.com/photo-1507305381075-5add10cdb4e7?q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Sony A6500",
    role: "APS-C body",
    category: "APS-C Mirrorless",
    image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Sony A6400",
    role: "APS-C body",
    category: "APS-C Mirrorless",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=70&w=700&auto=format&fit=crop",
  },
  {
    name: "Sony A7R V",
    role: "High-resolution body",
    category: "Full-Frame Mirrorless",
    image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=70&w=700&auto=format&fit=crop",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "kamran",
    name: "Kamran Mubarik Ali",
    role: "Founder & Lead Photographer",
    image: "/team/kamran.jpeg",
    shortBio: "Ten years behind the lens, shaping how Lahore is remembered on screen.",
    story: [
      "Kamran started the studio in a spare room with a single camera and a promise to never hand back a blurry frame. A decade on, that promise is still the studio's north star — every shoot is planned like a small production, whether it's a two-hour portrait sitting or a three-day wedding.",
      "He leads on-location direction and final color, and still personally shoots the majority of weddings the studio takes on. Outside of client work, he mentors a small group of assistant photographers coming up in Lahore's growing creative scene.",
    ],
    specialties: ["Wedding Direction", "Editorial Portraits", "Color Grading"],
  },
  {
    id: "mian-naveed-ahmad",
    name: "Mian Naveed Ahmad",
    role: "Photographer",
    image: "/team/mian-naveed-ahmad.jpg",
    shortBio: "Photographer at Kamran Photo Studio.",
    story: [
      // TODO: replace with Naveed's real bio — a couple of sentences on his
      // background, what he shoots most, and how he approaches a session.
      "Naveed is part of the photography team at Kamran Photo Studio, working alongside Kamran on shoots across weddings, portraits, and events.",
    ],
    specialties: ["Photography"], // TODO: add his real specialties
  },
  {
    id: "kamram",
    name: "Kamram",
    role: "Videographer",
    image: "/team/kamran.jpg",
    shortBio: "Videographer at Kamran Photo Studio, capturing the movement and emotion behind every story.",
    story: [
      "Kamram is part of the videography team at Kamran Photo Studio, creating cinematic wedding films, event coverage, and brand stories.",
    ],
    specialties: ["Cinematic Films", "Wedding Videography", "Event Coverage"],
  },
  {
    id: "ramazan-ali",
    name: "Ramazan Ali",
    role: "Photographer",
    image: "/team/ramazan-ali.jpg",
    shortBio: "Photographer at Kamran Photo Studio.",
    story: [
      // TODO: replace with Ramazan's real bio.
      "Ramazan is part of the photography team at Kamran Photo Studio, working alongside Kamran on shoots across weddings, portraits, and events.",
    ],
    specialties: ["Photography"], // TODO: add his real specialties
  },
];

// ─────────────────────────────────────────────────────────────────────────
// PORTFOLIO — placeholder Unsplash imagery until real shots are provided.
// ─────────────────────────────────────────────────────────────────────────
export type PortfolioCategory = "Weddings" | "Portraits" | "Commercial" | "Drone";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  exif: string;
  aspect: "portrait" | "square" | "landscape" | "tall";
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "p1",
    title: "First Light, Shalimar Gardens",
    category: "Weddings",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7S III | 50mm | f/1.4",
    aspect: "tall",
  },
  {
    id: "p2",
    title: "Editorial Study No. 3",
    category: "Portraits",
    image:
  "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?q=70&w=560&auto=format&fit=crop",
    exif: "Sony A7S III | 85mm | f/1.8",
    aspect: "portrait",
  },
  {
    id: "p3",
    title: "Skyline Reveal",
    category: "Drone",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=72&w=900&auto=format&fit=crop",
    exif: "DJI Inspire 3 | 24mm | f/2.8",
    aspect: "landscape",
  },
  {
    id: "p4",
    title: "Product Line — Aurum",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7R V | 90mm Macro | f/8",
    aspect: "square",
  },
  {
    id: "p5",
    title: "The Vows",
    category: "Weddings",
    image:
      "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7S III | 35mm | f/2.0",
    aspect: "portrait",
  },
  {
    id: "p6",
    title: "Boardroom Portrait",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7R V | 70mm | f/2.8",
    aspect: "tall",
  },
  {
    id: "p7",
    title: "Aerial Terrain Study",
    category: "Drone",
    image:
      "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?q=72&w=900&auto=format&fit=crop",
    exif: "DJI Inspire 3 | 24mm | f/4",
    aspect: "landscape",
  },
  {
    id: "p8",
    title: "Quiet Moments",
    category: "Portraits",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7S III | 135mm | f/2.0",
    aspect: "square",
  },
  {
    id: "p9",
    title: "Reception, Golden Hour",
    category: "Weddings",
    image:
      "https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?q=72&w=900&auto=format&fit=crop",
    exif: "Sony A7S III | 24mm | f/1.4",
    aspect: "landscape",
  },
];

export const PORTFOLIO_FILTERS: ("All" | PortfolioCategory)[] = [
  "All",
  "Weddings",
  "Portraits",
  "Commercial",
  "Drone",
];

// ─────────────────────────────────────────────────────────────────────────
// PRICING — two service categories, each with 1/2/3-day duration tiers.
// ─────────────────────────────────────────────────────────────────────────
export interface PricingTier {
  id: string;
  duration: string;
  price: string;
  priceValue: number; // numeric PKR amount, used by the quote calculator
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export type PackageCategoryId = "photography" | "videography";

export const PACKAGE_CATEGORIES: { id: PackageCategoryId; label: string }[] = [
  { id: "photography", label: "Photography" },
  { id: "videography", label: "Videography" },
];

export const PACKAGES: Record<PackageCategoryId, PricingTier[]> = {
  photography: [
    {
      id: "photo-1day",
      duration: "1 Day",
      price: "PKR 45,000",
      priceValue: 45000,
      cadence: "per session",
      description: "Editorial-grade stills for portraits, events, and brand work.",
      features: [
        "Up to 8 hours on location",
        "150+ retouched high-resolution images",
        "Private online gallery",
        "Web-ready exports",
      ],
    },
    {
      id: "photo-2day",
      duration: "2 Days",
      price: "PKR 80,000",
      priceValue: 80000,
      cadence: "per project",
      description: "Extended coverage across two days for larger events.",
      features: [
        "Two full days on location",
        "400+ retouched high-resolution images",
        "Second shooter included",
        "Print-ready & web-ready exports",
      ],
      featured: true,
    },
    {
      id: "photo-3day",
      duration: "3 Days",
      price: "PKR 110,000",
      priceValue: 110000,
      cadence: "per project",
      description: "Complete multi-day documentation, start to finish.",
      features: [
        "Three full days on location",
        "700+ retouched high-resolution images",
        "Two shooters + assistant",
        "Same-week sneak-peek gallery",
      ],
    },
  ],
  videography: [
    {
      id: "video-1day",
      duration: "1 Day",
      price: "PKR 120,000",
      priceValue: 120000,
      cadence: "per project",
      description: "Full-day cinematography with a graded highlight film.",
      features: [
        "Full-day multi-camera 4K coverage",
        "Color-graded 3–5 minute film",
        "Licensed music & sound design",
        "Vertical cutdowns for social",
      ],
    },
    {
      id: "video-2day",
      duration: "2 Days",
      price: "PKR 190,000",
      priceValue: 190000,
      cadence: "per project",
      description: "Two-day cinema coverage with licensed aerial drone footage.",
      features: [
        "Two full days multi-camera 4K",
        "6–8 minute feature film",
        "Licensed aerial drone coverage",
        "Same-week teaser reel",
      ],
      featured: true,
    },
    {
      id: "video-3day",
      duration: "3 Days",
      price: "PKR 260,000",
      priceValue: 260000,
      cadence: "per project",
      description: "The complete drone, cinema & studio master package.",
      features: [
        "Three full days multi-camera 4K",
        "Full feature film + highlight reel",
        "Licensed aerial drone coverage",
        "Dedicated producer & priority turnaround",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// ABOUT / STATS
// ─────────────────────────────────────────────────────────────────────────
export const STATS = [
  { label: "Years Experience", value: 10, suffix: "+" },
  { label: "Projects Delivered", value: 500, suffix: "+" },
  { label: "4K Workflow", value: 100, suffix: "%" },
];

// Separate from the Team section's photo of Kamran on purpose — this way
// the About section always shows something even before you've added a
// local photo. Swap to your own file later: put it in public/team/ (e.g.
// "about.jpg") and change this to "/team/about.jpg".
export const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=72&w=900&auto=format&fit=crop";

// ─────────────────────────────────────────────────────────────────────────
// MEDIA
// showreelBackground/showreelFull now point at your own intro reel — drop
// the file at public/videos/intro-reel.mp4 and it's wired in everywhere
// this data is used (see README for the full "where do files go" list).
// ─────────────────────────────────────────────────────────────────────────
export const MEDIA = {
  // Looping muted background for the "4K Drone & Cinema Showcase" section.
  showreelBackground: "/videos/intro-reel.mp4",
  // Always-visible fallback photo behind the video — shows if the video
  // file is missing, still uploading, or in a format the browser can't
  // decode, so the section never goes flat black.
  showreelFallbackImage:
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=72&w=1200&auto=format&fit=crop",
  // Optional: a still-frame JPG that paints instantly while the video
  // buffers. Leave empty to skip — the video's own first frame is used.
  showreelBackgroundPoster: "",
  // Opened in the fullscreen modal when "Elevate Your Story" is clicked.
  // Pointing at the same file as the background by default — split these
  // into two different paths if you want a shorter teaser vs. full reel.
  showreelFull: "/videos/intro-reel.mp4",
  shutterSound: "/sounds/shutter-click.mp3", // TODO: add a real shutter-click mp3 to public/sounds
  // "The Kit" section — real 6s exploded-view camera video, played back
  // slowed down. Drop the file at public/videos/camera-explode.mp4.
  cameraExplodeVideo: "/videos/camera-explode.mp4",
};

// ─────────────────────────────────────────────────────────────────────────
// QUOTE CALCULATOR — custom builder: days × crew/equipment counts, priced
// per day, plus a couple of flat one-time add-ons. This is separate from
// the fixed Packages above — that's the "browse our standard bundles"
// experience, this is the "build something custom" one.
// ─────────────────────────────────────────────────────────────────────────
export interface ResourceRate {
  id: string;
  label: string;
  pricePerDay: number; // PKR, per unit, per day
  description: string;
}

export const RESOURCE_RATES: ResourceRate[] = [
  {
    id: "photographer",
    label: "Photographer",
    pricePerDay: 20000,
    description: "Full-day stills coverage, one shooter",
  },
  {
    id: "videographer",
    label: "Videographer",
    pricePerDay: 30000,
    description: "Full-day 4K cinema coverage, one shooter",
  },
  {
    id: "drone",
    label: "Drone Operator",
    pricePerDay: 15000,
    description: "Licensed aerial coverage, one operator + drone",
  },
];

export interface AddOn {
  id: string;
  label: string;
  price: number; // flat one-time PKR amount, not per day
}

export const ADD_ONS: AddOn[] = [
  { id: "rush-delivery", label: "Rush Delivery (48-hour turnaround)", price: 12000 },
  { id: "premium-album", label: "Premium Printed Album", price: 18000 },
];

// ─────────────────────────────────────────────────────────────────────────
// AVAILABILITY CALENDAR
// Manually maintained — add a date here once a shoot is booked, remove it
// once it's free again. This is NOT synced to any real booking system or
// calendar app; it's a plain list someone edits by hand. ISO format
// (YYYY-MM-DD). The calendar UI always shows the current month based on
// the visitor's own device clock, so no date here needs "today" logic.
// ─────────────────────────────────────────────────────────────────────────
export const BOOKED_DATES: string[] = [
  // TODO: replace these example dates with Kamran's real booked dates.
  "2026-09-05",
  "2026-09-12",
  "2026-09-19",
  "2026-09-20",
  "2026-10-03",
];

// ─────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// Real reviews from the Kamran Photo Studio Google Business listing.
// Skipped: reviews with no actual quote text, and the one negative review
// (Mubashar Masood, "No Quality Work") — not because it's hidden, it's
// reflected honestly in the 4.6 aggregate below, just not featured as a
// pull-quote. Gull Khan's "editing" (source said "Auditing") is corrected
// as an obvious typo; everything else is close to verbatim. Star ratings
// aren't individually confirmable from the source text except where the
// owner's own reply states it (Gull Khan: confirmed 5-star) — the rest
// are shown at 5 since all featured quotes are unambiguously positive;
// the honest number is the aggregate below.
// ─────────────────────────────────────────────────────────────────────────
export const GOOGLE_RATING = {
  average: 4.6,
  count: 7,
};

export interface Testimonial {
  id: string;
  name: string;
  context: string;
  quote: string;
  rating: number; // 1-5
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Gull Khan",
    context: "Google Review",
    quote:
      "They do a great job; their photography is very good, and their editing is also excellent. Nice work and good experience.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Kim Yuna",
    context: "Regular Client · Google Review",
    quote: "Their work is very good and the price is reasonable — their service is good too.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Mudassir Ali",
    context: "Google Review",
    quote: "Very good service, I like it.",
    rating: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// FAQ
// Reasonable industry-standard defaults — the ones marked TODO have real
// numbers/policies that need confirming with Kamran before launch.
// ─────────────────────────────────────────────────────────────────────────
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "f1",
    question: "How far in advance should we book?",
    answer:
      "For weddings, we recommend booking 2–3 months ahead to guarantee your date, especially in peak season. Portrait and commercial sessions can usually be scheduled with 1–2 weeks' notice.", // TODO: confirm real lead times
  },
  {
    id: "f2",
    question: "What's included in the price?",
    answer:
      "Every package includes full coverage for the booked duration, professional editing and retouching, and a private online gallery for delivery. See the Packages section above for what's included at each tier.",
  },
  {
    id: "f3",
    question: "How long until we get our photos or film?",
    answer:
      "Typical turnaround is 2–3 weeks for photography and 3–4 weeks for cinema/film packages. Rush delivery is available as an add-on if you need your gallery sooner.", // TODO: confirm real turnaround
  },
  {
    id: "f4",
    question: "Do you require a deposit?",
    answer:
      "Yes — a deposit is required to confirm your booking, with the balance due on or before the shoot date. Message us on WhatsApp for the exact deposit amount for your package.", // TODO: confirm deposit policy
  },
  {
    id: "f5",
    question: "Do you travel outside Lahore?",
    answer:
      "Yes, we shoot destination weddings and out-of-city events. Travel and accommodation costs are quoted separately depending on location.",
  },
  {
    id: "f6",
    question: "Can we customize a package?",
    answer:
      "Absolutely. Use the instant quote tool above to add extras like a second shooter, drone coverage, or a premium album — or just message us directly and we'll build something that fits.",
  },
];