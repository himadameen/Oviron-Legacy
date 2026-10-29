"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CATALOGUE_PDF_FILENAME } from "@/lib/catalogue-routes";
import {
  patchFillImages,
  waitForCataloguePaint,
} from "./catalogue-export-utils";

const EXPORT_SELECTOR = "[data-catalogue-export]";
const VIEWPORT_SELECTOR = "[data-catalogue-page-viewport]";

/** A4 at 96 CSS px/in — matches print sheet and jsPDF mm layout. */
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PX_PER_MM = A4_WIDTH_PX / A4_WIDTH_MM;

export type CataloguePdfProgress = {
  current: number;
  total: number;
};

type CaptureSize = { width: number; height: number };

/** Match flipbook page size without touching the visible viewer. */
function getFlipbookCaptureSize(): CaptureSize {
  const viewport = document.querySelector(VIEWPORT_SELECTOR);
  if (viewport instanceof HTMLElement) {
    const rect = viewport.getBoundingClientRect();
    if (rect.width >= 240 && rect.height >= 320) {
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }
  }
  return { width: A4_WIDTH_PX, height: A4_HEIGHT_PX };
}

function applyCaptureLayout(
  stack: HTMLElement,
  sheets: HTMLElement[],
  size: CaptureSize
): () => void {
  const stackPrev = stack.getAttribute("style");
  const sheetStates = sheets.map((sheet) => ({
    sheet,
    prev: sheet.getAttribute("style"),
    page: sheet.firstElementChild,
    pagePrev:
      sheet.firstElementChild instanceof HTMLElement
        ? sheet.firstElementChild.getAttribute("style")
        : null,
  }));

  stack.style.setProperty("position", "fixed", "important");
  stack.style.setProperty("left", "-10000px", "important");
  stack.style.setProperty("top", "0", "important");
  stack.style.setProperty("transform", "none", "important");
  stack.style.setProperty("opacity", "1", "important");
  stack.style.setProperty("visibility", "visible", "important");
  stack.style.setProperty("pointer-events", "none", "important");
  stack.style.setProperty("z-index", "-1", "important");
  stack.style.setProperty("width", `${size.width}px`, "important");
  stack.style.setProperty("background", "#faf8f4", "important");

  for (const { sheet, page } of sheetStates) {
    sheet.style.width = `${size.width}px`;
    sheet.style.height = `${size.height}px`;
    sheet.style.overflow = "hidden";
    sheet.style.boxSizing = "border-box";
    if (page instanceof HTMLElement) {
      page.style.width = "100%";
      page.style.maxWidth = "none";
      page.style.height = `${size.height}px`;
      page.style.boxSizing = "border-box";
    }
  }

  return () => {
    if (stackPrev === null) stack.removeAttribute("style");
    else stack.setAttribute("style", stackPrev);

    for (const { sheet, prev, page, pagePrev } of sheetStates) {
      if (prev === null) sheet.removeAttribute("style");
      else sheet.setAttribute("style", prev);
      if (page instanceof HTMLElement) {
        if (pagePrev === null) page.removeAttribute("style");
        else page.setAttribute("style", pagePrev);
      }
    }
  };
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function resolveCaptureElement(target: HTMLElement): HTMLElement {
  const article = target.querySelector("article");
  return article instanceof HTMLElement ? article : target;
}

async function renderCanvasFromElement(
  target: HTMLElement,
  scale: number
): Promise<{ canvas: HTMLCanvasElement; cssWidth: number; cssHeight: number }> {
  const captureEl = resolveCaptureElement(target);
  patchFillImages(captureEl, window);

  const canvas = await html2canvas(captureEl, {
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: "#faf8f4",
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    scrollX: 0,
    scrollY: -window.scrollY,
    onclone: (clonedDoc) => {
      const clonedStack = clonedDoc.querySelector(EXPORT_SELECTOR);
      if (clonedStack instanceof HTMLElement) {
        patchFillImages(clonedStack, clonedDoc.defaultView);
      }
    },
  });

  const cssWidth = Math.max(1, canvas.width / scale);
  const cssHeight = Math.max(1, canvas.height / scale);

  return { canvas, cssWidth, cssHeight };
}

/** Place snapshot at true 96dpi size, centered — never upscale to full bleed. */
function addSnapshotToA4Page(
  pdf: jsPDF,
  imgData: string,
  cssWidth: number,
  cssHeight: number
): void {
  let drawW = cssWidth / PX_PER_MM;
  let drawH = cssHeight / PX_PER_MM;

  const fit = Math.min(A4_WIDTH_MM / drawW, A4_HEIGHT_MM / drawH, 1);
  drawW *= fit;
  drawH *= fit;

  const x = (A4_WIDTH_MM - drawW) / 2;
  const y = (A4_HEIGHT_MM - drawH) / 2;

  pdf.addImage(imgData, "JPEG", x, y, drawW, drawH, undefined, "FAST");
}

export async function downloadCataloguePdf(
  onProgress?: (progress: CataloguePdfProgress) => void
): Promise<void> {
  const stack = document.querySelector(EXPORT_SELECTOR);
  if (!(stack instanceof HTMLElement)) {
    throw new Error("Catalogue export is not mounted yet. Refresh and try again.");
  }

  const sheets = Array.from(
    stack.querySelectorAll("[data-pdf-sheet]")
  ) as HTMLElement[];
  if (sheets.length === 0) {
    throw new Error("No catalogue pages found for export.");
  }

  const captureSize = getFlipbookCaptureSize();
  const restoreLayout = applyCaptureLayout(stack, sheets, captureSize);
  const sheetDisplayRestore = sheets.map((sheet) => sheet.style.display);
  const scale = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1.5));

  try {
    await waitForCataloguePaint(stack);
    patchFillImages(stack, window);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    const total = sheets.length;

    for (let i = 0; i < sheets.length; i++) {
      onProgress?.({ current: i + 1, total });

      sheets.forEach((sheet, index) => {
        sheet.style.display = index === i ? "block" : "none";
      });

      const sheet = sheets[i];
      await waitForCataloguePaint(sheet);

      if (i > 0) {
        pdf.addPage("a4", "portrait");
      }

      const snapshot = await renderCanvasFromElement(sheet, scale);
      const imgData = snapshot.canvas.toDataURL("image/jpeg", 0.92);
      addSnapshotToA4Page(pdf, imgData, snapshot.cssWidth, snapshot.cssHeight);

      await yieldToBrowser();
    }

    pdf.save(CATALOGUE_PDF_FILENAME);
  } finally {
    sheets.forEach((sheet, index) => {
      sheet.style.display = sheetDisplayRestore[index] ?? "";
    });
    restoreLayout();
  }
}
