// Hashnode GraphQL API — blog posts
// Revalidates every hour.

const HOST = process.env.HASHNODE_PUBLICATION_HOST;
const GQL = "https://gql.hashnode.com";

export const revalidate = 3600;

const QUERY = `
  query GetPosts($host: String!) {
    publication(host: $host) {
      posts(first: 5) {
        edges {
          node {
            title
            brief
            url
            slug
            publishedAt
            readTimeInMinutes
            tags { name }
            featured
            coverImage { url }
          }
        }
      }
    }
  }
`;

type HashnodePost = {
  title: string;
  brief: string;
  url: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  tags: { name: string }[];
  featured: boolean;
  coverImage?: { url: string };
};

export async function GET() {
  if (!HOST) {
    return Response.json({ error: "HASHNODE_PUBLICATION_HOST not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { host: HOST } }),
      next: { revalidate },
    });

    const { data } = await res.json();
    const edges: { node: HashnodePost }[] = data?.publication?.posts?.edges ?? [];

    const fmt = (publishedAt: string, readTime: number) => {
      const d = new Date(publishedAt);
      const month = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      return `${month} · ${readTime ?? 5} min`;
    };

    const posts = edges.map(({ node }, i) => ({
      featured: node.featured ?? i === 0,
      tag: node.tags?.[0]?.name ?? "Engineering",
      title: node.title ?? "",
      excerpt: node.brief ?? "",
      meta: fmt(node.publishedAt, node.readTimeInMinutes),
      num: String(i + 1).padStart(2, "0"),
      url: node.url ?? "#",
      slug: node.slug ?? "",
      coverImage: node.coverImage?.url ?? null,
    }));

    return Response.json({ posts, count: posts.length });
  } catch (err) {
    console.error("[api/hashnode]", err);
    return Response.json({ error: "Failed to fetch Hashnode data" }, { status: 500 });
  }
}
