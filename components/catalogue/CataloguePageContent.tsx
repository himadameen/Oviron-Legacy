import Link from "next/link";
import type { CatalogueBookPage } from "@/lib/catalog/build-catalogue-pages";
import type { CatalogueProductEntry } from "@/lib/catalog/build-catalogue-document";
import SafeImage from "../SafeImage";
import styles from "./CatalogueBook.module.css";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

const CATALOGUE_SPEC_PRIORITY = [
  "Typical use",
  "Upper / material",
  "Colors",
  "Sizes",
  "Construction",
  "Packaging",
] as const;

function conciseSpecLines(
  lines: CatalogueProductEntry["specLines"]
): CatalogueProductEntry["specLines"] {
  const picked = CATALOGUE_SPEC_PRIORITY.map((label) =>
    lines.find((line) => line.label === label)
  ).filter((line): line is NonNullable<typeof line> => Boolean(line));

  const source = picked.length > 0 ? picked : lines.slice(0, 5);

  return source.map((line) => ({
    label: line.label,
    value: truncate(line.value, 44),
  }));
}

type Props = {
  page: CatalogueBookPage;
  pageNumber: number;
  variant?: "screen" | "print";
  onJumpToPage?: (pageIndex: number) => void;
};

export default function CataloguePageContent({
  page,
  pageNumber,
  variant = "print",
  onJumpToPage,
}: Props) {
  const isScreen = variant === "screen";
  const pageClass = isScreen ? styles.a4PageScreen : styles.a4PagePrint;

  const imageSizes = isScreen
    ? "(max-width: 900px) 88vw, 520px"
    : "360px";

  const footer = (
    <footer className={styles.pageFooter}>
      <span className={styles.pageFooterLabel}>Page</span>
      <span>{pageNumber}</span>
    </footer>
  );

  switch (page.type) {
    case "blank":
      return (
        <article className={`${pageClass} ${styles.pageBlank}`} data-page={pageNumber}>
          {footer}
        </article>
      );

    case "cover":
      return (
        <article className={`${pageClass} ${styles.pageCover}`} data-page={pageNumber}>
          <div className={styles.coverTop}>
            <p className={styles.coverBrand}>{page.brandName}</p>
            <h1 className={styles.coverTitle}>Manufacturing Catalogue</h1>
            <p className={styles.coverEdition}>{page.edition}</p>
            <p className={styles.coverTagline}>{page.logoTagline}</p>
            <p className={styles.coverTaglineSecondary}>{page.tagline}</p>
          </div>
          <div className={styles.coverHero}>
            <SafeImage
              src={page.heroImage}
              alt=""
              fill
              className={styles.coverHeroImg}
              fallbackKind="hero"
              sizes={imageSizes}
              priority={isScreen}
            />
          </div>
          <p className={styles.coverMeta}>
            {page.productCount} published styles · B2B wholesale &amp; private
            label programs
          </p>
          {footer}
        </article>
      );

    case "welcome":
      return (
        <article className={`${pageClass} ${styles.pageWelcome}`} data-page={pageNumber}>
          <div className={styles.sideBar} aria-hidden />
          <div className={styles.pageInner}>
            <p className={styles.kicker}>Introduction</p>
            <h2 className={styles.pageHeading}>
              Welcome to {page.brandName}
            </h2>
            <p className={styles.leadCopy}>{page.description}</p>
            <p className={styles.bodyCopyMuted}>
              Edition {page.edition}. Every specification in this catalogue is
              indicative for sourcing discussions — final terms are confirmed
              per enquiry and destination market.
            </p>
          </div>
          {footer}
        </article>
      );

    case "toc":
      return (
        <article className={`${pageClass} ${styles.pageToc}`} data-page={pageNumber}>
          <div className={styles.pageInnerFlush}>
            <p className={styles.kicker}>Overview</p>
            <h2 className={styles.pageHeading}>Table of contents</h2>
            <ol className={styles.tocList}>
              {page.items.map((item) => (
                <li key={item.id}>
                  {isScreen && onJumpToPage ? (
                    <button
                      type="button"
                      className={styles.tocButton}
                      onClick={() => onJumpToPage(Math.max(0, item.page - 1))}
                    >
                      <span className={styles.tocLabel}>{item.label}</span>
                      <span className={styles.tocLeader} aria-hidden />
                      <span className={styles.tocPage}>{item.page}</span>
                    </button>
                  ) : (
                    <div className={styles.tocRow}>
                      <span className={styles.tocLabel}>{item.label}</span>
                      <span className={styles.tocLeader} aria-hidden />
                      <span className={styles.tocPage}>{item.page}</span>
                    </div>
                  )}
                  <span className={styles.tocCount}>{item.count} styles</span>
                </li>
              ))}
            </ol>
          </div>
          {footer}
        </article>
      );

    case "section":
      return (
        <article className={`${pageClass} ${styles.pageSection}`} data-page={pageNumber}>
          <div className={styles.sectionHero}>
            <SafeImage
              src={page.heroImage}
              alt={page.heroAlt}
              fill
              className={styles.sectionHeroImg}
              fallbackKind="collection"
              sizes={imageSizes}
              priority={isScreen}
            />
            <div className={styles.sectionHeroOverlay}>
              <p className={styles.kicker}>Collection</p>
              <h2 className={styles.sectionTitle}>{page.label}</h2>
            </div>
          </div>
          <div className={styles.sectionCopy}>
            {page.subtitle ? (
              <p className={styles.sectionSubtitle}>{page.subtitle}</p>
            ) : null}
            {page.subLabels.length > 0 ? (
              <>
                <p className={styles.sectionPillsLabel}>Lines in this category</p>
                <ul className={styles.sectionSubPills} aria-label="Subcategories">
                  {page.subLabels.map((label) => (
                    <li key={label}>
                      <span className={styles.sectionSubPill}>{label}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          {footer}
        </article>
      );

    case "products":
      return (
        <article className={`${pageClass} ${styles.pageProducts}`} data-page={pageNumber}>
          <ul className={styles.productSpecList}>
            {page.products.map((product) => (
              <li key={product.id}>
                <ProductSpecSheet
                  product={product}
                  sectionLabel={page.sectionLabel}
                  subLabel={page.subLabel}
                  imageOnRight={pageNumber % 2 === 0}
                  imageSizes={imageSizes}
                  showOnlineLink={isScreen}
                />
              </li>
            ))}
          </ul>
          {footer}
        </article>
      );

    case "closing":
      return (
        <article className={`${pageClass} ${styles.pageClosing}`} data-page={pageNumber}>
          <div className={styles.sideBar} aria-hidden />
          <div className={styles.pageInner}>
            <p className={styles.kicker}>Next steps</p>
            <h2 className={styles.pageHeading}>{page.brandName}</h2>
            <p className={styles.leadCopy}>{page.logoTagline}</p>
            <p className={styles.bodyCopyMuted}>
              Thank you for reviewing our manufacturing catalogue. Share your
              target assortment, MOQ, and labelling requirements — our team will
              align specifications and export documentation with your program.
            </p>
            <p className={styles.closingEdition}>Edition {page.edition}</p>
          </div>
          {footer}
        </article>
      );

    default:
      return null;
  }
}

function ProductSpecSheet({
  product,
  sectionLabel,
  subLabel,
  imageOnRight,
  imageSizes,
  showOnlineLink,
}: {
  product: CatalogueProductEntry;
  sectionLabel: string;
  subLabel: string;
  imageOnRight: boolean;
  imageSizes: string;
  showOnlineLink: boolean;
}) {
  const layoutClass = [
    styles.productPageLayout,
    imageOnRight ? styles.productPageLayoutFlip : "",
  ]
    .filter(Boolean)
    .join(" ");

  const specLines = showOnlineLink
    ? conciseSpecLines(product.specLines)
    : product.specLines;

  return (
    <div className={layoutClass}>
      <header className={styles.productTopBand}>
        <p className={styles.kicker}>{sectionLabel}</p>
        <div className={styles.productTopRow}>
          <span className={styles.sectionSubPill}>{subLabel}</span>
          <span className={styles.specSkuInline}>{product.sku}</span>
        </div>
        <h2 className={styles.specName}>{product.name}</h2>
        <p className={styles.specDesc}>
          {truncate(product.description, 72)}
        </p>
      </header>

      <div className={styles.productVisualPane}>
        <div className={styles.specMediaSquare}>
          <SafeImage
            src={product.image}
            alt={product.imageAlt}
            fill
            className={styles.specImage}
            fallbackKind="collection"
            sizes={imageSizes}
          />
        </div>
      </div>

      <div className={styles.productSpecPane}>
        <dl className={styles.specTable}>
          {specLines.map((line) => (
            <div key={line.label}>
              <dt>{line.label}</dt>
              <dd>{line.value}</dd>
            </div>
          ))}
        </dl>
        {showOnlineLink ? (
          <Link href={product.productPath} className={styles.specLink}>
            Full specifications online
          </Link>
        ) : (
          <p className={styles.specUrl}>{product.productUrl}</p>
        )}
      </div>
    </div>
  );
}
