import foamingCleanser from "@/assets/shop/foaming-cleanser.jpg";
import creamCleanser from "@/assets/shop/cream-cleanser.jpg";
import moisturisingCream from "@/assets/shop/moisturising-cream.jpg";
import barrierLotion from "@/assets/shop/barrier-lotion.jpg";
import sunscreenSpf50 from "@/assets/shop/sunscreen-spf50.jpg";
import tintedSunscreen from "@/assets/shop/tinted-sunscreen.jpg";
import acneGel from "@/assets/shop/acne-gel.jpg";
import salicylicWash from "@/assets/shop/salicylic-wash.jpg";
import vitaminCSerum from "@/assets/shop/vitamin-c-serum.jpg";
import niacinamideSerum from "@/assets/shop/niacinamide-serum.jpg";
import bodyLotion from "@/assets/shop/body-lotion.jpg";
import antiDandruffShampoo from "@/assets/shop/anti-dandruff-shampoo.jpg";
import detailTexture from "@/assets/shop/detail-texture.jpg";
import detailPackaging from "@/assets/shop/detail-packaging.jpg";

export type SkinType =
  | "Oily skin"
  | "Dry skin"
  | "Combination skin"
  | "Sensitive skin"
  | "All skin types";

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  /** Short card description. */
  short: string;
  /** Longer overview shown on the product page. */
  overview: string;
  /** Cosmetic uses / benefits — no medical claims. */
  uses: string[];
  /** Usage instructions as supplied by the clinic. */
  howToUse: string[];
  /** Key ingredients, where provided. Empty when not confirmed. */
  ingredients: string[];
  skinTypes: SkinType[];
  precautions: string[];
  /** Free-text tags used by search (skin concerns, product type). */
  concerns: string[];
  priceKsh: number;
  size?: string;
  inStock: boolean;
  /**
   * Placeholder demonstration rating. `ratingSource: "demo"` means the value is
   * a sample and must never be presented as a verified customer rating, nor
   * emitted in structured data.
   */
  rating: number | null;
  reviewCount: number;
  ratingSource: "demo" | "verified";
  featured: boolean;
  /** Newest first ordering weight (higher = newer). */
  addedOrder: number;
  images: string[];
  seoTitle: string;
  seoDescription: string;
  /** Related clinic service slug for internal linking. */
  relatedService?: string;
}

const gallery = (main: string) => [main, detailTexture, detailPackaging];

export const products: Product[] = [
  {
    slug: "gentle-foaming-facial-cleanser",
    name: "Gentle Foaming Facial Cleanser",
    brand: "Famart Derma",
    category: "Cleansers",
    short: "A soap-free daily foaming wash for face and neck.",
    overview:
      "A gentle, soap-free foaming cleanser formulated for everyday use on the face and neck. It removes excess oil, sunscreen and everyday grime while leaving the skin comfortable rather than tight.",
    uses: [
      "Daily cleansing of face and neck",
      "Removes excess surface oil and sunscreen residue",
      "Leaves skin feeling comfortable, not stripped",
    ],
    howToUse: [
      "Wet the face with lukewarm water.",
      "Apply a small amount and massage gently for 20–30 seconds.",
      "Rinse thoroughly and pat dry. Use morning and evening.",
    ],
    ingredients: [],
    skinTypes: ["Oily skin", "Combination skin", "All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Discontinue use and speak to a clinician if irritation occurs.",
    ],
    concerns: ["cleansing", "oily", "daily care", "face wash"],
    priceKsh: 1800,
    size: "200 ml",
    inStock: true,
    rating: 4.7,
    reviewCount: 12,
    ratingSource: "demo",
    featured: true,
    addedOrder: 12,
    images: gallery(foamingCleanser),
    seoTitle: "Gentle Foaming Facial Cleanser in Nairobi | Famart Healthcare",
    seoDescription:
      "Buy a gentle soap-free foaming facial cleanser in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.",
    relatedService: "skin-consultation",
  },
  {
    slug: "hydrating-cream-cleanser",
    name: "Hydrating Cream Cleanser",
    brand: "Famart Derma",
    category: "Cleansers",
    short: "A creamy, non-foaming cleanser for dry and sensitive skin.",
    overview:
      "A rich, non-foaming cream cleanser designed for skin that feels dry or reactive after washing. It cleanses gently and helps the skin retain its natural moisture.",
    uses: [
      "Gentle cleansing for dry or easily irritated skin",
      "Helps avoid the tight feeling that follows harsh washing",
      "Suitable for use morning and evening",
    ],
    howToUse: [
      "Apply to damp skin and massage lightly.",
      "Rinse with lukewarm water or remove with a soft cloth.",
      "Follow with a moisturiser.",
    ],
    ingredients: [],
    skinTypes: ["Dry skin", "Sensitive skin"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Patch test if your skin is highly reactive.",
    ],
    concerns: ["dryness", "sensitive", "cleansing", "eczema-prone"],
    priceKsh: 1950,
    size: "150 ml",
    inStock: true,
    rating: 4.6,
    reviewCount: 8,
    ratingSource: "demo",
    featured: false,
    addedOrder: 11,
    images: gallery(creamCleanser),
    seoTitle: "Hydrating Cream Cleanser for Dry Skin in Nairobi | Famart Healthcare",
    seoDescription:
      "A gentle cream cleanser for dry and sensitive skin, available from Famart Healthcare Medical and Skin Clinic in Nairobi. Order via WhatsApp.",
    relatedService: "eczema-management",
  },
  {
    slug: "daily-moisturising-face-cream",
    name: "Daily Moisturising Face Cream",
    brand: "Famart Derma",
    category: "Moisturizers",
    short: "A lightweight everyday face cream for lasting comfort.",
    overview:
      "A lightweight daily face cream that absorbs quickly and helps keep skin feeling hydrated and comfortable throughout the day. Suitable under sunscreen and make-up.",
    uses: [
      "Everyday facial hydration",
      "Helps relieve the feeling of dryness and tightness",
      "Comfortable base under sunscreen",
    ],
    howToUse: [
      "Apply a pea-sized amount to clean skin.",
      "Smooth over face and neck morning and evening.",
    ],
    ingredients: [],
    skinTypes: ["All skin types"],
    precautions: ["For external use only. Avoid contact with the eyes."],
    concerns: ["dryness", "hydration", "moisturiser", "daily care"],
    priceKsh: 2400,
    size: "50 ml",
    inStock: true,
    rating: 4.8,
    reviewCount: 15,
    ratingSource: "demo",
    featured: true,
    addedOrder: 10,
    images: gallery(moisturisingCream),
    seoTitle: "Daily Moisturising Face Cream in Nairobi | Famart Healthcare",
    seoDescription:
      "Shop a lightweight daily moisturising face cream in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.",
    relatedService: "skin-consultation",
  },
  {
    slug: "barrier-repair-lotion",
    name: "Barrier Repair Lotion",
    brand: "Famart Derma",
    category: "Moisturizers",
    short: "A rich lotion for very dry, rough or flaky skin.",
    overview:
      "A richer lotion for skin that stays dry, rough or flaky. Designed for daily use on the face and body where extra moisture is needed.",
    uses: [
      "Intensive daily moisturising for very dry skin",
      "Softens rough or flaky areas",
      "Suitable for face and body",
    ],
    howToUse: [
      "Apply generously to clean, dry skin.",
      "Use at least once daily, ideally after bathing.",
    ],
    ingredients: [],
    skinTypes: ["Dry skin", "Sensitive skin"],
    precautions: [
      "For external use only.",
      "If your skin is broken or inflamed, seek clinical advice before use.",
    ],
    concerns: ["dryness", "eczema-prone", "body", "moisturiser"],
    priceKsh: 2600,
    size: "250 ml",
    inStock: true,
    rating: 4.5,
    reviewCount: 6,
    ratingSource: "demo",
    featured: false,
    addedOrder: 9,
    images: gallery(barrierLotion),
    seoTitle: "Barrier Repair Lotion for Dry Skin in Nairobi | Famart Healthcare",
    seoDescription:
      "Buy a rich barrier repair lotion for very dry skin in Nairobi from Famart Healthcare Medical and Skin Clinic. WhatsApp ordering available.",
    relatedService: "eczema-management",
  },
  {
    slug: "broad-spectrum-sunscreen-spf-50",
    name: "Broad Spectrum Sunscreen SPF 50",
    brand: "Famart Derma",
    category: "Sunscreens",
    short: "Daily high-protection sunscreen with a non-greasy finish.",
    overview:
      "A broad spectrum SPF 50 sunscreen for daily use. It applies evenly, absorbs without a heavy feel and is suitable for use under make-up.",
    uses: [
      "Daily sun protection for the face and neck",
      "Helps protect skin from the effects of sun exposure",
      "Part of an everyday pigmentation-care routine",
    ],
    howToUse: [
      "Apply generously to exposed skin 15 minutes before going outdoors.",
      "Reapply every two hours, and after sweating or towel drying.",
    ],
    ingredients: [],
    skinTypes: ["All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Sunscreen is one part of sun protection — also seek shade and cover up.",
    ],
    concerns: ["sun protection", "pigmentation", "spf", "sunscreen"],
    priceKsh: 2800,
    size: "60 ml",
    inStock: true,
    rating: 4.9,
    reviewCount: 21,
    ratingSource: "demo",
    featured: true,
    addedOrder: 8,
    images: gallery(sunscreenSpf50),
    seoTitle: "Broad Spectrum Sunscreen SPF 50 in Nairobi | Famart Healthcare",
    seoDescription:
      "Shop broad spectrum SPF 50 sunscreen in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.",
    relatedService: "pigmentation-disorders",
  },
  {
    slug: "tinted-mineral-sunscreen-spf-30",
    name: "Tinted Mineral Sunscreen SPF 30",
    brand: "Famart Derma",
    category: "Sunscreens",
    short: "A lightly tinted mineral sunscreen for sensitive skin.",
    overview:
      "A mineral-based tinted sunscreen with a soft, natural finish. Formulated for people who prefer a mineral filter or find other sunscreens leave a white cast.",
    uses: [
      "Daily sun protection with a light tint",
      "An option for skin that reacts to other sunscreens",
    ],
    howToUse: [
      "Apply evenly to the face before sun exposure.",
      "Reapply every two hours when outdoors.",
    ],
    ingredients: [],
    skinTypes: ["Sensitive skin", "All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Patch test before first full use if your skin is reactive.",
    ],
    concerns: ["sun protection", "sensitive", "tinted", "sunscreen", "mineral"],
    priceKsh: 3000,
    size: "40 ml",
    inStock: false,
    rating: null,
    reviewCount: 0,
    ratingSource: "demo",
    featured: false,
    addedOrder: 7,
    images: gallery(tintedSunscreen),
    seoTitle: "Tinted Mineral Sunscreen SPF 30 in Nairobi | Famart Healthcare",
    seoDescription:
      "Tinted mineral SPF 30 sunscreen for sensitive skin, from Famart Healthcare Medical and Skin Clinic in Nairobi. Ask about availability on WhatsApp.",
    relatedService: "skin-allergy-treatment",
  },
  {
    slug: "acne-control-gel",
    name: "Acne Control Gel",
    brand: "Famart Derma",
    category: "Acne Care",
    short: "A targeted leave-on gel for blemish-prone areas.",
    overview:
      "A lightweight leave-on gel for use on blemish-prone areas as part of an acne-care routine. Best used alongside professional guidance from the clinic.",
    uses: [
      "Targeted care for blemish-prone areas",
      "Fits into a daily acne-care routine",
    ],
    howToUse: [
      "Cleanse and dry the skin first.",
      "Apply a thin layer to affected areas once daily, increasing as tolerated.",
      "Use sunscreen during the day.",
    ],
    ingredients: [],
    skinTypes: ["Oily skin", "Combination skin"],
    precautions: [
      "For external use only. Avoid the eyes, lips and broken skin.",
      "May cause dryness — reduce frequency if irritation develops.",
      "Speak to our clinicians before combining with prescribed acne treatment.",
    ],
    concerns: ["acne", "breakouts", "blemishes", "oily", "spots"],
    priceKsh: 2200,
    size: "30 ml",
    inStock: true,
    rating: 4.6,
    reviewCount: 18,
    ratingSource: "demo",
    featured: true,
    addedOrder: 6,
    images: gallery(acneGel),
    seoTitle: "Acne Control Gel in Nairobi | Famart Healthcare",
    seoDescription:
      "Buy acne care products in Nairobi from Famart Healthcare Medical and Skin Clinic. Professional skincare guidance and WhatsApp ordering.",
    relatedService: "acne-treatment",
  },
  {
    slug: "salicylic-acid-face-wash",
    name: "Salicylic Acid Face Wash",
    brand: "Famart Derma",
    category: "Acne Care",
    short: "A clarifying daily wash for oily, blemish-prone skin.",
    overview:
      "A clarifying face wash for oily and blemish-prone skin. Cleanses away excess oil and everyday build-up as part of a consistent acne-care routine.",
    uses: [
      "Daily cleansing for oily, blemish-prone skin",
      "Helps manage the feeling of excess surface oil",
    ],
    howToUse: [
      "Massage onto damp skin and rinse thoroughly.",
      "Start once daily and build up as tolerated.",
    ],
    ingredients: ["Salicylic acid"],
    skinTypes: ["Oily skin", "Combination skin"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Can be drying — reduce use if the skin becomes irritated.",
      "Use sun protection during the day.",
    ],
    concerns: ["acne", "oily", "blackheads", "face wash", "breakouts"],
    priceKsh: 1700,
    size: "150 ml",
    inStock: true,
    rating: 4.4,
    reviewCount: 9,
    ratingSource: "demo",
    featured: false,
    addedOrder: 5,
    images: gallery(salicylicWash),
    seoTitle: "Salicylic Acid Face Wash for Acne in Nairobi | Famart Healthcare",
    seoDescription:
      "Shop acne skincare in Nairobi — salicylic acid face wash from Famart Healthcare Medical and Skin Clinic. Order through WhatsApp.",
    relatedService: "acne-treatment",
  },
  {
    slug: "vitamin-c-brightening-serum",
    name: "Vitamin C Brightening Serum",
    brand: "Famart Derma",
    category: "Serums",
    short: "A daily antioxidant serum for a more even-looking tone.",
    overview:
      "A lightweight vitamin C serum used in the morning as part of a routine focused on the appearance of an even skin tone. Pair with daily sunscreen.",
    uses: [
      "Cosmetic care for the look of uneven tone and dull skin",
      "Morning antioxidant step before sunscreen",
    ],
    howToUse: [
      "Apply 3–4 drops to clean, dry skin in the morning.",
      "Follow with moisturiser and sunscreen.",
    ],
    ingredients: ["Vitamin C (ascorbic acid derivative)"],
    skinTypes: ["All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Introduce gradually if your skin is sensitive.",
    ],
    concerns: ["pigmentation", "dark spots", "dullness", "serum", "brightening"],
    priceKsh: 3500,
    size: "30 ml",
    inStock: true,
    rating: 4.8,
    reviewCount: 14,
    ratingSource: "demo",
    featured: true,
    addedOrder: 4,
    images: gallery(vitaminCSerum),
    seoTitle: "Vitamin C Brightening Serum in Nairobi | Famart Healthcare",
    seoDescription:
      "Buy a vitamin C serum in Nairobi from Famart Healthcare Medical and Skin Clinic. Dermatology-led skincare with WhatsApp ordering.",
    relatedService: "pigmentation-disorders",
  },
  {
    slug: "niacinamide-balancing-serum",
    name: "Niacinamide Balancing Serum",
    brand: "Famart Derma",
    category: "Serums",
    short: "A light serum for shine-prone, congested-looking skin.",
    overview:
      "A light, fast-absorbing niacinamide serum for skin that looks shiny or congested through the day. Layers easily under moisturiser.",
    uses: [
      "Cosmetic care for the look of visible pores and shine",
      "Everyday step for combination and oily skin",
    ],
    howToUse: [
      "Apply a few drops to clean skin morning and/or evening.",
      "Follow with moisturiser.",
    ],
    ingredients: ["Niacinamide"],
    skinTypes: ["Oily skin", "Combination skin", "All skin types"],
    precautions: ["For external use only. Avoid contact with the eyes."],
    concerns: ["oily", "pores", "shine", "serum", "texture"],
    priceKsh: 2900,
    size: "30 ml",
    inStock: true,
    rating: 4.5,
    reviewCount: 7,
    ratingSource: "demo",
    featured: false,
    addedOrder: 3,
    images: gallery(niacinamideSerum),
    seoTitle: "Niacinamide Serum in Nairobi | Famart Healthcare",
    seoDescription:
      "Shop niacinamide serum in Nairobi from Famart Healthcare Medical and Skin Clinic. Skincare guidance from a dermatology clinic, ordered via WhatsApp.",
    relatedService: "cosmetic-skin-care",
  },
  {
    slug: "urea-body-lotion",
    name: "Urea Body Lotion",
    brand: "Famart Derma",
    category: "Body Care",
    short: "A softening body lotion for rough, dry areas.",
    overview:
      "A body lotion for rough, dry areas such as elbows, knees and lower legs. Absorbs without a heavy residue so it can be used daily.",
    uses: [
      "Daily body moisturising",
      "Softens rough patches on elbows, knees and legs",
    ],
    howToUse: ["Apply to clean, dry skin once or twice daily, ideally after bathing."],
    ingredients: ["Urea"],
    skinTypes: ["Dry skin", "All skin types"],
    precautions: [
      "For external use only.",
      "Avoid broken or freshly shaved skin.",
    ],
    concerns: ["dryness", "body", "rough skin", "lotion"],
    priceKsh: 2100,
    size: "400 ml",
    inStock: true,
    rating: 4.6,
    reviewCount: 5,
    ratingSource: "demo",
    featured: false,
    addedOrder: 2,
    images: gallery(bodyLotion),
    seoTitle: "Urea Body Lotion for Dry Skin in Nairobi | Famart Healthcare",
    seoDescription:
      "Buy urea body lotion for dry, rough skin in Nairobi from Famart Healthcare Medical and Skin Clinic. Order conveniently through WhatsApp.",
    relatedService: "general-dermatology",
  },
  {
    slug: "anti-dandruff-shampoo",
    name: "Anti-Dandruff Shampoo",
    brand: "Famart Derma",
    category: "Hair & Scalp Care",
    short: "A cleansing shampoo for flaky, itchy-feeling scalps.",
    overview:
      "A cleansing shampoo for scalps that feel flaky or itchy. Used regularly as part of a scalp-care routine, with clinical review where symptoms persist.",
    uses: [
      "Regular cleansing for a flake-prone scalp",
      "Part of an ongoing scalp-care routine",
    ],
    howToUse: [
      "Massage into a wet scalp and leave for 2–3 minutes.",
      "Rinse thoroughly. Use two to three times a week.",
    ],
    ingredients: [],
    skinTypes: ["All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "If the scalp remains irritated, book a consultation with our clinicians.",
    ],
    concerns: ["dandruff", "scalp", "itchy scalp", "hair", "shampoo"],
    priceKsh: 1900,
    size: "200 ml",
    inStock: true,
    rating: 4.3,
    reviewCount: 4,
    ratingSource: "demo",
    featured: false,
    addedOrder: 1,
    images: gallery(antiDandruffShampoo),
    seoTitle: "Anti-Dandruff Shampoo in Nairobi | Famart Healthcare",
    seoDescription:
      "Shop scalp care in Nairobi — anti-dandruff shampoo from Famart Healthcare Medical and Skin Clinic. Order through WhatsApp.",
    relatedService: "hair-scalp-conditions",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Categories that actually have at least one product assigned. */
export const shopCategories = Array.from(new Set(products.map((p) => p.category)));

export const skinTypeOptions: SkinType[] = [
  "Oily skin",
  "Dry skin",
  "Combination skin",
  "Sensitive skin",
  "All skin types",
];

export const formatKsh = (amount: number) =>
  `KSh ${amount.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export const SHOP_DISCLAIMER =
  "Product information is provided for general information. Follow the manufacturer's instructions and seek professional medical advice where appropriate.";

export interface OrderLine {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderCustomer {
  name?: string | undefined;
  phone?: string | undefined;
  fulfilment?: "Delivery" | "Pickup From Clinic" | undefined;
  location?: string | undefined;
  notes?: string | undefined;
}

/** Builds the WhatsApp order message from the cart plus optional customer details. */
export const orderMessage = (lines: OrderLine[], customer: OrderCustomer = {}) => {
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  const items = lines.map(
    (l, i) =>
      [
        `${i + 1}. ${l.name}`,
        `   Quantity: ${l.quantity}`,
        `   Price: ${formatKsh(l.unitPrice)} each`,
        `   Subtotal: ${formatKsh(l.unitPrice * l.quantity)}`,
      ].join("\n"),
  );

  const details = [
    customer.name ? `Name: ${customer.name}` : "",
    customer.phone ? `Phone: ${customer.phone}` : "",
    customer.fulfilment ? `Preference: ${customer.fulfilment}` : "",
    customer.fulfilment === "Delivery" && customer.location
      ? `Delivery location: ${customer.location}`
      : "",
    customer.notes ? `Notes: ${customer.notes}` : "",
  ].filter(Boolean);

  return [
    "Hello Famart Healthcare,",
    "",
    "I would like to place an order for the following skincare products:",
    "",
    ...items,
    "",
    `Total: ${formatKsh(total)}`,
    ...(details.length ? ["", ...details] : []),
    "",
    "Please confirm availability and delivery/pickup options.",
    "Thank you.",
  ].join("\n");
};
