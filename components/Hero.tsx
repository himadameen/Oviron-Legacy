import { Globe2, Sparkles } from "lucide-react";
import QuoteButton from "./QuoteButton";
import HeroVisual from "./HeroVisual";
import SectionReveal from "./SectionReveal";
import styles from "./Hero.module.css";

const highlights = [
  { icon: Sparkles, label: "Wholesale sourcing" },
  { icon: Globe2, label: "Export enquiries" },
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.grid}`}>
        <SectionReveal className={styles.visualWrap}>
          <div className={styles.showcase}>
            <HeroVisual />
          </div>
        </SectionReveal>

        <SectionReveal className={styles.copyBlock}>
          <p className="eyebrow">Footwear sourcing &amp; supply</p>
          <h1 id="hero-heading" className={styles.title}>
            Crafted for distinction.
            <span>Built for the world.</span>
          </h1>
          <p className={styles.copy}>
            B2B leather footwear sourcing, wholesale supply, and private-label
            opportunities.
          </p>
          <ul className={styles.highlights}>
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={18} strokeWidth={1.5} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <QuoteButton label="Get a Quote" />
            <QuoteButton
              href="/#collections"
              label="View Collections"
              variant="secondary"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
