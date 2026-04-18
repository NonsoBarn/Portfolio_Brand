// Spotify — fetch tracks from a specific playlist
// Uses refresh token flow so it works for private playlists too.
// Revalidates daily.

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID;

export const dynamic = "force-dynamic";

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN! }),
    cache: "no-store",
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !PLAYLIST_ID) {
    return Response.json({ error: "Spotify playlist env vars not configured" }, { status: 503 });
  }

  try {
    const token = await getAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("[api/spotify/playlist] Spotify error:", res.status, errBody);
      return Response.json({ error: "Failed to fetch playlist", status: res.status, detail: errBody }, { status: res.status });
    }

    const data = await res.json();
    const fmt = (ms: number) => {
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };

    type RawItem = { item?: { name: string; artists: { name: string }[]; album: { name: string }; duration_ms: number; external_urls?: { spotify?: string }; uri: string } };
    const rawItems: RawItem[] = data.items?.items ?? [];

    const tracks = rawItems
      .filter((i) => i.item)
      .map((i) => ({
        title: i.item!.name,
        artist: i.item!.artists.map((a) => a.name).join(", "),
        album: i.item!.album.name,
        duration: fmt(i.item!.duration_ms),
        progress: 0,
        url: i.item!.external_urls?.spotify ?? null,
        uri: i.item!.uri,
      }));

    return Response.json({ tracks });
  } catch (err) {
    console.error("[api/spotify/playlist]", err);
    return Response.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}
