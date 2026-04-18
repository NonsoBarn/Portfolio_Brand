// Spotify Web API — currently playing track
// No cache: real-time data. Falls back to null when nothing is playing.

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

export const dynamic = "force-dynamic";

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return Response.json({ isPlaying: false, error: "Spotify env vars not configured" }, { status: 503 });
  }

  try {
    const accessToken = await getAccessToken();
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // 204 = nothing playing
    if (res.status === 204 || res.status > 400) {
      return Response.json({ isPlaying: false });
    }

    const track = await res.json();

    if (!track || !track.item) {
      return Response.json({ isPlaying: false });
    }

    const progress = track.progress_ms ?? 0;
    const duration = track.item.duration_ms ?? 1;
    const progressPct = Math.round((progress / duration) * 100);

    const fmt = (ms: number) => {
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };

    return Response.json({
      isPlaying: track.is_playing,
      title: track.item.name,
      artist: track.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: track.item.album.name,
      albumArt: track.item.album.images?.[0]?.url ?? null,
      trackUrl: track.item.external_urls?.spotify ?? null,
      progress: progressPct,
      elapsed: fmt(progress),
      total: fmt(duration),
    });
  } catch (err) {
    console.error("[api/spotify]", err);
    return Response.json({ isPlaying: false, error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}
