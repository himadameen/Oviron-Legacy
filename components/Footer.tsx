"use client";

import { Linkedin, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppUrl, contactConfigured } from "@/lib/contact";
import { footerNav } from "@/lib/routes";
import BrandLockup from "./BrandLockup";
import { useStorefront } from "./StorefrontProvider";
import styles from "./Footer.module.css";

export default function Footer() {
  const { marketing, site } = useStorefront();
  const contact = site.contact ?? {};
  const year = new Date().getFullYear();
  const whatsappHref = contactConfigured("whatsapp", contact)
    ? buildWhatsAppUrl(
        "Hello Oviron — footwear sourcing enquiry.",
        contact.whatsappNumber
      )
  : null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <div className={styles.brand}>
            <BrandLockup variant="footer" />
          </div>
          <p className={styles.blurb}>
            {marketing.footerBlurb ??
              "Leather footwear sourcing, wholesale & private-label enquiries."}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className={styles.navTitle}>Explore</p>
          <ul>
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={styles.navTitle}>Connect</p>
          <ul className={styles.social}>
            <li>
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              ) : (
                <span className={styles.placeholder}>
                  <MessageCircle size={16} /> [WHATSAPP_NUMBER]
                </span>
              )}
            </li>
            <li>
              {contactConfigured("email", contact) ? (
                <a href={`mailto:${contact.businessEmail}`}>
                  <Mail size={16} /> {contact.businessEmail}
                </a>
              ) : (
                <span className={styles.placeholder}>
                  <Mail size={16} /> [BUSINESS_EMAIL]
                </span>
              )}
            </li>
            <li>
              {contactConfigured("linkedin", contact) ? (
                <a
                  href={contact.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              ) : (
                <span className={styles.placeholder}>
                  <Linkedin size={16} /> [LINKEDIN_URL]
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copy}>
            © {year} {site.brand?.name ?? "Oviron"}. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            Product availability, specifications, internal grades, MOQ, pricing,
            and commercial terms are confirmed individually.
          </p>
        </div>
      </div>
    </footer>
  );
}
