import Link from "next/link";
import type { CatalogueDocument } from "@/lib/catalog/build-catalogue-document";
import CatalogueProductGallery from "./CatalogueProductGallery";
import styles from "./CatalogueView.module.css";

type CatalogueViewProps = {
  document: CatalogueDocument;
};

export default function CatalogueView({ document: doc }: CatalogueViewProps) {
  return (
    <article
      className={styles.document}
      aria-label="Product catalogue"
      data-catalogue-export
    >
      <header className={styles.cover}>
        <p className={styles.coverEyebrow}>Manufacturing catalogue</p>
        <h1 className={styles.coverTitle}>{doc.brandName}</h1>
        <p className={styles.coverTagline}>{doc.logoTagline}</p>
        <p className={styles.coverLead}>{doc.description}</p>
        <dl className={styles.coverMeta}>
          <div>
            <dt>Edition</dt>
            <dd>{doc.generatedLabel}</dd>
          </div>
          <div>
            <dt>Styles listed</dt>
            <dd>{doc.productCount}</dd>
          </div>
          <div>
            <dt>Categories</dt>
            <dd>{doc.sections.length}</dd>
          </div>
        </dl>
      </header>

      <nav className={styles.toc} aria-label="Catalogue contents">
        <h2>Contents</h2>
        <ol>
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a href={`#catalogue-${section.id}`}>
                {section.label}
                <span className={styles.tocCount}>{section.productCount}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {doc.sections.map((section) => (
        <section
          key={section.id}
          id={`catalogue-${section.id}`}
          className={styles.mainSection}
          aria-labelledby={`heading-${section.id}`}
        >
          <header className={styles.sectionHead}>
            <h2 id={`heading-${section.id}`}>{section.label}</h2>
            {section.subtitle ? <p>{section.subtitle}</p> : null}
          </header>

          {section.subsections.map((sub) => (
            <div key={sub.id} className={styles.subSection}>
              <h3 className={styles.subHead}>{sub.label}</h3>
              {sub.description ? (
                <p className={styles.subLead}>{sub.description}</p>
              ) : null}

              <ul className={styles.productList}>
                {sub.products.map((product) => (
                  <li key={product.id} className={styles.productRow}>
                    <CatalogueProductGallery
                      images={product.images}
                      alt={product.imageAlt}
                      productName={product.name}
                    />
                    <div className={styles.productBody}>
                      <p className={styles.productSku}>{product.sku}</p>
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productCategory}>
                        {product.categoryLine}
                      </p>
                      <p className={styles.productDesc}>{product.description}</p>
                      <dl className={styles.specGrid}>
                        {product.specLines.map((line) => (
                          <div key={line.label}>
                            <dt>{line.label}</dt>
                            <dd>{line.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className={styles.productLink}>
                        <span className={styles.screenOnly}>
                          <Link href={product.productPath}>View online</Link>
                        </span>
                        <span className={styles.printOnly}>{product.productUrl}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <footer className={styles.docFooter}>
        <p>
          {doc.brandName} — {doc.logoTagline}. Specifications and commercial terms
          are confirmed per enquiry.
        </p>
        <p className={styles.docFooterSmall}>
          Generated {doc.generatedLabel} · B2B wholesale &amp; private label
        </p>
      </footer>
    </article>
  );
}
