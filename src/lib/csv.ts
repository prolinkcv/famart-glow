/** Minimal RFC-4180 style CSV helpers used by the shop admin bulk tools. */

export const CSV_COLUMNS = [
  "slug",
  "name",
  "brand",
  "category",
  "short",
  "price_ksh",
  "in_stock",
  "image_url",
  "seo_title",
  "seo_description",
  "rating",
  "review_count",
  "hidden",
  "size",
] as const;

const escape = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export function toCsv(rows: Record<string, string>[], columns: readonly string[] = CSV_COLUMNS) {
  const head = columns.join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c] ?? "")).join(","));
  return [head, ...body].join("\n");
}

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    if (row.some((c) => c.trim() !== "")) rows.push(row);
    row = [];
  };

  const input = text.replace(/\r\n?/g, "\n");
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") pushField();
    else if (ch === "\n") pushRow();
    else field += ch;
  }
  pushRow();

  const header = rows.shift();
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.map((r) =>
    Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])) as Record<string, string>,
  );
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
