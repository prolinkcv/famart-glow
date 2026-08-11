import { createHash, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { ProductOverride } from "@/lib/shop";

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
