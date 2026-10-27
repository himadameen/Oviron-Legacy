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
  const targets: { id: string; label: string; pageIndex: number; count?: number }[] =
    [];

  usable.forEach((page, pageIndex) => {
    if (page.type === "toc") {
      for (const item of page.items) {
        targets.push({
          id: item.id,
          label: item.label,
          pageIndex: Math.max(0, item.page - 1),
          count: item.count,
        });
      }
      return;
    }
    if (page.type === "section") {
      targets.push({
        id: page.sectionId,
        label: page.label,
        pageIndex,
      });
    }
  });

  return targets;
}
