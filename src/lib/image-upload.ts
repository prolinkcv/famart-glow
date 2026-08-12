import { adminUploadImage } from "@/lib/shop.functions";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
/** Widths generated for every upload; the 800px variant is the stored URL. */
export const VARIANT_WIDTHS = [400, 800, 1600] as const;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, WEBP or AVIF image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "Image must be 8 MB or smaller.";
  return null;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = url;
  });
}

async function toWebpBase64(img: HTMLImageElement, width: number): Promise<string> {
  const scale = Math.min(1, width / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing is not supported in this browser.");
  ctx.drawImage(img, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/webp", 0.82);
  if (!dataUrl.startsWith("data:image/webp")) {
    throw new Error("This browser cannot create optimised WEBP images.");
  }
  return dataUrl.split(",")[1] ?? "";
}

/**
 * Validates, resizes and uploads a product image.
 * Returns the URL of the 800px variant (400 / 800 / 1600 are all stored).
 */
export async function uploadProductImage(slug: string, file: File): Promise<string> {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);

  const img = await loadImage(file);
  const stamp = Date.now();
  let mainUrl = "";

  for (const width of VARIANT_WIDTHS) {
    const base64 = await toWebpBase64(img, width);
    const { url } = await adminUploadImage({
      data: {
        path: `products/${slug || "product"}/${stamp}-w${width}.webp`,
        base64,
        contentType: "image/webp",
      },
    });
    if (width === 800) mainUrl = url;
  }

  return mainUrl;
}
