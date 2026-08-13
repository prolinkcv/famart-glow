import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCEPTED_IMAGE_TYPES, uploadProductImage } from "@/lib/image-upload";

/** Gallery editor: upload or link several product images, reorder and remove them. */
export function ProductImagesField({
  slug,
  images,
  onChange,
}: {
  slug: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        try {
          added.push(await uploadProductImage(slug, file));
        } catch (e) {
          toast.error(`${file.name}: ${e instanceof Error ? e.message : "Upload failed"}`);
        }
      }
      if (added.length) {
        onChange([...images, ...added]);
        toast.success(`${added.length} image${added.length > 1 ? "s" : ""} uploaded`, {
          description: "Optimised 400 / 800 / 1600px versions created.",
        });
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const v = url.trim();
    if (!v) return;
    onChange([...images, v]);
    setUrl("");
  };

  const makeMain = (i: number) =>
    onChange([images[i]!, ...images.filter((_, idx) => idx !== i)]);
  const removeAt = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="sm:col-span-2">
      <Label>Product images</Label>

      {images.length > 0 && (
        <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="group relative overflow-hidden rounded-2xl border bg-surface">
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Main
                </span>
              )}
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                {i > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7"
                    title="Make main image"
                    onClick={() => makeMain(i)}
                  >
                    <Star className="size-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="ml-auto size-7"
                  title="Remove image"
                  onClick={() => removeAt(i)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {busy ? "Uploading…" : "Upload images"}
        </Button>
        <div className="flex min-w-[220px] flex-1 gap-2">
          <Input
            value={url}
            placeholder="…or paste an image URL"
            className="h-11"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <Button type="button" variant="outline" className="h-11 shrink-0" onClick={addUrl}>
            <Plus /> Add
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        Add images one by one or select several at once. JPG, PNG, WEBP or AVIF up to 8 MB each —
        converted to WEBP at 400, 800 and 1600px. The first image is used on product cards.
      </p>
    </div>
  );
}
