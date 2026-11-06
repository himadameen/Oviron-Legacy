"use client";

import { createContext, useContext } from "react";
import type { NormalizedCatalog } from "@/lib/catalog/types";

const empty: NormalizedCatalog = {
  mainCategories: [],
  products: [],
  productCount: 0,
};

const CatalogContext = createContext<NormalizedCatalog>(empty);

export function CatalogProvider({
  value,
  children,
}: {
  value: NormalizedCatalog;
  children: React.ReactNode;
}) {
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogContext(): NormalizedCatalog {
  return useContext(CatalogContext);
}
