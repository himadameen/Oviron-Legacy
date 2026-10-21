import type { Metadata } from "next";
import Link from "next/link";
import { primaryNav, quoteHref, siteRoutes } from "@/lib/routes";
import { noIndexRobots } from "@/lib/seo";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found on Oviron.",
  robots: noIndexRobots,
};

export default function NotFound() {
  return (
    <main className={styles.main} id="main-content">
      <p className="eyebrow">404</p>
      <h1 className={styles.title}>Page not found.</h1>
      <p className={styles.lead}>
        The link may be outdated. Use the routes below to continue browsing
        Oviron footwear sourcing.
      </p>
      <div className={styles.actions}>
        <Link href={siteRoutes.home} className="btn btnPrimary">
          Home
        </Link>
        <Link href={siteRoutes.products} className="btn btnSecondary">
          Product catalog
        </Link>
        <Link href={quoteHref} className="btn btnSecondary">
          Get a quote
        </Link>
      </div>
      <nav className={styles.nav} aria-label="Site sections">
        <p className={styles.navTitle}>On this site</p>
        <ul>
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
