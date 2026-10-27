"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { downloadCataloguePdf } from "./download-catalogue-pdf";

export default function CatalogueDownloadOnQuery() {
  const searchParams = useSearchParams();
  const started = useRef(false);

  useEffect(() => {
    if (searchParams.get("download") !== "1" || started.current) {
      return;
    }
    started.current = true;

    const timer = window.setTimeout(() => {
      void downloadCataloguePdf().catch(() => window.print());
    }, 800);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  return null;
}
