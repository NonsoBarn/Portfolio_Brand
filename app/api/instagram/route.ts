// Instagram Graph API — recent media grid
// Note: Instagram Basic Display API was deprecated Dec 4 2024.
// This uses the new Instagram API with Instagram Login (long-lived access token).
// Revalidates every hour.

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID;

export const revalidate = 3600; // 1 hour

export async function GET() {
  if (!ACCESS_TOKEN || !USER_ID) {
    return Response.json({ error: "Instagram env vars not configured" }, { status: 503 });
  }

  try {
    // Fetch recent media (up to 9 posts for the grid)
    const mediaRes = await fetch(
      `https://graph.instagram.com/v21.0/${USER_ID}/media` +
        `?fields=id,media_type,like_count,media_url,thumbnail_url,permalink` +
        `&limit=9&access_token=${ACCESS_TOKEN}`,
      { cache: "force-cache", next: { revalidate } }
    );
    const mediaData = await mediaRes.json();

    // Fetch follower count via user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${USER_ID}` +
        `?fields=followers_count,media_count&access_token=${ACCESS_TOKEN}`,
      { cache: "force-cache", next: { revalidate } }
    );
    const profileData = await profileRes.json();

    const formatLikes = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
      return String(n);
    };

    const formatFollowers = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
      return String(n);
    };

    const posts = (mediaData.data ?? []).map((item: {
      id: string;
      media_type: string;
      like_count?: number;
      media_url?: string;
      thumbnail_url?: string;
      permalink?: string;
    }) => ({
      id: item.id,
      type: item.media_type === "VIDEO" ? "Reel" : "Post",
      likes: formatLikes(item.like_count ?? 0),
      mediaUrl: item.media_url ?? item.thumbnail_url ?? null,
      permalink: item.permalink ?? null,
    }));

    const followers = formatFollowers(profileData.followers_count ?? 0);

    return Response.json({ posts, followers });
  } catch (err) {
    console.error("[api/instagram]", err);
    return Response.json({ error: "Failed to fetch Instagram data" }, { status: 500 });
  }
}
