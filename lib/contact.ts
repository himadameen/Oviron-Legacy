import { siteConfig } from "./site-config";

export type EnquiryPayload = {
  fullName: string;
  companyName?: string;
  businessEmail: string;
  destinationCountry: string;
  footwearCategory: string;
  preferredGrade?: string;
  estimatedQuantity?: string;
  privateLabel: string;
  targetPrice?: string;
  additionalRequirements?: string;
};

export function formatEnquiryMessage(
  payload: EnquiryPayload,
  prefix?: string
): string {
  const lines = [
    prefix ?? "OVIRON — Buyer Enquiry",
    "",
    `Name: ${payload.fullName}`,
    payload.companyName ? `Company: ${payload.companyName}` : null,
    `Email: ${payload.businessEmail}`,
    `Destination: ${payload.destinationCountry}`,
    `Category: ${payload.footwearCategory}`,
    payload.preferredGrade ? `Preferred grade: ${payload.preferredGrade}` : null,
    payload.estimatedQuantity
      ? `Estimated quantity: ${payload.estimatedQuantity}`
      : null,
    `Private label: ${payload.privateLabel}`,
    payload.targetPrice ? `Target price: ${payload.targetPrice}` : null,
    payload.additionalRequirements
      ? `Additional requirements:\n${payload.additionalRequirements}`
      : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string | null {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(
  subject: string,
  body: string
): string | null {
  if (!siteConfig.businessEmail) return null;
  return `mailto:${siteConfig.businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function categoryWhatsAppMessage(category: string): string {
  return formatEnquiryMessage(
    {
      fullName: "[Your name]",
      businessEmail: "[Your email]",
      destinationCountry: "[Destination country]",
      footwearCategory: category,
      privateLabel: "To be discussed",
    },
    `OVIRON — Enquiry: ${category}`
  );
}
