"use client";

import { useEffect, useMemo } from "react";
import { Globe2, Sparkles } from "lucide-react";
import QuoteButton from "./QuoteButton";
import HeroVisual from "./HeroVisual";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import { mediaUrl } from "@/lib/storefront/media";
import styles from "./Hero.module.css";

export default function Hero() {
  const { marketing, site, sources } = useStorefront();
  const hero = marketing.hero;

  const heroSlides = useMemo(
    () =>
      hero?.slides
        ?.map((slide) => ({
          src: mediaUrl(slide.image),
          alt: slide.image?.alt ?? "",
        }))
        .filter((s) => s.src) ?? [],
    [hero?.slides]
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.log("[Hero] marketing source:", sources.marketing);
    console.log("[Hero] raw marketing.hero.slides:", hero?.slides);
    console.log("[Hero] slides sent to HeroVisual:", heroSlides);
    if ((hero?.slides?.length ?? 0) > 0 && heroSlides.length === 0) {
      console.warn(
        "[Hero] Strapi returned slides but all image URLs were empty after mediaUrl() — check image.url shape."
      );
    }
  }, [hero?.slides, heroSlides, sources.marketing]);

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.grid}`}>
        <SectionReveal className={styles.visualWrap}>
          <div className={styles.showcase}>
            <HeroVisual
              slides={heroSlides.length > 0 ? heroSlides : undefined}
              slideIntervalMs={hero?.slideIntervalMs}
              stampLogoSrc={mediaUrl(site.assets?.logoIcon) || undefined}
            />
          </div>
        </SectionReveal>

        <SectionReveal className={styles.copyBlock}>
          <p className="eyebrow">{hero?.eyebrow}</p>
          <h1 id="hero-heading" className={styles.title}>
            {hero?.title}
            {hero?.titleAccent ? <span>{hero.titleAccent}</span> : null}
          </h1>
          <p className={styles.copy}>{hero?.copy}</p>
          <ul className={styles.highlights}>
            {(hero?.highlights ?? []).map((item) => (
              <li key={item.label}>
                {item.label.toLowerCase().includes("export") ? (
                  <Globe2 size={18} strokeWidth={1.5} aria-hidden />
                ) : (
                  <Sparkles size={18} strokeWidth={1.5} aria-hidden />
                )}
                {item.label}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <QuoteButton
              label={hero?.ctaPrimary?.label ?? "Get a Quote"}
              href={hero?.ctaPrimary?.href}
            />
            <QuoteButton
              href={hero?.ctaSecondary?.href ?? "/catalogue"}
              label={hero?.ctaSecondary?.label ?? "View Catalogue"}
              variant="secondary"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
