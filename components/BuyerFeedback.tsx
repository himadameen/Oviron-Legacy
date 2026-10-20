import {
  ClipboardList,
  MessageSquare,
  Star,
  StarHalf,
  Users,
} from "lucide-react";
import { partnershipThemes, verifiedReviews } from "@/lib/reviews";
import QuoteButton from "./QuoteButton";
import SectionReveal from "./SectionReveal";
import styles from "./BuyerFeedback.module.css";

const iconMap = {
  clipboard: ClipboardList,
  message: MessageSquare,
  handshake: Users,
} as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        const Icon = half ? StarHalf : Star;
        return (
          <Icon
            key={i}
            size={16}
            className={filled || half ? styles.starOn : styles.starOff}
            strokeWidth={1.5}
            aria-hidden
          />
        );
      })}
    </span>
  );
}

export default function BuyerFeedback() {
  const hasReviews = verifiedReviews.length > 0;

  return (
    <section
      id="feedback"
      className={`section ${styles.section}`}
      aria-labelledby="feedback-heading"
    >
      <div className="container">
        <SectionReveal>
          <div className={styles.head}>
            <div>
              <p className="eyebrow">Feedback &amp; reviews</p>
              <h2 id="feedback-heading" className={styles.title}>
                What partners value.
              </h2>
              <p className={styles.lead}>
                {hasReviews
                  ? "Verified buyer feedback from completed sourcing relationships."
                  : "Publish verified reviews in lib/reviews.ts — themes below reflect how we work today."}
              </p>
            </div>
            <QuoteButton label="Share Your Brief" />
          </div>
        </SectionReveal>

        {hasReviews ? (
          <ul className={styles.reviews}>
            {verifiedReviews.map((item) => (
              <li key={item.id}>
                <SectionReveal>
                  <article className={styles.reviewCard}>
                    <Stars rating={item.rating} />
                    <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                    <p className={styles.meta}>
                      {item.role}
                      {item.region ? ` · ${item.region}` : ""}
                      {item.verified ? " · Verified" : ""}
                    </p>
                  </article>
                </SectionReveal>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.themes}>
            {partnershipThemes.map((theme) => {
              const Icon = iconMap[theme.icon];
              return (
                <li key={theme.id}>
                  <SectionReveal>
                    <article className={styles.themeCard}>
                      <span className={styles.themeIcon}>
                        <Icon size={22} strokeWidth={1.5} aria-hidden />
                      </span>
                      <h3>{theme.title}</h3>
                      <p>{theme.copy}</p>
                    </article>
                  </SectionReveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
