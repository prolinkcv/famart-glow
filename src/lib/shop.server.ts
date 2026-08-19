import { createHash, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { PLACEHOLDER_IMAGE, type Product, type ProductInput } from "@/lib/shop";

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

/* ------------------------------------------------------------------ */
/* Unified products — the single source of truth for the shop           */
/* ------------------------------------------------------------------ */

const PRODUCT_COLUMNS =
  "slug, name, brand, category, short, overview, uses, how_to_use, ingredients, " +
  "skin_types, precautions, concerns, price_ksh, size, in_stock, rating, review_count, " +
  "rating_source, featured, added_order, images, seo_title, seo_description, " +
  "related_service, hidden";

type ProductRow = Record<string, unknown>;

const asArray = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function toProduct(r: ProductRow): Product {
  const images = asArray(r["images"]);
  const skinTypes = asArray(r["skin_types"]);
  return {
    slug: String(r["slug"]),
    name: String(r["name"] ?? ""),
    brand: String(r["brand"] ?? "Famart Derma"),
    category: String(r["category"] ?? ""),
    short: String(r["short"] ?? ""),
    overview: String(r["overview"] ?? ""),
    uses: asArray(r["uses"]),
    howToUse: asArray(r["how_to_use"]),
    ingredients: asArray(r["ingredients"]),
    skinTypes: (skinTypes.length ? skinTypes : ["All skin types"]) as Product["skinTypes"],
    precautions: asArray(r["precautions"]),
    concerns: asArray(r["concerns"]),
    priceKsh: Number(r["price_ksh"] ?? 0),
    ...(r["size"] ? { size: String(r["size"]) } : {}),
    inStock: r["in_stock"] !== false,
    rating: r["rating"] === null || r["rating"] === undefined ? null : Number(r["rating"]),
    reviewCount: Number(r["review_count"] ?? 0),
    ratingSource: (r["rating_source"] as Product["ratingSource"]) ?? "demo",
    featured: r["featured"] === true,
    addedOrder: Number(r["added_order"] ?? 0),
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    seoTitle: String(r["seo_title"] ?? ""),
    seoDescription: String(r["seo_description"] ?? ""),
    ...(r["related_service"] ? { relatedService: String(r["related_service"]) } : {}),
    hidden: r["hidden"] === true,
  };
}

/** Public read: visible products only (RLS enforced as anon). */
export async function listProducts(): Promise<Product[]> {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("hidden", false)
    .order("featured", { ascending: false })
    .order("added_order", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(toProduct);
}

/** Public read: a single visible product by slug, for SEO/SSR. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .eq("hidden", false)
    .maybeSingle();
  if (error || !data) return null;
  return toProduct(data as unknown as ProductRow);
}

/** Admin read: all products including hidden. */
export async function adminListProducts(): Promise<Product[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("added_order", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(toProduct);
}

/** Admin read: a single product by slug, including hidden. */
export async function adminGetProduct(slug: string): Promise<Product | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toProduct(data as unknown as ProductRow);
}

/** Creates or updates a product. `slug` is the unique key. */
export async function writeProduct(input: ProductInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const existing = await adminGetProduct(input.slug);
  let addedOrder = existing?.addedOrder;
  if (addedOrder === undefined) {
    const { data } = await supabaseAdmin
      .from("products")
      .select("added_order")
      .order("added_order", { ascending: false })
      .limit(1);
    addedOrder = Number((data?.[0] as unknown as { added_order?: number } | undefined)?.added_order ?? 0) + 1;
  }

  const { error } = await supabaseAdmin.from("products").upsert(
    {
      slug: input.slug,
      name: input.name,
      brand: input.brand || "Famart Derma",
      category: input.category,
      short: input.short,
      overview: input.overview || input.short,
      uses: input.uses,
      how_to_use: input.howToUse,
      ingredients: input.ingredients,
      skin_types: input.skinTypes.length ? input.skinTypes : ["All skin types"],
      precautions: input.precautions,
      concerns: input.concerns,
      price_ksh: input.priceKsh,
      size: input.size,
      in_stock: input.inStock,
      rating: input.rating,
      review_count: input.reviewCount,
      rating_source: "demo",
      featured: input.featured,
      added_order: addedOrder,
      images: input.images,
      seo_title: input.seoTitle || `${input.name} in Nairobi | Famart Healthcare`,
      seo_description:
        input.seoDescription ||
        `Buy ${input.name} in Nairobi from Famart Healthcare Medical and Skin Clinic. Order easily through WhatsApp.`,
      related_service: input.relatedService,
      hidden: input.hidden,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}

/** Deletes a product and removes its stored images from the bucket. */
export async function deleteProduct(slug: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const existing = await adminGetProduct(slug);
  if (existing) {
    await Promise.all(existing.images.map((url) => deleteStoredImage(url)));
  }
  const { error } = await supabaseAdmin.from("products").delete().eq("slug", slug);
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

/** Removes the 400/800/1600 variants of a previously uploaded image. */
export async function deleteStoredImage(url: string) {
  if (!url.startsWith("/api/public/product-image/")) return;
  const path = url.replace("/api/public/product-image/", "");
  const variants = Array.from(
    new Set([
      path,
      path.replace(/-w800\.webp$/, "-w400.webp"),
      path.replace(/-w800\.webp$/, "-w1600.webp"),
    ]),
  );
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .remove(variants)
    .then(() => undefined)
    .catch(() => undefined);
}
