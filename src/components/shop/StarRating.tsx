import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  demo,
  className,
}: {
  rating: number | null;
  reviewCount: number;
  demo?: boolean;
  className?: string;
}) {
  if (rating === null) {
    return <p className={cn("text-xs text-muted-foreground", className)}>No ratings yet</p>;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span
        className="flex gap-0.5 text-brand-red"
        aria-label={`Rated ${rating} out of 5`}
        role="img"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn("size-3.5", i < Math.round(rating) ? "fill-current" : "opacity-30")}
          />
        ))}
      </span>
      <span className="text-xs font-semibold">{rating.toFixed(1)}/5</span>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
      {demo && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Sample
        </span>
      )}
    </div>
  );
}

export function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        inStock ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {inStock ? "✓ Stock Available" : "Out of Stock"}
    </span>
  );
}
