import type { CatalogueBookPage } from "./build-catalogue-pages";

export function cataloguePagesForViewer(
  pages: CatalogueBookPage[]
): CatalogueBookPage[] {
  return pages.filter((p) => p.type !== "blank");
}

export function tocJumpTargets(
  pages: CatalogueBookPage[]
): { id: string; label: string; pageIndex: number; count?: number }[] {
  const usable = cataloguePagesForViewer(pages);
  const tocPage = usable.find((p) => p.type === "toc");

  if (tocPage && tocPage.type === "toc" && tocPage.items.length > 0) {
    const seen = new Set<string>();
    return tocPage.items
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({
        id: item.id,
        label: item.label,
        pageIndex: Math.max(0, item.page - 1),
        count: item.count,
      }));
  }

  const targets: { id: string; label: string; pageIndex: number; count?: number }[] =
    [];
  const seenSections = new Set<string>();

  usable.forEach((page, pageIndex) => {
    if (page.type !== "section") return;
    if (seenSections.has(page.sectionId)) return;
    seenSections.add(page.sectionId);
    targets.push({
      id: page.sectionId,
      label: page.label,
      pageIndex,
    });
  });

  return targets;
}
