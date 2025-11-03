"use client";

import { FavoritesProvider } from "@/lib/favorites-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}
