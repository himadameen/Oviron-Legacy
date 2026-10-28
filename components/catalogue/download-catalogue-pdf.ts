"use client";

import { CATALOGUE_PDF_FILENAME } from "@/lib/catalogue-routes";

const EXPORT_SELECTOR = "[data-catalogue-export]";

/** A4 at 96dpi — matches `.a4PagePrint` / `.printSheet`. */
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export type CataloguePdfProgress = {
  current: number;
  total: number;
};

/** Opacity 1 but off-screen — html2canvas can read it; viewer stays visible. */
function prepareExportStack(stack: HTMLElement): () => void {
  const previous = stack.getAttribute("style");
  stack.style.setProperty("opacity", "1", "important");
  stack.style.setProperty("position", "fixed", "important");
  stack.style.setProperty("left", "0", "important");
  stack.style.setProperty("top", "0", "important");
  stack.style.setProperty("transform", "translateX(-120vw)", "important");
  stack.style.setProperty("z-index", "-1", "important");
  stack.style.setProperty("visibility", "visible", "important");
  stack.style.setProperty("pointer-events", "none", "important");
  stack.style.setProperty("width", `${A4_WIDTH_PX}px`, "important");

  return () => {
    if (previous === null) {
      stack.removeAttribute("style");
    } else {
      stack.setAttribute("style", previous);
    }
  };
}

async function waitForExportReady(root: HTMLElement): Promise<void> {
  await document.fonts?.ready;

  const imgs = Array.from(root.querySelectorAll("img"));
  for (const img of imgs) {
    img.loading = "eager";
    img.decode?.().catch(() => undefined);
  }

  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        })
    )
  );

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export async function downloadCataloguePdf(
  onProgress?: (progress: CataloguePdfProgress) => void
): Promise<void> {
  const stack = document.querySelector(EXPORT_SELECTOR);
  if (!(stack instanceof HTMLElement)) {
    throw new Error("Catalogue content is not ready to export.");
  }

  const sheets = Array.from(
    stack.querySelectorAll("[data-pdf-sheet]")
  ) as HTMLElement[];
  if (sheets.length === 0) {
    throw new Error("No catalogue pages found for export.");
  }

  const restoreStack = prepareExportStack(stack);

  try {
    await waitForExportReady(stack);

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    const total = sheets.length;

    for (let i = 0; i < sheets.length; i++) {
      onProgress?.({ current: i + 1, total });

      const sheet = sheets[i];
      if (i > 0) {
        pdf.addPage("a4", "portrait");
      }

      const canvas = await html2canvas(sheet, {
        scale: 1.75,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");

      await yieldToBrowser();
    }

    pdf.save(CATALOGUE_PDF_FILENAME);
  } finally {
    restoreStack();
  }
}
