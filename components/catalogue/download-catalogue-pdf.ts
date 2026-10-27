"use client";

import { CATALOGUE_PDF_FILENAME } from "@/lib/catalogue-routes";

const EXPORT_SELECTOR = "[data-catalogue-export]";

/** A4 at 96dpi — matches print layout width/height for sharp PDF pages. */
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export async function downloadCataloguePdf(): Promise<void> {
  const stack = document.querySelector(EXPORT_SELECTOR);
  if (!(stack instanceof HTMLElement)) {
    throw new Error("Catalogue content is not ready to export.");
  }

  const sheets = stack.querySelectorAll("[data-pdf-sheet]");
  if (sheets.length === 0) {
    throw new Error("No catalogue pages found for export.");
  }

  const html2pdf = (await import("html2pdf.js")).default;

  await html2pdf()
    .set({
      margin: 0,
      filename: CATALOGUE_PDF_FILENAME,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(stack)
    .save();
}
