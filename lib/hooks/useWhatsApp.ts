"use client";

import { useState, useEffect } from "react";

interface WhatsAppData {
  memberCount: number;
  memberCountFormatted: string;
}

export function useWhatsApp() {
  const [data, setData] = useState<WhatsAppData>({
    memberCount: 12000,
    memberCountFormatted: "12.0K+",
  });

  useEffect(() => {
    fetch("/api/whatsapp")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return data;
}
