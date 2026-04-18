"use client";

import { useState, useEffect } from "react";
import { HERO_ACTIVITY_LEVELS } from "@/lib/data";

export function useGitHub() {
  const [activityLevels, setActivityLevels] = useState<number[]>(HERO_ACTIVITY_LEVELS);
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json.activityLevels) && json.activityLevels.length) {
          setActivityLevels(json.activityLevels);
        }
        if (typeof json.streak === "number") setStreak(json.streak);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return { activityLevels, streak };
}
