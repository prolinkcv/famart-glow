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
  /** Products hidden from the public shop are still manageable in the admin. */
  hidden?: boolean;
}

/** Editable product shape used by the admin panel and server writes. */
export interface ProductInput {
  slug: string;
  name: string;
  brand: string;
  category: string;
  short: string;
  overview: string;
  uses: string[];
  howToUse: string[];
  ingredients: string[];
  skinTypes: string[];
  precautions: string[];
  concerns: string[];
  priceKsh: number;
  size: string | null;
  inStock: boolean;
  rating: number | null;
  reviewCount: number;
  featured: boolean;
  images: string[];
  seoTitle: string;
  seoDescription: string;
  relatedService: string | null;
  hidden: boolean;
}

export const skinTypeOptions: SkinType[] = [
  "Oily skin",
  "Dry skin",
  "Combination skin",
  "Sensitive skin",
  "All skin types",
];

/** Fallback image for products that have no image uploaded yet. */
export const PLACEHOLDER_IMAGE = "/images/shop/detail-packaging.jpg";

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

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Distinct categories present in a product list. */
export const uniqueCategories = (products: Product[]) =>
  Array.from(new Set(products.map((p) => p.category)));

/** SEO copy for a category page, generated from the category name. */
export const categoryCopyFor = (category: string) => ({
  title: `${category} in Nairobi | Famart Healthcare Skincare Shop`,
  description: `Shop ${category.toLowerCase()} in Nairobi from Famart Healthcare Medical and Skin Clinic. Dermatology-led product guidance with easy WhatsApp ordering, delivery or clinic pickup.`,
  intro: `Browse the ${category.toLowerCase()} stocked at our Nairobi dermatology clinic. Every product is chosen by our clinical team, and you can order on WhatsApp for delivery or pickup.`,
});

/** A fresh, empty product for the admin "Add product" form. */
export function blankProduct(categories: string[] = []): ProductInput {
  return {
    slug: "",
    name: "",
    brand: "Famart Derma",
    category: categories[0] ?? "Cleansers",
    short: "",
    overview: "",
    uses: [],
    howToUse: [],
    ingredients: [],
    skinTypes: ["All skin types"],
    precautions: [
      "For external use only. Avoid contact with the eyes.",
      "Discontinue use and speak to a clinician if irritation occurs.",
    ],
    concerns: [],
    priceKsh: 0,
    size: null,
    inStock: true,
    rating: null,
    reviewCount: 0,
    featured: false,
    images: [],
    seoTitle: "",
    seoDescription: "",
    relatedService: null,
    hidden: false,
  };
}

/**
 * Builds a responsive srcset for images uploaded through the admin panel.
 * Uploaded files are stored as `…-w800.webp` with 400 / 800 / 1600 variants.
 */
export function uploadedSrcSet(url: string | undefined): string | undefined {
  if (!url || !/-w800\.webp$/.test(url)) return undefined;
  return [
    `${url.replace(/-w800\.webp$/, "-w400.webp")} 400w`,
    `${url} 800w`,
    `${url.replace(/-w800\.webp$/, "-w1600.webp")} 1600w`,
  ].join(", ");
}
