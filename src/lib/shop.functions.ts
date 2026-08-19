import { createServerFn } from "@tanstack/react-start";
import type { Product, ProductInput } from "@/lib/shop";

/** Public: all visible products. */
export const getProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const { listProducts } = await import("@/lib/shop.server");
  return listProducts();
});

/** Public: one visible product by slug (used for server-rendered SEO). */
export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug ?? "") }))
  .handler(async ({ data }): Promise<Product | null> => {
    const { getProductBySlug: bySlug } = await import("@/lib/shop.server");
    return bySlug(data.slug);
  });

/* ------------------------------ Auth ------------------------------ */

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

/* ---------------------------- Products ---------------------------- */

/** Admin: all products, including hidden. */
export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin, adminListProducts } = await import("@/lib/shop.server");
  await requireAdmin();
  return adminListProducts();
});

/** Admin: create or update a product. */
export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: ProductInput) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, writeProduct } = await import("@/lib/shop.server");
    const { slugify } = await import("@/lib/shop");
    await requireAdmin();
    const slug = slugify(data.slug || data.name);
    if (!slug) throw new Error("A product name is required");
    if (!data.name.trim()) throw new Error("A product name is required");
    if (!data.category.trim()) throw new Error("A category is required");
    if (!Number.isFinite(data.priceKsh) || data.priceKsh < 0) throw new Error("Invalid price");
    await writeProduct({ ...data, slug });
    return { ok: true as const, slug };
  });

/** Admin: delete a product (and its stored images). */
export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { requireAdmin, deleteProduct } = await import("@/lib/shop.server");
    await requireAdmin();
    await deleteProduct(data.slug);
    return { ok: true as const };
  });

/* ---------------------------- Images ------------------------------ */

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

/** Deletes a previously uploaded image (and its 400/800/1600 variants). */
export const adminDeleteImage = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => ({ url: String(data.url ?? "") }))
  .handler(async ({ data }) => {
    const { requireAdmin, deleteStoredImage } = await import("@/lib/shop.server");
    await requireAdmin();
    await deleteStoredImage(data.url);
    return { ok: true as const };
  });
