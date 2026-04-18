"use client";

import { useState, useEffect } from "react";
import { INSTAGRAM_GRID } from "@/lib/data";

interface InstagramPost {
  id?: string;
  type: string;
  likes: string;
  mediaUrl?: string | null;
  permalink?: string | null;
}

interface InstagramData {
  posts: InstagramPost[];
  followers: string;
}

export function useInstagram() {
  const [data, setData] = useState<InstagramData>({
    posts: INSTAGRAM_GRID,
    followers: "6.1K",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && json.posts?.length) {
          setData({ posts: json.posts, followers: json.followers });
        }
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}
