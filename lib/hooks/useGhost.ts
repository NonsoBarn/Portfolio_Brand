"use client";

import { useState, useEffect } from "react";
import { BLOG_POSTS } from "@/lib/data";

interface GhostPost {
  featured: boolean;
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  num: string;
  url?: string;
}

export function useGhost() {
  const [posts, setPosts] = useState<GhostPost[]>(BLOG_POSTS.map((p) => ({ ...p, url: "#" })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ghost")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && json.posts?.length) {
          setPosts(json.posts);
        }
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}
