/**
 * API merchandising tags — normalize slugs/labels and pick up to 2 for display.
 */

export type ProductTagKey =
  | "recommended"
  | "fast_moving"
  | "most_likable"
  | "most_sale"
  | "trending"
  | "hot_sale"
  | "sold";

export type ProductTagChip = {
  key: ProductTagKey;
  label: string;
};

const PRIORITY: ProductTagKey[] = [
  "recommended",
  "fast_moving",
  "hot_sale",
  "most_likable",
  "most_sale",
  "trending",
  "sold",
];

const LABELS: Record<ProductTagKey, string> = {
  recommended: "Recommended",
  fast_moving: "Fast moving",
  most_likable: "Most likable",
  most_sale: "Most sale",
  trending: "Trending",
  hot_sale: "Hot sale",
  sold: "Sold",
};

/** Map normalized slug → canonical key (typos & aliases). */
const ALIAS_TO_KEY: Record<string, ProductTagKey> = {
  recommended: "recommended",
  recomended: "recommended",
  recommend: "recommended",
  fast_moving: "fast_moving",
  fastmoving: "fast_moving",
  fast: "fast_moving",
  most_likable: "most_likable",
  mostlikable: "most_likable",
  likable: "most_likable",
  most_sale: "most_sale",
  mostsale: "most_sale",
  sale: "most_sale",
  sold_out: "most_sale",
  trending: "trending",
  trend: "trending",
  hot_sale: "hot_sale",
  hotsale: "hot_sale",
  sold: "sold",
};

function slugifyTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function rawToKey(raw: string): ProductTagKey | null {
  const s = slugifyTag(raw);
  if (!s) return null;
  if (ALIAS_TO_KEY[s]) return ALIAS_TO_KEY[s];
  if (PRIORITY.includes(s as ProductTagKey)) return s as ProductTagKey;
  return null;
}

/**
 * From API `tags` array — dedupe, priority order, max 2 chips with display labels.
 */
export function pickProductTagChips(
  tags: string[] | undefined,
  max = 2
): ProductTagChip[] {
  if (!tags?.length) return [];

  const seen = new Set<ProductTagKey>();
  const ordered: ProductTagKey[] = [];

  for (const raw of tags) {
    const key = rawToKey(raw);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    ordered.push(key);
  }

  const priorityRank = (k: ProductTagKey) => {
    const i = PRIORITY.indexOf(k);
    return i === -1 ? 999 : i;
  };

  ordered.sort((a, b) => priorityRank(a) - priorityRank(b));

  return ordered.slice(0, max).map((key) => ({
    key,
    label: LABELS[key],
  }));
}
