import type { CatalogueBookPage } from "@/lib/catalog/build-catalogue-pages";
import { cataloguePagesForViewer } from "@/lib/catalog/catalogue-page-utils";
import CataloguePageContent from "./CataloguePageContent";
import styles from "./CatalogueBook.module.css";

type CataloguePrintExportProps = {
  pages: CatalogueBookPage[];
};

/** Sequential A4 pages for PDF — one catalogue page per PDF sheet. */
export default function CataloguePrintExport({ pages }: CataloguePrintExportProps) {
  const exportPages = cataloguePagesForViewer(pages);

  return (
    <div className={styles.printStack} data-catalogue-export aria-hidden>
      {exportPages.map((page, index) => (
        <div
          key={`export-${index}-${page.type}`}
          className={
            index > 0
              ? `${styles.printSheet} ${styles.printSheetBreak} cataloguePdfBreak`
              : styles.printSheet
          }
          data-pdf-sheet
        >
          <CataloguePageContent
            page={page}
            pageNumber={index + 1}
            variant="screen"
            forPdfExport
          />
        </div>
      ))}
    </div>
  );
}
