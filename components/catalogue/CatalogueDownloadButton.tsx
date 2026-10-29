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
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(
    null
  );

  const onDownload = useCallback(async () => {
    setBusy(true);
    setProgress(null);
    try {
      await downloadCataloguePdf(setProgress);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "PDF export failed.";
      window.alert(
        `${message}\n\nIf this keeps happening, hard-refresh the page (Ctrl+F5) and try again.`
      );
    } finally {
      setBusy(false);
      setProgress(null);
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
      {busy
        ? progress
          ? `Preparing PDF… ${progress.current}/${progress.total}`
          : "Preparing PDF…"
        : label}
    </button>
  );
}
