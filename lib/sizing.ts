/** Standard B2B size bands — adjust per style in product-catalog when needed. */
export type SizeMatrix = {
  eu: string;
  uk: string;
  us: string;
};

export function formatSizeMatrix(sizes: SizeMatrix): string {
  return `EU ${sizes.eu} · UK ${sizes.uk} · US ${sizes.us}`;
}

export const sizeMatrixStandard: SizeMatrix = {
  eu: "39–46",
  uk: "6–12",
  us: "7–13",
};

export const sizeMatrixCompact: SizeMatrix = {
  eu: "39–45",
  uk: "6–11",
  us: "7–12",
};
