# Oviron — Leather Footwear Sourcing & Export

Premium B2B digital showroom for leather footwear sourcing, wholesale supply, private-label discussions, and international buyer enquiries. Built with **Next.js (App Router)**, **React**, and **TypeScript**.

This is **not** an e-commerce site — there is no cart, checkout, or server-side lead storage. The enquiry form opens **WhatsApp** or your **email client** with a prepared message.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

---

## Configuration (required before launch)

Copy `.env.example` to `.env.local` and set verified values:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, Open Graph, sitemap, and ad campaign landing pages (e.g. `https://www.oviron.com`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, international format (no `+` required), e.g. `919876543210` |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Verified business inbox |
| `NEXT_PUBLIC_LINKEDIN_URL` | Full LinkedIn company or representative profile URL |

Until these are set, contact links show placeholders and CTAs scroll to the enquiry form with setup instructions.

### Business placeholders to confirm

- [ ] Production domain (`NEXT_PUBLIC_SITE_URL`)
- [ ] WhatsApp business number
- [ ] Business email
- [ ] LinkedIn profile URL
- [ ] Replace illustrative Unsplash photography in `lib/collections.ts`, `Hero`, `OvironApproach`, and `PrivateLabel` with licensed or Oviron-owned assets
- [ ] Review all copy with legal/commercial teams before campaigns

---

## SEO & marketing campaigns

The site is structured for organic search and paid campaigns:

- **Metadata**: title, description, keywords, canonical URL, Open Graph, Twitter cards
- **Dynamic OG/Twitter images**: `app/opengraph-image.tsx`
- **Structured data** (JSON-LD): Organization, WebSite, ProfessionalService, FAQPage
- **`app/sitemap.ts`** and **`app/robots.ts`** (sitemap URL uses `NEXT_PUBLIC_SITE_URL`)

**Campaign checklist**

1. Set `NEXT_PUBLIC_SITE_URL` to your live domain before running ads (matches canonical + OG URLs).
2. Use UTM parameters on ad URLs as usual — the single-page layout preserves hash links (`#collections`, `#contact`).
3. Prefill category enquiries: `https://your-domain.com/?category=Loafers#contact`
4. After launch, submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
5. Do not enable analytics in code until you choose a provider and update privacy copy if needed.

---

## Project structure

```
app/
  layout.tsx          # Fonts, global SEO, JSON-LD
  page.tsx            # Single-page section assembly
  globals.css         # Design tokens & utilities
  sitemap.ts / robots.ts / opengraph-image.tsx
components/           # Section components (Header, Hero, FAQ, etc.)
lib/
  site-config.ts      # Env-based business settings
  contact.ts          # WhatsApp / mailto message builders
  collections.ts      # Category grid data & images
  faq.ts              # FAQ content
  json-ld.ts          # Structured data helpers
public/images/        # Replace with your photography
```

---

## Replacing photography

1. Add optimized WebP/JPEG files under `public/images/`.
2. Update `lib/collections.ts` to use local paths, e.g. `/images/formal-footwear.webp`.
3. Update hero/approach/private-label `Image` `src` in the relevant components.
4. Keep descriptive `alt` text; do not label stock or reference shots as verified Oviron inventory unless they are.

Use `next/image` with appropriate `width`, `height`, and `sizes` for performance.

---

## Deployment

Deploy to any Next.js-compatible host (Vercel, Netlify, Node server, etc.):

1. Set environment variables in the hosting dashboard (same as `.env.local`).
2. Run `npm run build` in CI or let the platform build from the repo.
3. Point your domain and verify HTTPS (required for SEO and secure referrer data from campaigns).

---

## Trust & accuracy

Copy follows sourcing/supply wording and avoids unverified claims (factories, certifications, fixed MOQ, export markets, etc.). Internal grades **A+ … C** are presented as supplier-defined labels, not universal quality standards.

---

## License

Proprietary — Oviron. Illustrative third-party images remain subject to their respective licenses until replaced.
