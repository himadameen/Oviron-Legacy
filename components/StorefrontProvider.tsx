"use client";

import { createContext, useContext, type ReactNode } from "react";
import { fallbackResolved } from "@/lib/storefront/fallbacks";
import type { ResolvedStorefront } from "@/lib/storefront/types";

const StorefrontContext = createContext<ResolvedStorefront>(fallbackResolved);

export function StorefrontProvider({
  value,
  children,
}: {
  value: ResolvedStorefront;
  children: ReactNode;
}) {
  return (
    <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
  );
}

export function useStorefront(): ResolvedStorefront {
  return useContext(StorefrontContext);
}
