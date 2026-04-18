// Triggers playback of a track URI on a specific Spotify device
export const dynamic = "force-dynamic";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

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

export async function POST(request: Request) {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const { uris, offset, deviceId } = await request.json();
  if (!uris?.length || !deviceId) {
    return Response.json({ error: "uris and deviceId required" }, { status: 400 });
  }

  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris, offset: { position: offset ?? 0 } }),
      cache: "no-store",
    }
  );

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    return Response.json({ error: err }, { status: res.status });
  }

  return Response.json({ success: true });
}
