// ─────────────────────────────────────────────────────────────────────────
// SITE CONFIG
// ─────────────────────────────────────────────────────────────────────────
const ADDRESS = "Gajju Matta, Susa Kahna Nau, Lahore, Punjab 53100, Pakistan";

export const SITE = {
  name: "Kamran Photo Studio",
  whatsappNumber: "923084427401", // +92 308 4427401, digits only for wa.me
  email: "kamran.mubarikali@gmail.com",
  phoneDisplay: "+92 308 4427401",
  address: ADDRESS,
  mapsEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`,
  tagline:
    "We are offering unmatched rates of photography and videography with the best quality for our valued clients.",
  instagram: "https://instagram.com/kamranphotostudio", // TODO: replace with real handle
  youtube: "https://youtube.com/@kamranphotostudio", // TODO: replace with real handle
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ─────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Showreel", href: "/#showreel" },
  { label: "Packages", href: "/#packages" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/#team" },
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
      "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?q=72&w=900&auto=format&fit=crop",
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
};