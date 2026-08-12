import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCEPTED_IMAGE_TYPES, uploadProductImage } from "@/lib/image-upload";

/** Image URL field with a validated, auto-optimising upload button. */
export function ImageUploadField({
  id,
  slug,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  slug: string;
  value: string;
  placeholder?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadProductImage(slug, file);
      onChange(url);
      toast.success("Image uploaded", { description: "Optimised 400 / 800 / 1600px versions created." });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor={id}>Main image</Label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder={placeholder ?? "https://… or upload"}
          onChange={(e) => onChange(e.target.value)}
          className="h-11"
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 shrink-0"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        JPG, PNG, WEBP or AVIF up to 8 MB. Uploads are converted to WEBP at 400, 800 and 1600px.
      </p>
    </div>
  );
}
