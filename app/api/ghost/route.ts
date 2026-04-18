// Ghost Content API — blog posts + member count
// Revalidates every hour.

const GHOST_URL = process.env.GHOST_URL;
const CONTENT_KEY = process.env.GHOST_CONTENT_API_KEY;

export const revalidate = 3600;

export async function GET() {
  if (!GHOST_URL || !CONTENT_KEY) {
    return Response.json({ error: "Ghost env vars not configured" }, { status: 503 });
  }

  try {
    const postsRes = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${CONTENT_KEY}&limit=5&fields=title,excerpt,published_at,tags,reading_time,url,featured`,
      { cache: "force-cache", next: { revalidate } }
    );
    const postsData = await postsRes.json();

    const formatMeta = (post: {
      published_at?: string;
      reading_time?: number;
    }) => {
      if (!post.published_at) return "";
      const d = new Date(post.published_at);
      const month = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      return `${month} · ${post.reading_time ?? 5} min`;
    };

    const posts = (postsData.posts ?? []).map(
      (
        post: {
          title?: string;
          excerpt?: string;
          published_at?: string;
          reading_time?: number;
          url?: string;
          featured?: boolean;
          tags?: Array<{ name: string }>;
        },
        i: number
      ) => ({
        featured: post.featured ?? i === 0,
        tag: post.tags?.[0]?.name ?? "Blog",
        title: post.title ?? "",
        excerpt: post.excerpt ?? "",
        meta: formatMeta(post),
        num: String(i + 1).padStart(2, "0"),
        url: post.url ?? "#",
      })
    );

    return Response.json({ posts, count: posts.length });
  } catch (err) {
    console.error("[api/ghost]", err);
    return Response.json({ error: "Failed to fetch Ghost data" }, { status: 500 });
  }
}
