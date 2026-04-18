"use client";

import { useState, useEffect } from "react";
import { BLOG_POSTS } from "@/lib/data";

interface HashnodePost {
  featured: boolean;
  tag: string;
  title: string;
  excerpt: string;
  meta: string;
  num: string;
  url?: string;
  slug?: string;
  coverImage?: string | null;
}

export function useHashnode() {
  const [posts, setPosts] = useState<HashnodePost[]>(BLOG_POSTS.map((p) => ({ ...p, url: "#" })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hashnode")
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
