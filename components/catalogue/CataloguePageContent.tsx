import Link from "next/link";
import type {
  CatalogueBookPage,
  ProductLayoutVariant,
} from "@/lib/catalog/build-catalogue-pages";
import type { CatalogueProductEntry } from "@/lib/catalog/build-catalogue-document";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/contact";
import { brandLogo } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import BrandLockup from "../BrandLockup";
import SafeImage from "../SafeImage";
import styles from "./CatalogueBook.module.css";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

const CLOSING_STEPS = [
  {
    title: "Share your brief",
    detail: "Target assortment, MOQ, grades, and destination market.",
  },
  {
    title: "Align specifications",
    detail: "Materials, construction, labelling, and packaging per SKU.",
  },
  {
    title: "Confirm program terms",
    detail: "Sampling, production timeline, and export documentation.",
  },
] as const;

function catalogueEnquiryMessage(brandName: string): string {
  return [
    `Hi ${brandName},`,
    "",
    `I reviewed your ${siteConfig.catalogueTitle} and would like to discuss a program.`,
    "",
    "Company:",
    "Assortment / categories:",
    "Estimated MOQ:",
    "Destination:",
  ].join("\n");
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
  /** Eager-load images for flipbook and off-screen PDF export stack. */
  const imagePriority = true;
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
        <article
          className={`${pageClass} ${styles.pageCover} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <div className={styles.coverTopBand}>
            <p className={styles.brochureEyebrowLight}>Oviron Legacy</p>
            <h1 className={styles.coverBandTitle}>{siteConfig.catalogueTitle}</h1>
            <p className={styles.coverBandEdition}>{page.edition}</p>
          </div>
          <div className={styles.coverStack}>
            <header className={styles.coverBrandBlock}>
              <SafeImage
                src={brandLogo.icon}
                alt=""
                width={56}
                height={56}
                className={styles.coverLogoImg}
                fallbackKind="hero"
                sizes="56px"
                priority={imagePriority}
              />
              <BrandLockup variant="cover" asLink={false} />
            </header>

            <p className={styles.coverTaglineSecondary}>{page.tagline}</p>

            <div className={styles.coverHero}>
              <SafeImage
                src={page.heroImage}
                alt=""
                fill
                className={styles.coverHeroImg}
                fallbackKind="hero"
                sizes={imageSizes}
                priority={imagePriority}
              />
            </div>

            <p className={styles.coverMeta}>
              {page.productCount} Published Styles · B2B Wholesale &amp;
              Private Label
            </p>
          </div>
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "welcome":
      return (
        <article
          className={`${pageClass} ${styles.pageWelcome} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <div className={`${styles.brochureHeroBand} ${styles.brochureHeroBandIntro}`}>
            <span className={styles.brochureStepNum} aria-hidden>
              01
            </span>
            <div className={styles.brochureHeroCopy}>
              <p className={styles.brochureEyebrowLight}>Introduction</p>
              <h2 className={styles.brochureHeroTitle}>
                Welcome to {page.brandName}
              </h2>
            </div>
          </div>
          <div className={styles.brochureBody}>
            <p className={styles.leadCopy}>{page.description}</p>
            <ul className={styles.brochureHighlights}>
              <li>
                <span className={styles.highlightMark} aria-hidden />
                Wholesale supply &amp; export programs
              </li>
              <li>
                <span className={styles.highlightMark} aria-hidden />
                Private label &amp; specification alignment
              </li>
              <li>
                <span className={styles.highlightMark} aria-hidden />
                Published SKU library for sourcing teams
              </li>
            </ul>
            <p className={styles.bodyCopyMuted}>
              Edition {page.edition}. Every specification in this catalogue is
              indicative for sourcing discussions — final terms are confirmed
              per enquiry and destination market.
            </p>
          </div>
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "toc":
      return (
        <article
          className={`${pageClass} ${styles.pageToc} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <div className={`${styles.brochureHeroBand} ${styles.brochureHeroBandToc}`}>
            <span className={styles.brochureStepNum} aria-hidden>
              02
            </span>
            <div className={styles.brochureHeroCopy}>
              <p className={styles.brochureEyebrowLight}>Overview</p>
              <h2 className={styles.brochureHeroTitle}>Table of contents</h2>
            </div>
          </div>
          <div className={styles.brochureBodyToc}>
            <ol className={styles.tocList}>
              {page.items.map((item, index) => (
                <li key={item.id} className={styles.tocCard}>
                  <span className={styles.tocIndex} aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.tocCardMain}>
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
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "section":
      return (
        <article
          className={`${pageClass} ${styles.pageSection} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <div className={styles.sectionHero}>
            <SafeImage
              src={page.heroImage}
              alt={page.heroAlt}
              fill
              className={styles.sectionHeroImg}
              fallbackKind="collection"
              sizes={imageSizes}
              priority={imagePriority}
            />
            <div className={styles.sectionHeroOverlay}>
              <p className={styles.kicker}>Collection</p>
              <h2 className={styles.sectionTitle}>{page.label}</h2>
            </div>
            <div className={styles.sectionColorRail} aria-hidden />
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
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "products":
      return (
        <article
          className={`${pageClass} ${styles.pageProducts} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <ul className={styles.productSpecList}>
            {page.products.map((product) => (
              <li key={product.id}>
                <ProductSpecSheet
                  product={product}
                  sectionLabel={page.sectionLabel}
                  subLabel={page.subLabel}
                  layoutVariant={page.layoutVariant}
                  imageSizes={imageSizes}
                  showOnlineLink={isScreen}
                />
              </li>
            ))}
          </ul>
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "categorySpotlight":
      return (
        <article
          className={`${pageClass} ${styles.pageSpotlight} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <header className={styles.productHeaderBand}>
            <div className={styles.productHeaderLeft}>
              <span className={styles.productHeaderCategory}>
                {page.sectionLabel}
              </span>
            </div>
            <div className={styles.productHeaderCenter}>
              <h2 className={styles.specName}>{page.subLabel}</h2>
              <p className={styles.specDesc}>Collection highlight</p>
            </div>
            <span className={styles.productHeaderPill}>{page.subLabel}</span>
          </header>
          <div className={styles.spotlightHero}>
            <SafeImage
              src={page.heroImage}
              alt={page.heroAlt}
              fill
              className={styles.spotlightHeroImg}
              fallbackKind="collection"
              sizes={imageSizes}
              priority={imagePriority}
            />
          </div>
          <div className={styles.spotlightDescription}>
            <p className={styles.spotlightNames}>
              {page.featuredNames.join(" · ")}
            </p>
            <p className={styles.spotlightBody}>{page.description}</p>
          </div>
          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );

    case "closing": {
      const enquiryBody = catalogueEnquiryMessage(page.brandName);
      const mailHref = buildMailtoUrl(
        `${page.brandName} — Catalogue enquiry`,
        enquiryBody
      );
      const whatsappHref = buildWhatsAppUrl(enquiryBody);
      const siteBase = siteConfig.domain.trim().replace(/\/$/, "");
      const contactPath = siteBase ? `${siteBase}/#contact` : null;

      return (
        <article
          className={`${pageClass} ${styles.pageClosing} ${styles.brochurePage}`}
          data-page={pageNumber}
        >
          <div
            className={`${styles.brochureHeroBand} ${styles.brochureHeroBandClosing}`}
          >
            <span className={styles.brochureStepNum} aria-hidden>
              03
            </span>
            <div className={styles.brochureHeroCopy}>
              <p className={styles.brochureEyebrowLight}>Next steps</p>
              <h2 className={styles.brochureHeroTitle}>
                Work with {page.brandName}
              </h2>
            </div>
          </div>

          <div className={styles.closingMain}>
            <p className={styles.leadCopy}>
              Thank you for reviewing our {siteConfig.catalogueTitle.toLowerCase()}
              . When you are ready, send a brief and our team will respond with
              specification options and export-ready documentation aligned to your
              program.
            </p>

            <ol className={styles.closingSteps}>
              {CLOSING_STEPS.map((step, index) => (
                <li key={step.title} className={styles.closingStep}>
                  <span className={styles.closingStepNum} aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.closingStepCopy}>
                    <p className={styles.closingStepTitle}>{step.title}</p>
                    <p className={styles.closingStepDetail}>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.closingCta}>
              <div className={styles.closingCtaBrand}>
                <SafeImage
                  src={brandLogo.icon}
                  alt=""
                  width={44}
                  height={44}
                  className={styles.closingCtaLogo}
                  fallbackKind="hero"
                  sizes="44px"
                  priority={imagePriority}
                />
                <div>
                  <p className={styles.closingCtaEyebrow}>Get in touch</p>
                  <p className={styles.closingCtaLead}>
                    Start a wholesale or private-label conversation.
                  </p>
                </div>
              </div>
              <div className={styles.closingCtaActions}>
                {mailHref ? (
                  <a className={styles.closingCtaBtn} href={mailHref}>
                    Email enquiry
                  </a>
                ) : null}
                {whatsappHref ? (
                  <a
                    className={`${styles.closingCtaBtn} ${styles.closingCtaBtnSecondary}`}
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {isScreen ? (
                  <Link className={styles.closingCtaLink} href="/#contact">
                    Contact form
                  </Link>
                ) : contactPath ? (
                  <a className={styles.closingCtaLink} href={contactPath}>
                    Contact form
                  </a>
                ) : null}
                {!mailHref && !whatsappHref ? (
                  <p className={styles.closingCtaPlaceholder}>
                    Add business email or WhatsApp in site configuration to enable
                    one-click enquiry links on this page.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <footer className={styles.closingBrandBand}>
            <p className={styles.brochureEyebrowLight}>{page.logoTagline}</p>
            <p className={styles.closingBrandLine}>
              {siteConfig.tagline}
            </p>
            <p className={styles.closingBrandEdition}>Edition {page.edition}</p>
          </footer>

          <div className={styles.pageSpineEdge} aria-hidden />
          {footer}
        </article>
      );
    }

    default:
      return null;
  }
}

type CatalogueDetailItem = { label: string; value: string };

function specValue(
  lines: CatalogueProductEntry["specLines"],
  label: string
): string {
  return lines.find((line) => line.label === label)?.value?.trim() || "—";
}

function catalogueDetailList(
  product: CatalogueProductEntry,
  lines: CatalogueProductEntry["specLines"],
  showOnlineLink: boolean
): CatalogueDetailItem[] {
  const descMax = showOnlineLink ? 220 : 360;
  return [
    { label: "Sizes", value: truncate(specValue(lines, "Sizes"), 72) },
    {
      label: "Material",
      value: truncate(specValue(lines, "Upper / material"), 72),
    },
    {
      label: "Pattern",
      value: truncate(
        specValue(lines, "Construction") !== "—"
          ? specValue(lines, "Construction")
          : specValue(lines, "Colors"),
        72
      ),
    },
    {
      label: "Description",
      value: truncate(product.description, descMax),
    },
  ];
}

const EXTRA_SPEC_ORDER = [
  "Typical use",
  "Packaging",
  "Grades",
  "Private label",
  "Colors",
] as const;

function extraSpecBlocks(
  lines: CatalogueProductEntry["specLines"],
  showOnlineLink: boolean
): CatalogueProductEntry["specLines"] {
  const source = showOnlineLink ? conciseSpecLines(lines) : lines;
  const skip = new Set([
    "Sizes",
    "Upper / material",
    "Construction",
  ]);
  const picked = EXTRA_SPEC_ORDER.map((label) =>
    source.find((line) => line.label === label)
  ).filter((line): line is NonNullable<typeof line> => Boolean(line));

  const extras = [
    ...picked,
    ...source.filter(
      (line) => !skip.has(line.label) && !picked.some((p) => p.label === line.label)
    ),
  ];
  while (extras.length < 4) {
    extras.push({ label: "Notes", value: "—" });
  }
  return extras.slice(0, 4);
}

function ProductSpecSheet({
  product,
  sectionLabel,
  subLabel,
  layoutVariant,
  imageSizes,
  showOnlineLink,
}: {
  product: CatalogueProductEntry;
  sectionLabel: string;
  subLabel: string;
  layoutVariant: ProductLayoutVariant;
  imageSizes: string;
  showOnlineLink: boolean;
}) {
  const detailItems = catalogueDetailList(
    product,
    product.specLines,
    showOnlineLink
  );
  const extraBlocks = extraSpecBlocks(product.specLines, showOnlineLink);

  return (
    <div className={styles.productSheet}>
      <header className={styles.productHeaderBand}>
        <div className={styles.productHeaderLeft}>
          <span className={styles.productHeaderCategory}>{sectionLabel}</span>
          <span className={styles.productHeaderSkuBadge}>{product.sku}</span>
        </div>
        <div className={styles.productHeaderCenter}>
          <h2 className={styles.specName}>{product.name}</h2>
          <p className={styles.specDesc}>
            {truncate(product.description, 64)}
          </p>
        </div>
        <span className={styles.productHeaderPill}>{subLabel}</span>
      </header>

      <ProductLayoutBody
        variant={layoutVariant}
        product={product}
        imageSizes={imageSizes}
        detailItems={detailItems}
        extraBlocks={extraBlocks}
        categoryLine={product.categoryLine}
      />

      <div className={styles.productSheetFoot}>
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

function SpecBlock({
  line,
  className,
  rail = "none",
}: {
  line: CatalogueProductEntry["specLines"][number];
  className?: string;
  rail?: "left" | "right" | "none";
}) {
  const railClass =
    rail === "left"
      ? styles.specBlockRailLeft
      : rail === "right"
        ? styles.specBlockRailRight
        : "";
  return (
    <div className={[styles.specBlock, railClass, className].filter(Boolean).join(" ")}>
      <span className={styles.specBlockLabel}>{line.label}</span>
      <p className={styles.specBlockValue}>{line.value}</p>
    </div>
  );
}

function ProductImageTile({
  src,
  alt,
  imageSizes,
  className,
}: {
  src: string;
  alt: string;
  imageSizes: string;
  className?: string;
}) {
  return (
    <div className={[styles.specMediaSquare, className].filter(Boolean).join(" ")}>
      <SafeImage
        src={src}
        alt={alt}
        fill
        className={styles.specImage}
        fallbackKind="collection"
        sizes={imageSizes}
        priority
      />
    </div>
  );
}

function ProductImagePair({
  product,
  imageSizes,
  className,
  stack = false,
  fillColumn = false,
}: {
  product: CatalogueProductEntry;
  imageSizes: string;
  className?: string;
  stack?: boolean;
  fillColumn?: boolean;
}) {
  const secondary =
    product.images.find((url) => url && url !== product.image) ??
    product.images[1] ??
    product.image;

  return (
    <div
      className={[
        styles.imagePair,
        stack ? styles.imagePairStack : "",
        fillColumn ? styles.imagePairFill : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ProductImageTile
        src={product.image}
        alt={product.imageAlt}
        imageSizes={imageSizes}
      />
      <ProductImageTile
        src={secondary}
        alt={`${product.imageAlt} — alternate view`}
        imageSizes={imageSizes}
      />
    </div>
  );
}

function ProductDetailList({
  items,
  className,
  compact = false,
}: {
  items: CatalogueDetailItem[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <ul
      className={[
        styles.detailList,
        compact ? styles.detailListCompact : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className={item.label === "Description" ? styles.detailListDescRow : ""}
        >
          <span className={styles.detailListKey}>{item.label}</span>
          <span className={styles.detailListVal}>{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

function ProductExtraGrid({
  blocks,
  className,
}: {
  blocks: CatalogueProductEntry["specLines"];
  className?: string;
}) {
  return (
    <div className={[styles.productExtraGrid, className].filter(Boolean).join(" ")}>
      {blocks.map((line) => (
        <SpecBlock key={line.label} line={line} rail="left" />
      ))}
    </div>
  );
}

function ProductLayoutBody({
  variant,
  product,
  imageSizes,
  detailItems,
  extraBlocks,
  categoryLine,
}: {
  variant: ProductLayoutVariant;
  product: CatalogueProductEntry;
  imageSizes: string;
  detailItems: CatalogueDetailItem[];
  extraBlocks: CatalogueProductEntry["specLines"];
  categoryLine: string;
}) {
  switch (variant) {
    case 1:
      return (
        <div className={`${styles.productMain} ${styles.layoutV1}`}>
          <div className={styles.layoutV1Hero}>
            <ProductImagePair
              product={product}
              imageSizes={imageSizes}
              className={`${styles.layoutV1Images} ${styles.catalogueProductImages}`}
              stack
              fillColumn
            />
            <ProductDetailList
              items={detailItems}
              className={styles.layoutV1List}
            />
          </div>
          <p className={styles.productCategoryLine}>{categoryLine}</p>
          <ProductExtraGrid blocks={extraBlocks} />
        </div>
      );
    case 2:
      return (
        <div className={`${styles.productMain} ${styles.layoutV2}`}>
          <ProductDetailList
            items={detailItems}
            className={styles.layoutV2List}
            compact
          />
          <div className={styles.layoutV2Hero}>
            <ProductImagePair
              product={product}
              imageSizes={imageSizes}
              className={`${styles.layoutV2Images} ${styles.catalogueProductImages}`}
            />
          </div>
          <p className={styles.productCategoryLine}>{categoryLine}</p>
          <ProductExtraGrid blocks={extraBlocks} />
        </div>
      );
    case 3:
      return (
        <div className={`${styles.productMain} ${styles.layoutV3}`}>
          <div className={styles.layoutV3Hero}>
            <ProductDetailList
              items={detailItems}
              className={styles.layoutV3List}
            />
            <ProductImagePair
              product={product}
              imageSizes={imageSizes}
              className={`${styles.layoutV3Images} ${styles.catalogueProductImages}`}
              stack
              fillColumn
            />
          </div>
          <p className={styles.productCategoryLine}>{categoryLine}</p>
          <ProductExtraGrid blocks={extraBlocks} />
        </div>
      );
    case 4:
    default:
      return (
        <div className={`${styles.productMain} ${styles.layoutV4}`}>
          <ProductDetailList
            items={detailItems}
            className={styles.layoutV4List}
          />
          <ProductImagePair
            product={product}
            imageSizes={imageSizes}
            className={`${styles.layoutV4Images} ${styles.catalogueProductImages}`}
          />
          <p className={styles.productCategoryLine}>{categoryLine}</p>
          <ProductExtraGrid blocks={extraBlocks} />
        </div>
      );
  }
}
