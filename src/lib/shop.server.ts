import { createHash, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { CustomProduct, ProductOverride } from "@/lib/shop";

export interface AdminSession {
  admin?: boolean;
}

export function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "famart-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export function credentialsValid(username: string, password: string) {
  const expectedUser = process.env["ADMIN_USERNAME"];
  const expectedPass = process.env["ADMIN_PASSWORD"];
  if (!expectedUser || !expectedPass) return false;
  return (
    matches(username.trim().toLowerCase(), expectedUser.trim().toLowerCase()) &&
    matches(password, expectedPass)
  );
}

export async function isAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  return session.data.admin === true;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorised");
}

/** Publishable-key client for public reads (RLS applies as anon). */
export function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLUMNS =
  "slug, price_ksh, in_stock, image_url, seo_title, seo_description, rating, review_count, hidden";

type Row = {
  slug: string;
  price_ksh: number | null;
  in_stock: boolean | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  rating: number | string | null;
  review_count: number | null;
  hidden: boolean | null;
};

function toOverride(r: Row): ProductOverride {
  return {
    slug: r.slug,
    priceKsh: r.price_ksh,
    inStock: r.in_stock,
    imageUrl: r.image_url,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
    rating: r.rating === null ? null : Number(r.rating),
    reviewCount: r.review_count,
    hidden: r.hidden ?? false,
  };
}

export async function readOverrides(): Promise<ProductOverride[]> {
  const { data, error } = await publicClient().from("product_overrides").select(COLUMNS);
  if (error || !data) return [];
  return (data as unknown as Row[]).map(toOverride);
}

export async function writeOverride(input: ProductOverride) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("product_overrides").upsert(
    {
      slug: input.slug,
      price_ksh: input.priceKsh,
      in_stock: input.inStock,
      image_url: input.imageUrl,
      seo_title: input.seoTitle,
      seo_description: input.seoDescription,
      rating: input.rating,
      review_count: input.reviewCount,
      hidden: input.hidden,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}

export async function clearOverride(slug: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("product_overrides").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Admin-created products                                              */
/* ------------------------------------------------------------------ */

const CUSTOM_COLUMNS =
  "slug, name, brand, category, short, overview, uses, how_to_use, ingredients, skin_types, precautions, concerns, price_ksh, size, in_stock, rating, review_count, featured, images, seo_title, seo_description, related_service, hidden";

type CustomRow = Record<string, unknown>;

function toCustom(r: CustomRow): CustomProduct {
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return {
    slug: String(r["slug"]),
    name: String(r["name"] ?? ""),
    brand: String(r["brand"] ?? "Famart Derma"),
    category: String(r["category"] ?? ""),
    short: String(r["short"] ?? ""),
    overview: String(r["overview"] ?? ""),
    uses: arr(r["uses"]),
    howToUse: arr(r["how_to_use"]),
    ingredients: arr(r["ingredients"]),
    skinTypes: arr(r["skin_types"]),
    precautions: arr(r["precautions"]),
    concerns: arr(r["concerns"]),
    priceKsh: Number(r["price_ksh"] ?? 0),
    size: (r["size"] as string | null) ?? null,
    inStock: r["in_stock"] !== false,
    rating: r["rating"] === null || r["rating"] === undefined ? null : Number(r["rating"]),
    reviewCount: Number(r["review_count"] ?? 0),
    featured: r["featured"] === true,
    images: arr(r["images"]),
    seoTitle: String(r["seo_title"] ?? ""),
    seoDescription: String(r["seo_description"] ?? ""),
    relatedService: (r["related_service"] as string | null) ?? null,
    hidden: r["hidden"] === true,
  };
}

/** Public read: visible admin-created products. */
export async function readCustomProducts(): Promise<CustomProduct[]> {
  const { data, error } = await publicClient()
    .from("custom_products")
    .select(CUSTOM_COLUMNS)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as CustomRow[]).map(toCustom);
}

/** Admin read: includes hidden products. */
export async function readAllCustomProducts(): Promise<CustomProduct[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("custom_products")
    .select(CUSTOM_COLUMNS)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as CustomRow[]).map(toCustom);
}

export async function writeCustomProduct(p: CustomProduct) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("custom_products").upsert(
    {
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      short: p.short,
      overview: p.overview,
      uses: p.uses,
      how_to_use: p.howToUse,
      ingredients: p.ingredients,
      skin_types: p.skinTypes,
      precautions: p.precautions,
      concerns: p.concerns,
      price_ksh: p.priceKsh,
      size: p.size,
      in_stock: p.inStock,
      rating: p.rating,
      review_count: p.reviewCount,
      featured: p.featured,
      images: p.images,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      related_service: p.relatedService,
      hidden: p.hidden,
      updated_at: new Date().toISOString(),
    } as never,
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}

export async function deleteCustomProduct(slug: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("custom_products").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Product image storage (private bucket, served through /api/public)   */
/* ------------------------------------------------------------------ */

export const IMAGE_BUCKET = "product-images";
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Stores one already-optimised variant and returns its public proxy URL. */
export async function storeProductImage(path: string, base64: string, contentType: string) {
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) throw new Error("Unsupported image type");
  const clean = path.replace(/[^a-zA-Z0-9/_.-]/g, "-").replace(/^\/+/, "");
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  if (binary.byteLength > 6 * 1024 * 1024) throw new Error("Image is too large");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .upload(clean, binary, { contentType, upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return `/api/public/product-image/${clean}`;
}

export async function fetchProductImage(path: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage.from(IMAGE_BUCKET).download(path);
  if (error || !data) return null;
  return data;
}
