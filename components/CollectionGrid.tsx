"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import SafeImage from "./SafeImage";
import { buildWhatsAppUrl, categoryWhatsAppMessage } from "@/lib/contact";
import {
  collectionGroups,
  collections,
  type CollectionGroupId,
} from "@/lib/collections";
import { isContactConfigured } from "@/lib/site-config";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./CollectionGrid.module.css";

function handleCategoryClick(
  e: React.MouseEvent,
  categoryName: string
) {
  if (isContactConfigured("whatsapp")) {
    e.preventDefault();
    const url = buildWhatsAppUrl(categoryWhatsAppMessage(categoryName));
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  requestAnimationFrame(() => {
    document
      .getElementById("enquiry-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function CollectionGrid() {
  const [active, setActive] = useState<CollectionGroupId | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return collections;
    return collections.filter((c) => c.group === active);
  }, [active]);

  return (
    <section
      id="collections"
      className="section"
      aria-labelledby="collections-heading"
    >
      <div className="container">
        <SectionReveal>
          <SectionIntro
            eyebrow="Collections"
            title="Nine styles. Three rows."
            lead="Browse by Formal, Casual, Sports, and Other — tap for a quote."
            align="center"
            titleId="collections-heading"
          />
        </SectionReveal>

        <div className={styles.filters} role="tablist" aria-label="Collection groups">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            className={active === "all" ? styles.filterActive : styles.filter}
            onClick={() => setActive("all")}
          >
            All
          </button>
          {collectionGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={active === group.id}
              className={active === group.id ? styles.filterActive : styles.filter}
              onClick={() => setActive(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>

        {active === "all" ? (
          collectionGroups.map((group) => {
            const items = collections.filter((c) => c.group === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id} className={styles.groupBlock}>
                <header className={styles.groupHead}>
                  <h3>{group.label}</h3>
                  <p>{group.subtitle}</p>
                </header>
                <ul className={styles.grid}>
                  {items.map((item, index) => (
                    <li key={item.id}>{renderCard(item, index)}</li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <ul className={styles.grid}>
            {filtered.map((item, index) => (
              <li key={item.id}>{renderCard(item, index)}</li>
            ))}
          </ul>
        )}

        <div className={styles.footerCta}>
          <QuoteButton label="Request a Quote" />
        </div>
      </div>
    </section>
  );

  function renderCard(
    item: (typeof collections)[number],
    index: number
  ) {
    const href = `/?category=${encodeURIComponent(item.name)}`;
    const groupLabel =
      collectionGroups.find((g) => g.id === item.group)?.label ?? "";

    return (
      <SectionReveal>
        <Link
          href={href}
          className={styles.card}
          onClick={(e) => handleCategoryClick(e, item.name)}
          aria-label={`Quote enquiry: ${item.name}`}
        >
          <div className={styles.imageWrap}>
            <SafeImage
              src={item.image}
              alt={item.imageAlt}
              width={640}
              height={480}
              loading={index < 3 ? "eager" : "lazy"}
              fallbackKind="collection"
              className={styles.image}
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <span className={styles.badge}>{groupLabel}</span>
            <span className={styles.num}>{item.number}</span>
          </div>
          <div className={styles.body}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <span className={styles.action}>
              Quote
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      </SectionReveal>
    );
  }
}
