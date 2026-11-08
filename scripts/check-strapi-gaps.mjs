import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Dynamic import via tsx transpile - inline gap check (mirror content-gaps.ts)
function gaps(home, siteRes) {
  const gaps = [];
  const push = (path, ok, note) => {
    if (!ok) gaps.push({ path, note });
  };
  const m = home?.marketing;
  const site = siteRes?.site;
  if (!m) gaps.push({ path: "home.marketing", note: "missing" });
  push("marketing.hero.slides", Boolean(m?.hero?.slides?.some((s) => s.image?.url?.trim())), "hero slides");
  push("marketing.campaignBanner", Boolean(m?.campaignBanner?.video?.url?.trim() || m?.campaignBanner?.fallbackImage?.url?.trim()), "banner media");
  push("marketing.gallery.items", Boolean(m?.gallery?.items?.length), "gallery");
  push("marketing.approach.steps", Boolean(m?.approach?.steps?.length), "approach steps");
  push("marketing.approach.image", Boolean(m?.approach?.image?.url?.trim()), "approach image");
  push("marketing.privateLabel.points", Boolean(m?.privateLabel?.points?.length), "PL points");
  push("marketing.faq.items", Boolean(m?.faq?.items?.length), "faq");
  push("marketing.testimonials.items", Boolean(m?.testimonials?.items?.length), "testimonials");
  push("marketing.buyerProcess.steps", Boolean(m?.buyerProcess?.steps?.length), "buyer process");
  push("marketing.qualityGrades.grades", Boolean(m?.qualityGrades?.grades?.length), "grades");
  push("site.assets.logoFull", Boolean(site?.assets?.logoFull?.url?.trim()), "logo full");
  push("site.assets.logoIcon", Boolean(site?.assets?.logoIcon?.url?.trim()), "logo icon");
  push("home.products", Boolean(home?.products?.length), "products");
  return gaps;
}

const base = process.env.STRAPI_URL || "http://localhost:1337";
const post = async (path, body) => {
  const r = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} ${r.status}`);
  return r.json();
};

const home = await post("/api/home", { brand: "oviron", page: 1, pageSize: 8 });
const site = await post("/api/site", { brand: "oviron" });
const list = gaps(home, site);
const m = home.marketing;
const s = site.site;

const detail = {
  heroSlides: m?.hero?.slides?.length ?? 0,
  heroSlideUrls: m?.hero?.slides?.filter((x) => x.image?.url)?.length ?? 0,
  galleryItems: m?.gallery?.items?.length ?? 0,
  faqItems: m?.faq?.items?.length ?? 0,
  testimonials: m?.testimonials?.items?.length ?? 0,
  approachSteps: m?.approach?.steps?.length ?? 0,
  approachImage: Boolean(m?.approach?.image?.url),
  privateLabelPoints: m?.privateLabel?.points?.length ?? 0,
  buyerSteps: m?.buyerProcess?.steps?.length ?? 0,
  grades: m?.qualityGrades?.grades?.length ?? 0,
  campaignVideo: Boolean(m?.campaignBanner?.video?.url),
  campaignPoster: Boolean(m?.campaignBanner?.fallbackImage?.url),
  productsPage1: home.products?.length ?? 0,
  productsTotal: home.pagination?.total ?? null,
  categories: home.categories?.length ?? 0,
  logoFull: Boolean(s?.assets?.logoFull?.url),
  logoIcon: Boolean(s?.assets?.logoIcon?.url),
  favicon: Boolean(s?.assets?.favicon?.url),
  contactWhatsapp: s?.contact?.whatsappNumber?.includes("X") ? "placeholder" : Boolean(s?.contact?.whatsappNumber),
};

console.log(JSON.stringify({ gaps: list, detail, gapCount: list.length }, null, 2));
if (list.length) {
  console.error("\nStrapi still missing:", list.map((g) => g.path).join(", "));
  process.exitCode = 1;
}
