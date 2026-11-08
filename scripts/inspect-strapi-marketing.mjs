const base = process.env.STRAPI_URL || "http://localhost:1337";

const post = async (path, body) => {
  const r = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
};

const home = await post("/api/home", { brand: "oviron", page: 1, pageSize: 8 });
const site = await post("/api/site", { brand: "oviron" });
const m = home.marketing;

const slice = {
  hero: {
    keys: m?.hero ? Object.keys(m.hero) : null,
    slides: m?.hero?.slides,
    highlights: m?.hero?.highlights,
  },
  campaignBanner: m?.campaignBanner,
  approach: {
    steps: m?.approach?.steps?.length,
    image: m?.approach?.image,
    keys: m?.approach ? Object.keys(m.approach) : null,
  },
  siteAssets: site?.site?.assets,
  testimonialsCount: m?.testimonials?.items?.length,
};

console.log(JSON.stringify(slice, null, 2));
