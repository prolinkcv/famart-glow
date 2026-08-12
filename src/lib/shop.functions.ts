import { createServerFn } from "@tanstack/react-start";
import type { CustomProduct, ProductOverride } from "@/lib/shop";

/** Public: product settings (price, stock, image, SEO, sample rating) set in the admin panel. */
export const getProductOverrides = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProductOverride[]> => {
    const { readOverrides } = await import("@/lib/shop.server");
    return readOverrides();
  },
);

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin } = await import("@/lib/shop.server");
  return { signedIn: await isAdmin() };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => ({
    username: String(data.username ?? "").slice(0, 100),
    password: String(data.password ?? "").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const { credentialsValid, sessionConfig } = await import("@/lib/shop.server");
    const { useSession } = await import("@tanstack/react-start/server");
    if (!credentialsValid(data.username, data.password)) return { ok: false as const };
    const session = await useSession<{ admin?: boolean }>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { sessionConfig } = await import("@/lib/shop.server");
  const { useSession } = await import("@tanstack/react-start/server");
  const session = await useSession<{ admin?: boolean }>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminListOverrides = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin, readOverrides } = await import("@/lib/shop.server");
  await requireAdmin();
  return readOverrides();
});

export const adminSaveOverride = createServerFn({ method: "POST" })
  .inputValidator((data: ProductOverride) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, writeOverride } = await import("@/lib/shop.server");
    await requireAdmin();
    await writeOverride(data);
    return { ok: true as const };
  });

export const adminResetOverride = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { requireAdmin, clearOverride } = await import("@/lib/shop.server");
    await requireAdmin();
    await clearOverride(data.slug);
    return { ok: true as const };
  });

/* ---------------- Admin-created products ---------------- */

/** Public: products created in the admin panel. */
export const getCustomProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<CustomProduct[]> => {
    const { readCustomProducts } = await import("@/lib/shop.server");
    return readCustomProducts();
  },
);

export const adminListCustom = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin, readAllCustomProducts } = await import("@/lib/shop.server");
  await requireAdmin();
  return readAllCustomProducts();
});

export const adminSaveCustom = createServerFn({ method: "POST" })
  .inputValidator((data: CustomProduct) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, writeCustomProduct } = await import("@/lib/shop.server");
    const { slugify } = await import("@/lib/shop");
    await requireAdmin();
    const slug = slugify(data.slug || data.name);
    if (!slug) throw new Error("A product name is required");
    if (!data.name.trim()) throw new Error("A product name is required");
    if (!data.category.trim()) throw new Error("A category is required");
    if (!Number.isFinite(data.priceKsh) || data.priceKsh < 0) throw new Error("Invalid price");
    await writeCustomProduct({ ...data, slug });
    return { ok: true as const, slug };
  });

export const adminDeleteCustom = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { requireAdmin, deleteCustomProduct } = await import("@/lib/shop.server");
    await requireAdmin();
    await deleteCustomProduct(data.slug);
    return { ok: true as const };
  });

/** Uploads one already-resized image variant (base64, no data-URL prefix). */
export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string; base64: string; contentType: string }) => ({
    path: String(data.path),
    base64: String(data.base64),
    contentType: String(data.contentType),
  }))
  .handler(async ({ data }) => {
    const { requireAdmin, storeProductImage } = await import("@/lib/shop.server");
    await requireAdmin();
    const url = await storeProductImage(data.path, data.base64, data.contentType);
    return { url };
  });

/** Bulk import: catalogue slugs update overrides, unknown slugs create/update admin products. */
export const adminBulkImport = createServerFn({ method: "POST" })
  .inputValidator((data: { rows: Record<string, string>[] }) => ({ rows: data.rows ?? [] }))
  .handler(async ({ data }) => {
    const { requireAdmin, writeOverride, writeCustomProduct, readAllCustomProducts } = await import(
      "@/lib/shop.server"
    );
    const { products, emptyOverride, emptyCustomProduct, slugify } = await import("@/lib/shop");
    await requireAdmin();

    const catalogue = new Set(products.map((p) => p.slug));
    const existing = new Map((await readAllCustomProducts()).map((c) => [c.slug, c]));

    const num = (v: string | undefined) =>
      v === undefined || v.trim() === "" ? null : Number(v);
    const bool = (v: string | undefined) => {
      if (v === undefined || v.trim() === "") return null;
      return /^(true|yes|1|in stock|instock)$/i.test(v.trim());
    };
    const list = (v: string | undefined) =>
      (v ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

    let updated = 0;
    let created = 0;
    const errors: string[] = [];

    for (const row of data.rows) {
      const slug = slugify(row["slug"] || row["name"] || "");
      if (!slug) continue;
      try {
        if (catalogue.has(slug)) {
          await writeOverride({
            ...emptyOverride(slug),
            priceKsh: num(row["price_ksh"]),
            inStock: bool(row["in_stock"]),
            imageUrl: row["image_url"]?.trim() || null,
            seoTitle: row["seo_title"]?.trim() || null,
            seoDescription: row["seo_description"]?.trim() || null,
            rating: num(row["rating"]),
            reviewCount: num(row["review_count"]),
            hidden: bool(row["hidden"]) === true,
          });
          updated += 1;
        } else {
          const base = existing.get(slug) ?? { ...emptyCustomProduct(), slug };
          const next = {
            ...base,
            slug,
            name: row["name"]?.trim() || base.name || slug,
            brand: row["brand"]?.trim() || base.brand,
            category: row["category"]?.trim() || base.category,
            short: row["short"]?.trim() || base.short,
            overview: row["overview"]?.trim() || base.overview,
            uses: row["uses"] ? list(row["uses"]) : base.uses,
            howToUse: row["how_to_use"] ? list(row["how_to_use"]) : base.howToUse,
            ingredients: row["ingredients"] ? list(row["ingredients"]) : base.ingredients,
            concerns: row["concerns"] ? list(row["concerns"]) : base.concerns,
            priceKsh: num(row["price_ksh"]) ?? base.priceKsh,
            size: row["size"]?.trim() || base.size,
            inStock: bool(row["in_stock"]) ?? base.inStock,
            rating: row["rating"] !== undefined ? num(row["rating"]) : base.rating,
            reviewCount: num(row["review_count"]) ?? base.reviewCount,
            images: row["image_url"]?.trim() ? [row["image_url"].trim()] : base.images,
            seoTitle: row["seo_title"]?.trim() || base.seoTitle,
            seoDescription: row["seo_description"]?.trim() || base.seoDescription,
            hidden: bool(row["hidden"]) ?? base.hidden,
          };
          await writeCustomProduct(next);
          if (existing.has(slug)) updated += 1;
          else created += 1;
        }
      } catch (e) {
        errors.push(`${slug}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    return { updated, created, errors };
  });
