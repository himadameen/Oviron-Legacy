import styles from "./SectionIntro.module.css";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  titleId?: string;
};

export default function SectionIntro({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  titleId,
}: Props) {
  return (
    <header
      className={[
        styles.intro,
        align === "center" ? styles.center : "",
        tone === "dark" ? styles.dark : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <hr className={styles.rule} aria-hidden />
    </header>
  );
}
