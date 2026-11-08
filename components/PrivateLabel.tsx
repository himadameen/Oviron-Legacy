"use client";

import {
  CheckCircle2,
  Palette,
  Package,
  PenTool,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { collectionImages, siteImages } from "@/lib/images";
import { mediaUrl } from "@/lib/storefront/media";
import SafeImage from "./SafeImage";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import styles from "./PrivateLabel.module.css";

const defaultIcons: LucideIcon[] = [PenTool, Palette, Package, CheckCircle2];

function resolvePrivateLabelImage(cmsUrl: string): {
  src: string;
  fallbackKind: "hero" | "collection" | "editorial";
  usingPlaceholder: boolean;
} {
  if (cmsUrl) {
    return { src: cmsUrl, fallbackKind: "editorial", usingPlaceholder: false };
  }
  const preferred = siteImages.privateLabel;
  if (preferred.includes("placeholder-editorial")) {
    return {
      src: collectionImages.custom,
      fallbackKind: "collection",
      usingPlaceholder: true,
    };
  }
  return {
    src: preferred,
    fallbackKind: "editorial",
    usingPlaceholder: preferred.includes("placeholder"),
  };
}

export default function PrivateLabel() {
  const { marketing } = useStorefront();
  const block = marketing.privateLabel;
  const points = [...(block?.points ?? [])].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );
  const cmsUrl = mediaUrl(block?.image);
  const { src: imageSrc, fallbackKind, usingPlaceholder } =
    resolvePrivateLabelImage(cmsUrl);

  return (
    <section
      id="private-label"
      className={styles.section}
      aria-labelledby="pl-heading"
    >
      <div className={styles.split}>
        <div className={styles.imageCol}>
          <div className={styles.imageInner}>
            <SafeImage
              src={imageSrc}
              alt={
                block?.image?.alt ??
                "Private-label leather footwear — illustrative"
              }
              fill
              loading="lazy"
              fallbackKind={fallbackKind}
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 50vw"
            />
          </div>
          {usingPlaceholder ? (
            <span className={styles.imageBadge}>Illustrative — add CMS image</span>
          ) : null}
        </div>
        <div className={styles.content}>
          <SectionReveal>
            <div className={styles.inner}>
              <SectionIntro
                eyebrow={block?.eyebrow ?? "Private label"}
                title={block?.title ?? "Your brand. Your vision."}
                lead={
                  block?.lead ??
                  block?.body ??
                  "Customization discussed subject to supplier feasibility."
                }
                titleId="pl-heading"
              />
              <ul className={styles.points}>
                {points.map((point, index) => {
                  const Icon = defaultIcons[index] ?? CheckCircle2;
                  return (
                    <li key={`${point.label}-${index}`} className={styles.point}>
                      <span className={styles.iconWrap}>
                        <Icon size={16} strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className={styles.pointLabel}>{point.label}</span>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.ctaWrap}>
                <QuoteButton label="Private Label Enquiry" />
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
