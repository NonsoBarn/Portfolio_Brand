"use client";

import { useState, useEffect } from "react";

interface DiscordData {
  memberCount: number;
  memberCountFormatted: string;
}

export function useDiscord() {
  const [data, setData] = useState<DiscordData>({
    memberCount: 12400,
    memberCountFormatted: "12.4K+",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/discord")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}
