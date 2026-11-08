/** Storefront API contract (Strapi CMS-Legacy) — plain JSON, brand: oviron */

export type StorefrontPagination = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type StorefrontProductSpecs = {
  typicalUse?: string;
  upperMaterial?: string;
  lining?: string;
  soleType?: string;
  construction?: string;
  colorRuns?: string;
  gradeOptions?: string;
  privateLabel?: string;
  packaging?: string;
  sizes?: { eu?: string; uk?: string; us?: string };
};

export type StorefrontProductTagKey =
  | "recommended"
  | "fast_moving"
  | "most_likable"
  | "most_sale"
  | "trending"
  | "hot_sale"
  | "sold";

export type StorefrontMediaRef = {
  url: string;
  width?: number;
  height?: number;
  mime?: string;
  alt: string;
  urlSm?: string;
  urlLg?: string;
};

export type StorefrontLink = { label: string; href: string };

export type StorefrontVideoRef = {
  url?: string;
  mime?: string;
  poster?: StorefrontMediaRef;
};

export type StorefrontBrand = {
  slug?: string;
  name: string;
  legalName?: string;
  logoTagline?: string;
  tagline?: string;
  aboutBrand?: string;
  skuPrefix?: string;
  description?: string;
};

export type StorefrontCategory = {
  id: string;
  label: string;
  subtitle?: string;
  sortOrder?: number;
};

export type StorefrontSubcategory = {
  id: string;
  label: string;
  description?: string;
  sortOrder?: number;
  products?: StorefrontProduct[];
};

export type StorefrontProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  imageAlt: string;
  specs?: StorefrontProductSpecs;
  mainCategoryId?: string;
  subCategoryId?: string;
  subCategoryLabel?: string;
  quantityAvailable?: number;
  tags?: string[];
  isActive?: boolean;
};

export type StorefrontIntroSplash = {
  enabled?: boolean;
  pre?: string;
  title?: string;
  tagline?: string;
  durationMs?: number;
};

export type StorefrontHeroSlide = {
  sortOrder?: number;
  image?: StorefrontMediaRef;
};

export type StorefrontHero = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  copy?: string;
  highlights?: { label: string; sortOrder?: number }[];
  ctaPrimary?: StorefrontLink;
  ctaSecondary?: StorefrontLink;
  slides?: StorefrontHeroSlide[];
  slideIntervalMs?: number;
};

export type StorefrontCampaignBanner = {
  enabled?: boolean;
  eyebrow?: string;
  title?: string;
  hint?: string;
  ariaLabel?: string;
  video?: StorefrontVideoRef;
  fallbackImage?: StorefrontMediaRef;
};

export type StorefrontGalleryItem = {
  id: string;
  title?: string;
  sortOrder?: number;
  span?: "normal" | "wide" | "tall" | "feature";
  image?: StorefrontMediaRef;
};

export type StorefrontGallery = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  items?: StorefrontGalleryItem[];
};

export type StorefrontApproachBullet = { text: string; sortOrder?: number };

export type StorefrontApproach = {
  eyebrow?: string;
  title?: string;
  lead?: string;
  body?: string;
  bullets?: StorefrontApproachBullet[];
  image?: StorefrontMediaRef;
  steps?: { n: string; title: string; copy: string; sortOrder?: number }[];
};

export type StorefrontPrivateLabel = {
  eyebrow?: string;
  title?: string;
  lead?: string;
  body?: string;
  points?: { label: string; sortOrder?: number }[];
  image?: StorefrontMediaRef;
};

export type StorefrontFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
};

export type StorefrontTestimonial = {
  id: string;
  audience: "client" | "customer";
  quote: string;
  attribution: string;
  rating: number;
  tags?: string[];
  verified?: boolean;
  sortOrder?: number;
};

export type StorefrontBuyerStep = {
  id: string;
  title: string;
  copy: string;
  sortOrder?: number;
};

export type StorefrontGrade = {
  id: string;
  label: string;
  copy?: string;
  sortOrder?: number;
};

export type StorefrontMarketing = {
  version?: string;
  introSplash?: StorefrontIntroSplash;
  hero?: StorefrontHero;
  campaignBanner?: StorefrontCampaignBanner;
  gallery?: StorefrontGallery;
  approach?: StorefrontApproach;
  privateLabel?: StorefrontPrivateLabel;
  faq?: { items?: StorefrontFaqItem[] };
  testimonials?: { items?: StorefrontTestimonial[] };
  buyerProcess?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    steps?: StorefrontBuyerStep[];
  };
  qualityGrades?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    disclaimer?: string;
    grades?: StorefrontGrade[];
  };
  footerBlurb?: string;
};

export type StorefrontHomeResponse = {
  brand?: StorefrontBrand;
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  pagination?: StorefrontPagination;
  marketing?: StorefrontMarketing;
};

export type StorefrontSiteAssets = {
  logoFull?: StorefrontMediaRef;
  logoIcon?: StorefrontMediaRef;
  favicon?: StorefrontMediaRef;
  defaultShareImage?: StorefrontMediaRef;
};

export type StorefrontSiteContact = {
  whatsappNumber?: string;
  businessEmail?: string;
  linkedInUrl?: string;
};

export type StorefrontAnnouncementItem = { label: string; sortOrder?: number };

export type StorefrontSitePayload = {
  version?: string;
  brand?: StorefrontBrand;
  assets?: StorefrontSiteAssets;
  shareDefaults?: { ogTitle?: string; ogDescription?: string };
  contact?: StorefrontSiteContact;
  announcement?: { enabled?: boolean; items?: StorefrontAnnouncementItem[] };
};

export type StorefrontSiteResponse = {
  site: StorefrontSitePayload;
};

/** Nested catalog tree (no pagination) */
export type StorefrontNestedCatalogResponse = {
  categories: (StorefrontCategory & {
    subcategories?: StorefrontSubcategory[];
  })[];
};

export type StorefrontCatalogResponse = {
  category: StorefrontCategory;
  subcategories: StorefrontSubcategory[];
  products: StorefrontProduct[];
  pagination?: StorefrontPagination;
};

export type StorefrontProductDetailResponse = {
  category?: StorefrontCategory;
  subCategory?: StorefrontSubcategory;
  product: StorefrontProduct;
};

export type StorefrontStatsResponse = {
  brand?: Pick<StorefrontBrand, "slug" | "name">;
  totals: {
    activeProducts: number;
    mainCategories: number;
    subCategories: number;
  };
};
