# Strapi content gaps — Oviron storefront

The Next.js app loads **`POST /api/home`** (with `marketing`) and **`POST /api/site`** (`brand: "oviron"`). Anything missing is filled from `lib/storefront/fallbacks.ts` (same copy as the old static site).

At dev server start, the console logs how many gaps were detected. Runtime list: `ResolvedStorefront.contentGaps` from `loadStorefrontContent()`.

## Checklist (paths the app expects in Strapi)

| Path | What to add |
|------|-------------|
| `home.marketing` | Whole marketing object (see seed below) |
| `home.products` + `home.categories` | Catalogue seed (20 SKUs — use your PIA / mock-catalog) |
| `site.brand` | Name, tagline, legal name |
| `site.assets.logoFull` / `logoIcon` / `favicon` | Absolute image URLs + alt |
| `site.contact` | WhatsApp, email, LinkedIn |
| `site.announcement.items` | Top bar labels |
| `site.shareDefaults` | OG title + description |

### `home.marketing` seed (paste into Strapi)

Replace image `url` values with your Strapi uploads (absolute URLs).

```json
{
  "version": 1,
  "introSplash": {
    "enabled": true,
    "pre": "Leather footwear sourcing",
    "title": "Oviron",
    "tagline": "Where the luxury ends.",
    "durationMs": 2800
  },
  "hero": {
    "eyebrow": "Footwear sourcing & supply",
    "title": "Crafted for distinction.",
    "titleAccent": "Built for the world.",
    "copy": "B2B leather footwear sourcing, wholesale supply, and private-label opportunities.",
    "highlights": [
      { "label": "Wholesale sourcing", "sortOrder": 1 },
      { "label": "Export enquiries", "sortOrder": 2 }
    ],
    "ctaPrimary": { "label": "Get a Quote", "href": "#contact" },
    "ctaSecondary": { "label": "View Catalogue", "href": "/catalogue" },
    "slideIntervalMs": 5000,
    "slides": [
      { "sortOrder": 1, "image": { "url": "https://YOUR_CDN/hero-1.jpg", "alt": "Leather footwear sourcing showcase" } },
      { "sortOrder": 2, "image": { "url": "https://YOUR_CDN/hero-2.jpg", "alt": "Leather collection" } },
      { "sortOrder": 3, "image": { "url": "https://YOUR_CDN/hero-3.jpg", "alt": "Editorial footwear" } }
    ]
  },
  "campaignBanner": {
    "enabled": true,
    "eyebrow": "Campaign · Studio shoot",
    "title": "Your campaign headline",
    "hint": "Optional hint under title",
    "ariaLabel": "Campaign banner",
    "video": {
      "url": "https://YOUR_CDN/campaign.mp4",
      "mime": "video/mp4",
      "poster": { "url": "https://YOUR_CDN/campaign-poster.jpg", "alt": "Campaign poster" }
    },
    "fallbackImage": { "url": "https://YOUR_CDN/campaign-poster.jpg", "alt": "Campaign banner" }
  },
  "gallery": {
    "sectionTitle": "Gallery",
    "sectionSubtitle": "Representative styles and materials",
    "items": [
      { "id": "g1", "title": "Formal line", "sortOrder": 1, "span": "feature", "image": { "url": "https://YOUR_CDN/g1.jpg", "alt": "Formal footwear" } }
    ]
  },
  "approach": {
    "eyebrow": "Our approach",
    "title": "Partnerships begin with clarity.",
    "lead": "Structured discussions before quotation.",
    "steps": [
      { "n": "01", "title": "Product-Led", "copy": "Category, material, finish, and market.", "sortOrder": 1 },
      { "n": "02", "title": "Grade Clarity", "copy": "Internal grade and tolerances agreed upfront.", "sortOrder": 2 },
      { "n": "03", "title": "Buyer-First", "copy": "Virtual alignment on requirements and next steps.", "sortOrder": 3 }
    ],
    "image": { "url": "https://YOUR_CDN/approach.jpg", "alt": "Formal leather footwear" }
  },
  "privateLabel": {
    "eyebrow": "Private label",
    "title": "Your brand. Your vision.",
    "lead": "Customization discussed subject to supplier feasibility.",
    "points": [
      { "label": "Custom design", "sortOrder": 1 },
      { "label": "Materials & colors", "sortOrder": 2 },
      { "label": "Packaging", "sortOrder": 3 },
      { "label": "MOQ & samples", "sortOrder": 4 }
    ],
    "image": { "url": "https://YOUR_CDN/private-label.jpg", "alt": "Private-label footwear" }
  },
  "faq": {
    "items": [
      { "id": "q1", "sortOrder": 1, "question": "What footwear can you source?", "answer": "Formal, business, casual, loafers, driving, sneakers, occasion, and festival styles — confirmed per product." },
      { "id": "q2", "sortOrder": 2, "question": "Private-label branding?", "answer": "Yes, subject to feasibility, MOQ, and approval." },
      { "id": "q3", "sortOrder": 3, "question": "Minimum order quantity?", "answer": "Depends on style, supplier, and customization — enquire for your product." }
    ]
  },
  "testimonials": {
    "items": [
      {
        "id": "t1",
        "sortOrder": 1,
        "audience": "client",
        "quote": "Clear grading and responsive communication on our wholesale program.",
        "attribution": "Footwear buyer · EU",
        "rating": 5,
        "verified": true,
        "tags": ["Wholesale"]
      }
    ]
  },
  "buyerProcess": {
    "eyebrow": "Process",
    "title": "A straightforward way forward.",
    "lead": "A clear path for wholesale and private-label enquiries.",
    "steps": [
      { "id": "s1", "title": "Share brief", "copy": "Category, qty, destination", "sortOrder": 1 },
      { "id": "s2", "title": "Align specs", "copy": "Materials, grade, branding", "sortOrder": 2 },
      { "id": "s3", "title": "Meet virtually", "copy": "Clarify terms & requirements", "sortOrder": 3 },
      { "id": "s4", "title": "Review proposal", "copy": "Quote, samples, shipping", "sortOrder": 4 }
    ]
  },
  "qualityGrades": {
    "eyebrow": "Grades",
    "title": "Options for different needs.",
    "lead": "Internal supplier labels — agreed per product before order.",
    "disclaimer": "Labels vary by supplier — condition and tolerances confirmed per SKU.",
    "grades": [
      { "id": "a-plus", "label": "A+", "sortOrder": 1 },
      { "id": "a", "label": "A", "sortOrder": 2 },
      { "id": "b-plus", "label": "B+", "sortOrder": 3 },
      { "id": "b", "label": "B", "sortOrder": 4 },
      { "id": "c-plus", "label": "C+", "sortOrder": 5 },
      { "id": "c", "label": "C", "sortOrder": 6 }
    ]
  },
  "footerBlurb": "Leather footwear sourcing, wholesale & private-label enquiries."
}
```

**Full FAQ copy** (items `q4`–`q12`): use `lib/faq.ts` in the repo — same text as the live fallback.

**Full gallery set**: use `lib/gallery.ts` (8+ tiles with `id`, `title`, `span`, image URLs).

### `site` seed (`POST /api/site`)

```json
{
  "site": {
    "version": 1,
    "brand": {
      "slug": "oviron",
      "name": "Oviron",
      "legalName": "Oviron Global Trade",
      "logoTagline": "Global Trade, Import, Export",
      "tagline": "Where the luxury ends.",
      "description": "B2B leather footwear sourcing, wholesale supply, and private-label coordination.",
      "skuPrefix": "OV"
    },
    "assets": {
      "logoFull": { "url": "https://YOUR_CDN/logo-full.svg", "alt": "Oviron wordmark" },
      "logoIcon": { "url": "https://YOUR_CDN/logo-icon.svg", "alt": "Oviron emblem" },
      "favicon": { "url": "https://YOUR_CDN/favicon.png", "alt": "Oviron" }
    },
    "contact": {
      "whatsappNumber": "+1234567890",
      "businessEmail": "buyers@example.com",
      "linkedInUrl": "https://www.linkedin.com/company/your-page"
    },
    "announcement": {
      "enabled": true,
      "items": [
        { "label": "B2B Footwear Sourcing", "sortOrder": 1 },
        { "label": "Wholesale", "sortOrder": 2 },
        { "label": "Private Label", "sortOrder": 3 }
      ]
    },
    "shareDefaults": {
      "ogTitle": "Oviron | B2B Leather Footwear Sourcing, Wholesale & Private Label",
      "ogDescription": "B2B leather footwear sourcing, wholesale supply, and private-label coordination."
    }
  }
}
```

## Catalog / products

Until Strapi returns products on `home` and `POST /api/catalog`, the in-memory catalogue stays **empty** (mock is disabled). Seed:

- `home.categories` — 5 main categories from your PIA
- `home.products` — paginated list
- Per-category `POST /api/catalog` nested response **or** flat catalog contract
- `POST /api/product` with `{ "brand": "oviron", "sku": "OV-..." }` or `{ "product": "<id>" }`

Reference SKUs: `lib/catalog/mock-catalog.ts`.

## Wired in the UI (all use `useStorefront()`)

Intro splash, announcement bar, hero, campaign banner, gallery, approach, private label, FAQ, testimonials, buyer process, grades, footer blurb, brand lockup, contact channels, WhatsApp FAB, enquiry form.

Env vars (`NEXT_PUBLIC_WHATSAPP_NUMBER`, etc.) still work as **fallback** when Strapi contact fields are empty.
