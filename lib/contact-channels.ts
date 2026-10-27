import type { LucideIcon } from "lucide-react";
import { Linkedin, Mail, MessageCircle } from "lucide-react";
import { buildMailtoUrl, buildWhatsAppUrl } from "./contact";
import { isContactConfigured, siteConfig } from "./site-config";

export type ContactChannelId = "whatsapp" | "email" | "linkedin";

export type ContactChannel = {
  id: ContactChannelId;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Shown when env / config link is available */
  primaryLabel: string;
  /** Shown when link is not configured yet */
  pendingLabel: string;
  getPrimaryHref: () => string | null;
  isReady: () => boolean;
};

const WHATSAPP_INTRO =
  "Hello Oviron — I would like a quote for leather footwear sourcing.";

export const contactChannels: ContactChannel[] = [
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Fast quotes and brief clarifications on MOQ, grades, and timelines.",
    icon: MessageCircle,
    primaryLabel: "Open WhatsApp",
    pendingLabel: "Quote via form",
    isReady: () => isContactConfigured("whatsapp"),
    getPrimaryHref: () => buildWhatsAppUrl(WHATSAPP_INTRO),
  },
  {
    id: "email",
    title: "Email",
    description: "Formal enquiries with specs, destination, and quantity details.",
    icon: Mail,
    primaryLabel: "Send email",
    pendingLabel: "Quote via form",
    isReady: () => isContactConfigured("email"),
    getPrimaryHref: () =>
      buildMailtoUrl(
        "OVIRON — Quote Request",
        "Hello Oviron,\n\nI would like to discuss a footwear sourcing enquiry.\n"
      ),
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Connect professionally for sourcing partnerships and updates.",
    icon: Linkedin,
    primaryLabel: "View on LinkedIn",
    pendingLabel: "Quote via form",
    isReady: () => isContactConfigured("linkedin"),
    getPrimaryHref: () =>
      siteConfig.linkedInUrl.trim() ? siteConfig.linkedInUrl : null,
  },
];

export const enquiryFormAnchor = "#enquiry-form";
