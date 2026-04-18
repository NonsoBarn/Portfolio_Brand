// YouTube Data API v3 — channel stats + recent videos
// Revalidates weekly (604800s). Data shape mirrors lib/data.ts YouTube exports.

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const BASE = "https://www.googleapis.com/youtube/v3";

export const revalidate = 604800; // 1 week

export async function GET() {
  if (!API_KEY || !CHANNEL_ID) {
    return Response.json({ error: "YouTube env vars not configured" }, { status: 503 });
  }

  try {
    // 1. Channel stats (subscriber count)
    const channelRes = await fetch(
      `${BASE}/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`,
      { cache: "force-cache", next: { revalidate } }
    );
    const channelData = await channelRes.json();
    const stats = channelData.items?.[0]?.statistics ?? {};
    const subCount = Number(stats.subscriberCount ?? 0);
    const subs = subCount >= 1000 ? `${(subCount / 1000).toFixed(1)}K` : String(subCount);

    // 2. Latest 7 videos (1 featured + 6 grid)
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=7&key=${API_KEY}`,
      { cache: "force-cache", next: { revalidate } }
    );
    const searchData = await searchRes.json();
    const items = searchData.items ?? [];
    const videoIds = items.map((v: { id: { videoId: string } }) => v.id.videoId).join(",");

    // 3. Video details (view counts + duration)
    const detailRes = await fetch(
      `${BASE}/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`,
      { cache: "force-cache", next: { revalidate } }
    );
    const detailData = await detailRes.json();
    const details = detailData.items ?? [];

    const formatDuration = (iso: string) => {
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return "0:00";
      const h = Number(match[1] ?? 0);
      const m = Number(match[2] ?? 0);
      const s = Number(match[3] ?? 0);
      const mm = String(m).padStart(h ? 2 : 1, "0");
      const ss = String(s).padStart(2, "0");
      return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const formatViews = (n: string) => {
      const v = Number(n ?? 0);
      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M views`;
      if (v >= 1000) return `${(v / 1000).toFixed(0)}K views`;
      return `${v} views`;
    };

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const [featuredDetail, ...gridDetails] = details;

    const featured = featuredDetail
      ? {
          cat: featuredDetail.snippet?.tags?.[0] ?? "Video",
          title: featuredDetail.snippet?.title ?? "",
          desc: featuredDetail.snippet?.description?.slice(0, 200) ?? "",
          views: formatViews(featuredDetail.statistics?.viewCount),
          duration: formatDuration(featuredDetail.contentDetails?.duration ?? ""),
          date: formatDate(featuredDetail.snippet?.publishedAt ?? ""),
          subs,
          videoId: featuredDetail.id,
        }
      : null;

    const videos = gridDetails.slice(0, 6).map((v: {
      id: string;
      snippet?: { title?: string; tags?: string[] };
      statistics?: { viewCount?: string };
      contentDetails?: { duration?: string };
    }) => ({
      cat: v.snippet?.tags?.[0] ?? "Video",
      title: v.snippet?.title ?? "",
      dur: formatDuration(v.contentDetails?.duration ?? ""),
      views: formatViews(v.statistics?.viewCount ?? "0").replace(" views", ""),
      videoId: v.id,
    }));

    return Response.json({ featured, videos, subs });
  } catch (err) {
    console.error("[api/youtube]", err);
    return Response.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}
