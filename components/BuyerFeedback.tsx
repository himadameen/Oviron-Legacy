"use client";

import { Briefcase, ChevronLeft, ChevronRight, Star, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  averageRating,
  feedbackEntries,
  type FeedbackEntry,
  verifiedReviews,
} from "@/lib/reviews";
import SectionReveal from "./SectionReveal";
import styles from "./BuyerFeedback.module.css";

const AUTO_MS = 5500;

function StarRating({
  rating,
  interactive,
  size = 18,
}: {
  rating: number;
  interactive?: boolean;
  size?: number;
}) {
  return (
    <span
      className={`${styles.stars} ${interactive ? styles.starsInteractive : ""}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1);
        return (
          <span key={i} className={styles.starSlot}>
            <Star
              size={size}
              className={styles.starBg}
              strokeWidth={1.5}
              aria-hidden
            />
            <span
              className={styles.starFill}
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className={styles.starOn}
                strokeWidth={1.5}
                fill="currentColor"
                aria-hidden
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function BuyerFeedback() {
  const [audience, setAudience] = useState<"client" | "customer">("client");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLUListElement>(null);

  const entries = useMemo(() => {
    if (verifiedReviews.length > 0) {
      return verifiedReviews.map((r) => ({
        id: r.id,
        audience: "client" as const,
        quote: r.quote,
        attribution: r.role + (r.region ? ` · ${r.region}` : ""),
        rating: r.rating,
        tags: r.verified ? ["Verified"] : [],
        verified: r.verified,
      }));
    }
    return feedbackEntries.filter((e) => e.audience === audience);
  }, [audience]);

  const allForAvg = feedbackEntries;
  const avg = averageRating(allForAvg);

  useEffect(() => {
    setActive(0);
  }, [audience, entries.length]);

  useEffect(() => {
    if (entries.length <= 1 || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % entries.length);
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [entries.length, paused, audience]);

  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector("[aria-current='true']") as HTMLElement | null;
    if (!strip || !chip) return;
    const target =
      chip.offsetLeft - strip.clientWidth / 2 + chip.offsetWidth / 2;
    strip.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [active]);

  const current = entries[active] as FeedbackEntry | undefined;

  const prev = () => setActive((i) => (i - 1 + entries.length) % entries.length);
  const next = () => setActive((i) => (i + 1) % entries.length);

  return (
    <section
      id="feedback"
      className={`section ${styles.section}`}
      aria-labelledby="feedback-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container">
        <SectionReveal>
          <div className={styles.top}>
            <div>
              <p className="eyebrow">Feedback &amp; reviews</p>
              <h2 id="feedback-heading" className={styles.title}>
                Client &amp; customer voices.
              </h2>
            </div>
            <div className={styles.scoreCard}>
              <span className={styles.score}>{avg || "—"}</span>
              <StarRating rating={avg || 5} size={16} />
              <span className={styles.scoreMeta}>
                {allForAvg.length} feedback themes
              </span>
            </div>
          </div>
        </SectionReveal>

        {verifiedReviews.length === 0 && (
          <div className={styles.tabs} role="tablist" aria-label="Feedback type">
            <button
              type="button"
              role="tab"
              aria-selected={audience === "client"}
              className={audience === "client" ? styles.tabActive : styles.tab}
              onClick={() => setAudience("client")}
            >
              <Briefcase size={16} aria-hidden />
              Client feedback
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={audience === "customer"}
              className={
                audience === "customer" ? styles.tabActive : styles.tab
              }
              onClick={() => setAudience("customer")}
            >
              <Users size={16} aria-hidden />
              Customer feedback
            </button>
          </div>
        )}

        <SectionReveal>
          {current && (
            <article className={styles.featureCard} key={`${audience}-${current.id}`}>
              <StarRating rating={current.rating} interactive size={22} />
              <blockquote>&ldquo;{current.quote}&rdquo;</blockquote>
              <p className={styles.attribution}>{current.attribution}</p>
              <ul className={styles.tags}>
                {current.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={prev}
                  aria-label="Previous feedback"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className={styles.counter}>
                  {active + 1} / {entries.length}
                </span>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={next}
                  aria-label="Next feedback"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className={styles.autoProgress} aria-hidden>
                <span
                  className={styles.autoBar}
                  style={{ animationDuration: `${AUTO_MS}ms` }}
                  key={`${audience}-${active}`}
                />
              </div>
            </article>
          )}
        </SectionReveal>

        <div className={styles.stripWrap}>
          <ul
            ref={stripRef}
            className={`${styles.strip} luxuryScroll luxuryScrollDark`}
          >
            {entries.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.chip} ${index === active ? styles.chipActive : ""}`}
                  onClick={() => setActive(index)}
                  aria-current={index === active ? "true" : undefined}
                >
                  <StarRating rating={item.rating} size={12} />
                  <span className={styles.chipText}>{item.attribution}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
