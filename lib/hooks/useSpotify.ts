"use client";

import { useState, useEffect } from "react";
import { INSTAGRAM_SPOTIFY } from "@/lib/data";

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  trackUrl: string | null;
  progress: number;
  elapsed: string;
  total: string;
}

export function useSpotify() {
  const [data, setData] = useState<SpotifyData>({
    isPlaying: false,
    ...INSTAGRAM_SPOTIFY,
    albumArt: null,
    trackUrl: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const poll = () => {
      fetch("/api/spotify")
        .then((r) => r.json())
        .then((json) => {
          if (!json.error) setData(json);
        })
        .catch(() => {/* keep static fallback */})
        .finally(() => setLoading(false));
    };

    poll();
    // Re-poll every 30s to keep progress bar fresh
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  return { ...data, loading };
}
