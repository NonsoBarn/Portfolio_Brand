// Hashnode GraphQL API — all posts (lightweight, for archive view)

const HOST = process.env.HASHNODE_PUBLICATION_HOST;
const GQL = "https://gql.hashnode.com";

export const revalidate = 3600;

const QUERY = `
  query GetAllPosts($host: String!) {
    publication(host: $host) {
      posts(first: 50) {
        edges {
          node {
            title
            slug
            publishedAt
            readTimeInMinutes
            tags { name }
          }
        }
      }
    }
  }
`;

type RawPost = {
  title: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  tags: { name: string }[];
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
    const edges: { node: RawPost }[] = data?.publication?.posts?.edges ?? [];

    const posts = edges.map(({ node }) => ({
      title: node.title,
      slug: node.slug,
      publishedAt: node.publishedAt,
      readTimeInMinutes: node.readTimeInMinutes,
      tag: node.tags?.[0]?.name ?? "Engineering",
    }));

    return Response.json({ posts });
  } catch (err) {
    console.error("[api/hashnode/all]", err);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
