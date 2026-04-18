"use client";

import { useState, useEffect } from "react";

interface YouTubeFeatured {
  videoId?: string;
  cat: string;
  title: string;
  desc: string;
  date: string;
  views: string;
  duration: string;
  subs: string;
}

interface YouTubeVideo {
  videoId?: string;
  cat: string;
  title: string;
  views: string;
  dur: string;
}

interface YouTubeData {
  featured: YouTubeFeatured | null;
  videos: YouTubeVideo[];
  subs: string;
  loading: boolean;
}

export function useYouTube(): YouTubeData {
  const [data, setData] = useState<YouTubeData>({
    featured: null,
    videos: [],
    subs: "—",
    loading: true,
  });

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && json.featured) {
          setData({ featured: json.featured, videos: json.videos ?? [], subs: json.subs, loading: false });
        } else {
          setData((d) => ({ ...d, loading: false }));
        }
      })
      .catch(() => setData((d) => ({ ...d, loading: false })));
  }, []);

  return data;
}
