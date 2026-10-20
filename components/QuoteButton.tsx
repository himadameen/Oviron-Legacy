import { ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./QuoteButton.module.css";

type Props = {
  href?: string;
  label?: string;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

export default function QuoteButton({
  href = "#contact",
  label = "Get a Quote",
  variant = "primary",
  className,
}: Props) {
  const isHash = href.startsWith("#") || href.includes("#contact");

  const classes = [
    styles.btn,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {label}
      <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
    </>
  );

  if (isHash && !href.startsWith("http")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
