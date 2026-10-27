"use client";

import { Download } from "lucide-react";
import { useCallback, useState } from "react";
import { downloadCataloguePdf } from "./download-catalogue-pdf";
import styles from "./CatalogueView.module.css";

type CatalogueDownloadButtonProps = {
  className?: string;
  label?: string;
};

export default function CatalogueDownloadButton({
  className,
  label = "Download",
}: CatalogueDownloadButtonProps) {
  const [busy, setBusy] = useState(false);

  const onDownload = useCallback(async () => {
    setBusy(true);
    try {
      await downloadCataloguePdf();
    } catch {
      window.print();
    } finally {
      setBusy(false);
    }
  }, []);

  const classes = [styles.printBtn, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onDownload}
      disabled={busy}
      aria-busy={busy}
    >
      <Download size={16} strokeWidth={1.5} aria-hidden />
      {busy ? "Preparing PDF…" : label}
    </button>
  );
}
