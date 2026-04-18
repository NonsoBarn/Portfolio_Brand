"use client";

import { useState, useEffect } from "react";
import { SHOP_PRODUCTS } from "@/lib/data";

interface GumroadProduct {
  id?: string;
  title: string;
  desc: string;
  price: string;
  salesCount?: number;
  url?: string;
  n: string;
  // Static-only fields kept for visual compatibility
  vis?: string;
  badge?: string | null;
  type?: string;
  typeLabel?: string;
  sub?: string;
}

export function useGumroad() {
  const [products, setProducts] = useState<GumroadProduct[]>(SHOP_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gumroad")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && json.products?.length) {
          // Merge live price/url into static product shells (preserve vis/badge/type styling)
          const merged = SHOP_PRODUCTS.map((staticP, i) => {
            const live = json.products[i];
            if (!live) return staticP;
            return { ...staticP, price: live.price, url: live.url, salesCount: live.salesCount, id: live.id };
          });
          setProducts(merged);
        }
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
