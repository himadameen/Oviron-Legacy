"use client";

import { Layers, Package, Palette } from "lucide-react";
import { useState } from "react";
import type { ManufacturingProduct } from "@/lib/product-catalog";
import styles from "../ProductListing.module.css";

type SpecTab = "materials" | "build" | "commercial";

export default function ProductSpecTabs({
  product,
  layout = "card",
}: {
  product: ManufacturingProduct;
  layout?: "card" | "detail";
}) {
  const [tab, setTab] = useState<SpecTab>("materials");

  const panels: Record<
    SpecTab,
    { icon: typeof Palette; label: string; rows: { label: string; value: string }[] }
  > = {
    materials: {
      icon: Palette,
      label: "Materials",
      rows: [
        { label: "Upper", value: product.upperMaterial },
        { label: "Lining", value: product.lining },
        { label: "Colors", value: product.colorRuns },
      ],
    },
    build: {
      icon: Layers,
      label: "Build",
      rows: [
        { label: "Construction", value: product.construction },
        { label: "Sole", value: product.soleType },
        { label: "Size matrix", value: product.sizeLabel },
      ],
    },
    commercial: {
      icon: Package,
      label: "Commercial",
      rows: [
        { label: "Grades", value: product.gradeOptions },
        { label: "Private label", value: product.privateLabel },
        { label: "Packaging", value: product.packaging },
      ],
    },
  };

  const active = panels[tab];
  const Icon = active.icon;
  const isDetail = layout === "detail";

  const tabList = (
    <div className={styles.specTabList} role="tablist" aria-label="Product specifications">
      {(Object.keys(panels) as SpecTab[]).map((key) => {
        const PanelIcon = panels[key].icon;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? styles.specTabActive : styles.specTab}
            onClick={() => setTab(key)}
          >
            <PanelIcon size={14} strokeWidth={1.5} aria-hidden />
            {panels[key].label}
          </button>
        );
      })}
    </div>
  );

  const tabPanel = (
    <div className={styles.specPanel} role="tabpanel" aria-label={active.label}>
      <div className={styles.specPanelHead}>
        <Icon size={18} strokeWidth={1.5} aria-hidden />
        <h3>{active.label}</h3>
      </div>
      <dl className={styles.specDl}>
        {active.rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (isDetail) {
    return (
      <div className={styles.detailSpecBlock}>
        {tabList}
        <div className={styles.detailSpecPanelShell}>{tabPanel}</div>
      </div>
    );
  }

  return (
    <div className={styles.specTabs}>
      {tabList}
      {tabPanel}
    </div>
  );
}
