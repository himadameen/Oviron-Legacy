"use client";

import { Mail, MessageCircle } from "lucide-react";
import { buildMailtoUrl, buildWhatsAppUrl, contactConfigured } from "@/lib/contact";
import SectionReveal from "./SectionReveal";
import { useStorefront } from "./StorefrontProvider";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  const { site } = useStorefront();
  const contact = site.contact ?? {};
  const whatsappHref =
    (contactConfigured("whatsapp", contact) &&
      buildWhatsAppUrl(
        "Hello Oviron — quote request for footwear sourcing.",
        contact.whatsappNumber
      )) ||
    "#contact";

  const mailHref = contactConfigured("email", contact)
    ? buildMailtoUrl(
        "OVIRON — Quote",
        "Hello Oviron,\n\nI would like a footwear sourcing quote.\n",
        contact.businessEmail
      )
    : "#contact";

  const linkedInHref = contactConfigured("linkedin", contact)
    ? (contact.linkedInUrl ?? "#contact")
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
