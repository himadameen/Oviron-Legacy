import type { LucideIcon } from "lucide-react";
import { Linkedin, Mail, MessageCircle } from "lucide-react";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  contactConfigured,
} from "@/lib/contact";
import type { StorefrontSitePayload } from "@/lib/api/storefront-types";

export type ContactChannelId = "whatsapp" | "email" | "linkedin";

export type ContactChannel = {
  id: ContactChannelId;
  title: string;
  description: string;
  icon: LucideIcon;
  primaryLabel: string;
  pendingLabel: string;
  primaryHref: string | null;
  ready: boolean;
};

const WHATSAPP_INTRO =
  "Hello Oviron — I would like a quote for leather footwear sourcing.";

export function contactChannelsForSite(
  contact: StorefrontSitePayload["contact"] = {}
): ContactChannel[] {
  return [
    {
      id: "whatsapp",
      title: "WhatsApp",
      description:
        "Fast quotes and brief clarifications on MOQ, grades, and timelines.",
      icon: MessageCircle,
      primaryLabel: "Open WhatsApp",
      pendingLabel: "Quote via form",
      ready: contactConfigured("whatsapp", contact),
      primaryHref: contactConfigured("whatsapp", contact)
        ? buildWhatsAppUrl(WHATSAPP_INTRO, contact?.whatsappNumber)
        : null,
    },
    {
      id: "email",
      title: "Email",
      description:
        "Formal enquiries with specs, destination, and quantity details.",
      icon: Mail,
      primaryLabel: "Send email",
      pendingLabel: "Quote via form",
      ready: contactConfigured("email", contact),
      primaryHref: contactConfigured("email", contact)
        ? buildMailtoUrl(
            "OVIRON — Quote Request",
            "Hello Oviron,\n\nI would like to discuss a footwear sourcing enquiry.\n",
            contact?.businessEmail
          )
        : null,
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      description:
        "Connect professionally for sourcing partnerships and updates.",
      icon: Linkedin,
      primaryLabel: "View on LinkedIn",
      pendingLabel: "Quote via form",
      ready: contactConfigured("linkedin", contact),
      primaryHref: contact?.linkedInUrl?.trim() ? contact.linkedInUrl : null,
    },
  ];
}
