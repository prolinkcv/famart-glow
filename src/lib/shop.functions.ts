import { createServerFn } from "@tanstack/react-start";
import type { ProductOverride } from "@/lib/shop";

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
