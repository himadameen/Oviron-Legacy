"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, contactConfigured } from "@/lib/contact";
import { useStorefront } from "./StorefrontProvider";
import styles from "./FloatingWhatsApp.module.css";

export default function FloatingWhatsApp() {
  const { site } = useStorefront();
  const contact = site.contact ?? {};
  const ready = contactConfigured("whatsapp", contact);
  const href =
    (ready &&
      buildWhatsAppUrl(
        "Hello Oviron — I would like to connect with your team for a footwear quote.",
        contact.whatsappNumber
      )) ||
    "#contact";

  return (
    <a
      href={href}
      className={styles.fab}
      aria-label={ready ? "Chat on WhatsApp" : "Go to quote form"}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className={styles.pulse} aria-hidden />
      <MessageCircle size={26} strokeWidth={1.5} />
      <span className={styles.label}>Quote</span>
    </a>
  );
}
