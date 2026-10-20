"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { isContactConfigured } from "@/lib/site-config";
import styles from "./FloatingWhatsApp.module.css";

export default function FloatingWhatsApp() {
  const ready = isContactConfigured("whatsapp");
  const href =
    (ready &&
      buildWhatsAppUrl(
        "Hello Oviron — I would like to connect with your team for a footwear quote."
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
