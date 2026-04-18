// Hashnode GraphQL API — single post by slug (full content)

const HOST = process.env.HASHNODE_PUBLICATION_HOST;
const GQL = "https://gql.hashnode.com";

export const revalidate = 3600;

const QUERY = `
  query GetPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        title
        publishedAt
        readTimeInMinutes
        tags { name }
        coverImage { url }
        content { html }
      }
    }
  }
`;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!HOST) {
    return Response.json({ error: "HASHNODE_PUBLICATION_HOST not configured" }, { status: 503 });
  }

  const { slug } = await params;

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { host: HOST, slug } }),
      next: { revalidate },
    });

    const { data } = await res.json();
    const post = data?.publication?.post;

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({
      title: post.title,
      publishedAt: post.publishedAt,
      readTimeInMinutes: post.readTimeInMinutes,
      tag: post.tags?.[0]?.name ?? "Engineering",
      coverImage: post.coverImage?.url ?? null,
      content: post.content?.html ?? "",
    });
  } catch (err) {
    console.error("[api/hashnode/slug]", err);
    return Response.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
