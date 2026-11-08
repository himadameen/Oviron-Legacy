import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  StrapiCatalogResponse,
  StrapiHomeResponse,
  StrapiProductDetail,
  StrapiSiteResponse,
  StrapiStatsResponse,
} from "@/lib/api/strapi-types";
import { getStrapiBaseUrl } from "@/lib/strapi-server";

const BRAND = "oviron";

export type HomeRequest = {
  brand?: string;
  page?: number;
  pageSize?: number;
};

export type CatalogRequest = {
  brand?: string;
  category: string;
  page?: number;
  pageSize?: number;
  subCategory?: string;
};

export type ProductRequest = {
  brand?: string;
  sku?: string;
  product?: string;
};

export type StatsRequest = {
  brand?: string;
};

export const strapiApi = createApi({
  reducerPath: "strapiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getStrapiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Home", "Site", "Catalog", "Product", "Stats"],
  endpoints: (builder) => ({
    getSite: builder.query<StrapiSiteResponse, { brand?: string } | void>({
      query: (arg) => ({
        url: "/api/site",
        method: "POST",
        body: { brand: arg?.brand ?? BRAND },
      }),
      providesTags: [{ type: "Site", id: "LIST" }],
    }),
    getHome: builder.query<StrapiHomeResponse, HomeRequest | void>({
      query: (arg) => ({
        url: "/api/home",
        method: "POST",
        body: {
          brand: arg?.brand ?? BRAND,
          page: arg?.page ?? 1,
          pageSize: arg?.pageSize ?? 8,
        },
      }),
      providesTags: [{ type: "Home", id: "LIST" }],
    }),
    getCatalog: builder.query<StrapiCatalogResponse, CatalogRequest>({
      query: (arg) => {
        const body: Record<string, unknown> = {
          brand: arg.brand ?? BRAND,
          category: arg.category,
        };
        if (arg.page != null) body.page = arg.page;
        if (arg.pageSize != null) body.pageSize = arg.pageSize;
        if (arg.subCategory) body.subCategory = arg.subCategory;

        return {
          url: "/api/catalog",
          method: "POST",
          body,
        };
      },
      providesTags: (_result, _err, arg) => [
        { type: "Catalog", id: `${arg.category}:${arg.subCategory ?? ""}` },
      ],
    }),
    getProduct: builder.query<StrapiProductDetail, ProductRequest>({
      query: (arg) => ({
        url: "/api/product",
        method: "POST",
        body: {
          brand: arg.brand ?? BRAND,
          ...(arg.sku ? { sku: arg.sku } : {}),
          ...(arg.product ? { product: arg.product } : {}),
        },
      }),
      providesTags: (_result, _err, arg) => [
        { type: "Product", id: arg.sku ?? arg.product ?? "unknown" },
      ],
    }),
    getStats: builder.query<StrapiStatsResponse, StatsRequest | void>({
      query: (arg) => ({
        url: "/api/stats",
        method: "POST",
        body: { brand: arg?.brand ?? BRAND },
      }),
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),
  }),
});

export const {
  useGetHomeQuery,
  useGetSiteQuery,
  useGetCatalogQuery,
  useGetProductQuery,
  useGetStatsQuery,
} = strapiApi;
