import {
  CheckCircle2,
  Palette,
  Package,
  PenTool,
} from "lucide-react";
import { siteImages } from "@/lib/images";
import SafeImage from "./SafeImage";
import QuoteButton from "./QuoteButton";
import SectionIntro from "./SectionIntro";
import SectionReveal from "./SectionReveal";
import styles from "./PrivateLabel.module.css";

const points = [
  { icon: PenTool, label: "Custom design" },
  { icon: Palette, label: "Materials & colors" },
  { icon: Package, label: "Packaging" },
  { icon: CheckCircle2, label: "MOQ & samples" },
];

export default function PrivateLabel() {
  return (
    <section
      id="private-label"
      className={styles.section}
      aria-labelledby="pl-heading"
    >
      <div className={styles.split}>
        <div className={styles.imageCol}>
          <SafeImage
            src={siteImages.privateLabel}
            alt="Private-label leather footwear — illustrative"
            width={800}
            height={1000}
            loading="lazy"
            fallbackKind="editorial"
            className={styles.image}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </div>
        <div className={styles.content}>
          <SectionReveal>
            <SectionIntro
              eyebrow="Private label"
              title="Your brand. Your vision."
              lead="Customization discussed subject to supplier feasibility."
            />
            <h2 id="pl-heading" className="sr-only">
              Private-label opportunities
            </h2>
            <ul className={styles.list}>
              {points.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={18} strokeWidth={1.5} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <QuoteButton label="Private Label Quote" />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
