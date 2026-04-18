"use client";

import { useState, useEffect } from "react";

interface TelegramData {
  memberCount: number;
  memberCountFormatted: string;
}

export function useTelegram() {
  const [data, setData] = useState<TelegramData>({
    memberCount: 100,
    memberCountFormatted: "100",
  });

  useEffect(() => {
    fetch("/api/telegram")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return data;
}
