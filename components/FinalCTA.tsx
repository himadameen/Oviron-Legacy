"use client";

import { Mail, MessageCircle } from "lucide-react";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/contact";
import { isContactConfigured, siteConfig } from "@/lib/site-config";
import SectionReveal from "./SectionReveal";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  const whatsappHref =
    (isContactConfigured("whatsapp") &&
      buildWhatsAppUrl("Hello Oviron — quote request for footwear sourcing.")) ||
    "#contact";

  const mailHref = isContactConfigured("email")
    ? buildMailtoUrl("OVIRON — Quote", "Hello Oviron,\n\nI would like a footwear sourcing quote.\n")
    : "#contact";

  const linkedInHref = isContactConfigured("linkedin")
    ? siteConfig.linkedInUrl
    : "#contact";

  return (
    <section className={styles.section} aria-labelledby="final-cta-heading">
      <div className={`container ${styles.inner}`}>
        <SectionReveal>
          <p className={styles.eyebrow}>Partner with Oviron</p>
          <h2 id="final-cta-heading" className={styles.title}>
            Build the right footwear partnership.
          </h2>
          <div className={styles.actions}>
            <a
              href={whatsappHref ?? "#contact"}
              className={`btn ${styles.btnLight}`}
              {...(whatsappHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp Quote
            </a>
            <a href={mailHref ?? "#contact"} className="btn btnGoldOutline">
              <Mail size={16} aria-hidden />
              Email
            </a>
            <a
              href={linkedInHref}
              className="btn btnGoldOutline"
              {...(linkedInHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              LinkedIn
            </a>
          </div>
        </SectionReveal>
      </div>
      <div className={styles.texture} aria-hidden />
    </section>
  );
}
