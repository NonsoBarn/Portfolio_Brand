"use client";

import { useState, useEffect } from "react";
import { HERO_CARD_SOCIALS } from "@/lib/data";

type Socials = typeof HERO_CARD_SOCIALS;

export function useHeroSocials() {
  const [socials, setSocials] = useState<Socials>(HERO_CARD_SOCIALS);

  useEffect(() => {
    fetch("/api/socials")
      .then((r) => r.json())
      .then((json) => {
        setSocials((prev) =>
          prev.map((s) => {
            if (s.p === "YouTube" && json.youtube) return { ...s, n: json.youtube };
            if (s.p === "IG" && json.instagram) return { ...s, n: json.instagram };
            if (s.p === "Email" && json.email) return { ...s, n: json.email };
            return s;
          })
        );
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return socials;
}
