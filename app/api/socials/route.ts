// Aggregation route — social follower counts for Hero card
// Fetches YouTube subs, Instagram followers, Ghost member count in parallel.
// Revalidates every hour.

export const revalidate = 3600;

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

async function fetchYouTubeSubs(): Promise<string> {
  const key = process.env.YOUTUBE_API_KEY;
  const id = process.env.YOUTUBE_CHANNEL_ID;
  if (!key || !id) return "";
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${key}`,
    { cache: "force-cache", next: { revalidate } }
  );
  const data = await res.json();
  const count = Number(data.items?.[0]?.statistics?.subscriberCount ?? 0);
  return count ? fmt(count) : "";
}

async function fetchInstagramFollowers(): Promise<string> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return "";
  const res = await fetch(
    `https://graph.instagram.com/v21.0/${userId}?fields=followers_count&access_token=${token}`,
    { cache: "force-cache", next: { revalidate } }
  );
  const data = await res.json();
  const count = Number(data.followers_count ?? 0);
  return count ? fmt(count) : "";
}

async function fetchGhostMembers(): Promise<string> {
  const url = process.env.GHOST_URL;
  const key = process.env.GHOST_CONTENT_API_KEY;
  if (!url || !key) return "";
  // Ghost doesn't expose member count in the Content API.
  // Use the settings endpoint which includes member_count for public Ghost sites.
  const res = await fetch(
    `${url}/ghost/api/content/settings/?key=${key}`,
    { cache: "force-cache", next: { revalidate } }
  );
  const data = await res.json();
  // member_count may not always be public; fall back gracefully.
  const count = Number(data.settings?.members_count ?? 0);
  return count ? fmt(count) : "";
}

export async function GET() {
  const [youtube, instagram, email] = await Promise.allSettled([
    fetchYouTubeSubs(),
    fetchInstagramFollowers(),
    fetchGhostMembers(),
  ]);

  return Response.json({
    youtube: youtube.status === "fulfilled" ? youtube.value : "",
    instagram: instagram.status === "fulfilled" ? instagram.value : "",
    email: email.status === "fulfilled" ? email.value : "",
  });
}
