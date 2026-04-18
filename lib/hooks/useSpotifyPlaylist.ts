"use client";

import { useState, useEffect } from "react";
import { ABOUT_PLAYLIST } from "@/lib/data";

export type PlaylistTrack = {
  title: string;
  artist: string;
  album: string;
  duration: string;
  progress: number;
  url?: string | null;
  uri?: string;
};

export function useSpotifyPlaylist() {
  const [tracks, setTracks] = useState<PlaylistTrack[]>(ABOUT_PLAYLIST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify/playlist")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && json.tracks?.length) setTracks(json.tracks);
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  return { tracks, loading };
}
