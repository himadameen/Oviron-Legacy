"use client";

import { Globe2, Sparkles } from "lucide-react";
import QuoteButton from "./QuoteButton";
import HeroVisual from "./HeroVisual";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import { mediaUrl } from "@/lib/storefront/media";
import styles from "./Hero.module.css";

export default function Hero() {
  const { marketing, site } = useStorefront();
  const hero = marketing.hero;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.grid}`}>
        <SectionReveal className={styles.visualWrap}>
          <div className={styles.showcase}>
            <HeroVisual
              slides={
                hero?.slides
                  ?.map((slide) => ({
                    src: mediaUrl(slide.image),
                    alt: slide.image?.alt ?? "",
                  }))
                  .filter((s) => s.src) ?? undefined
              }
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
