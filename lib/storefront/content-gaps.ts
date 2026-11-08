import type { StrapiHomeResponse, StrapiSiteResponse } from "@/lib/api/strapi-types";
import { fallbackMarketing, fallbackSite } from "./fallbacks";

export type ContentGap = {
  /** Dot path under `marketing` or `site` in Strapi */
  path: string;
  status: "missing" | "empty" | "placeholder";
  note: string;
};

function push(
  gaps: ContentGap[],
  path: string,
  ok: boolean,
  note: string,
  status: ContentGap["status"] = "missing"
) {
  if (!ok) gaps.push({ path, status, note });
}

/** CMS fields still served from local fallbacks — paste values into Strapi. */
export function listStrapiContentGaps(
  home: StrapiHomeResponse | null,
  siteRes: StrapiSiteResponse | null
): ContentGap[] {
  const gaps: ContentGap[] = [];
  const m = home?.marketing;
  const site = siteRes?.site;

  if (!home) {
    gaps.push({
      path: "POST /api/home",
      status: "missing",
      note: "Home response unavailable — entire marketing block uses fallbacks.",
    });
  } else if (!m) {
    gaps.push({
      path: "home.marketing",
      status: "missing",
      note: "Add `marketing` object on home response.",
    });
  }

  if (!siteRes) {
    gaps.push({
      path: "POST /api/site",
      status: "missing",
      note: "Site response unavailable — logos/contact/announcement use fallbacks.",
    });
  } else if (!site) {
    gaps.push({
      path: "site",
      status: "missing",
      note: "Add `site` payload on /api/site response.",
    });
  }

  push(gaps, "marketing.introSplash", Boolean(m?.introSplash?.title), "Intro splash title");
  push(gaps, "marketing.hero.title", Boolean(m?.hero?.title), "Hero headline");
  push(
    gaps,
    "marketing.hero.slides",
    Boolean(m?.hero?.slides?.some((s) => s.image?.url?.trim())),
    "At least one hero slide image URL"
  );
  push(
    gaps,
    "marketing.campaignBanner",
    Boolean(
      m?.campaignBanner?.video?.url?.trim() ||
        m?.campaignBanner?.fallbackImage?.url?.trim()
    ),
    "Campaign video URL or fallback poster image"
  );
  push(
    gaps,
    "marketing.gallery.items",
    Boolean(m?.gallery?.items?.length),
    `Gallery tiles (${fallbackMarketing.gallery?.items?.length ?? 0} in fallback)`
  );
  push(
    gaps,
    "marketing.approach.steps",
    Boolean(m?.approach?.steps?.length),
    "Approach principles (3 steps)"
  );
  push(
    gaps,
    "marketing.approach.image",
    Boolean(m?.approach?.image?.url?.trim()),
    "Approach section image"
  );
  push(
    gaps,
    "marketing.privateLabel.points",
    Boolean(m?.privateLabel?.points?.length),
    "Private-label bullet points"
  );
  push(
    gaps,
    "marketing.faq.items",
    Boolean(m?.faq?.items?.length),
    `FAQ entries (${fallbackMarketing.faq?.items?.length ?? 0} in fallback)`
  );
  push(
    gaps,
    "marketing.testimonials.items",
    Boolean(m?.testimonials?.items?.length),
    "Buyer feedback / testimonials"
  );
  push(
    gaps,
    "marketing.buyerProcess.steps",
    Boolean(m?.buyerProcess?.steps?.length),
    "Buyer journey steps (4)"
  );
  push(
    gaps,
    "marketing.qualityGrades.grades",
    Boolean(m?.qualityGrades?.grades?.length),
    "Grade labels (A+ … C)"
  );
  push(gaps, "marketing.footerBlurb", Boolean(m?.footerBlurb?.trim()), "Footer blurb");

  push(gaps, "site.assets.logoFull", Boolean(site?.assets?.logoFull?.url?.trim()), "Full logo");
  push(gaps, "site.assets.logoIcon", Boolean(site?.assets?.logoIcon?.url?.trim()), "Icon / stamp logo");
  push(gaps, "site.contact.whatsappNumber", Boolean(site?.contact?.whatsappNumber?.trim()), "WhatsApp number");
  push(gaps, "site.contact.businessEmail", Boolean(site?.contact?.businessEmail?.trim()), "Business email");
  push(gaps, "site.contact.linkedInUrl", Boolean(site?.contact?.linkedInUrl?.trim()), "LinkedIn URL");
  push(
    gaps,
    "site.announcement.items",
    Boolean(site?.announcement?.items?.length),
    `Announcement bar labels (${fallbackSite.announcement?.items?.length ?? 0} in fallback)`
  );
  push(gaps, "site.shareDefaults.ogTitle", Boolean(site?.shareDefaults?.ogTitle?.trim()), "Default OG title");

  if (!home?.products?.length) {
    gaps.push({
      path: "home.products",
      status: "missing",
      note: "No products on home — catalogue and product pages need Strapi catalog seed.",
    });
  }
  if (!home?.categories?.length) {
    gaps.push({
      path: "home.categories",
      status: "missing",
      note: "No categories on home — navigation and catalogue filters need category seed.",
    });
  }

  return gaps;
}
