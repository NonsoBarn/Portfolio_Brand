// Hashnode newsletter subscription
// Derives publication ID from HASHNODE_PUBLICATION_HOST automatically.

const GQL = "https://gql.hashnode.com";
const HOST = process.env.HASHNODE_PUBLICATION_HOST;

// Cached per server instance so we only look it up once
let cachedPublicationId: string | null = null;

async function getPublicationId(): Promise<string | null> {
  if (cachedPublicationId) return cachedPublicationId;
  const res = await fetch(GQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `query { publication(host: "${HOST}") { id } }` }),
  });
  const { data } = await res.json();
  cachedPublicationId = data?.publication?.id ?? null;
  return cachedPublicationId;
}

const MUTATION = `
  mutation SubscribeToNewsletter($input: SubscribeToNewsletterInput!) {
    subscribeToNewsletter(input: $input) {
      status
    }
  }
`;

export async function POST(request: Request) {
  if (!HOST) {
    return Response.json({ error: "Newsletter not configured" }, { status: 503 });
  }

  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email is required" }, { status: 400 });

    const publicationId = await getPublicationId();
    if (!publicationId) {
      return Response.json({ error: "Could not resolve publication" }, { status: 503 });
    }

    const res = await fetch(GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: MUTATION,
        variables: { input: { publicationId, email } },
      }),
    });

    const { data, errors } = await res.json();

    if (errors?.length) {
      const msg: string = errors[0]?.message ?? "Subscribe failed";
      if (msg.toLowerCase().includes("already")) {
        return Response.json({ success: true, alreadySubscribed: true });
      }
      return Response.json({ error: msg }, { status: 400 });
    }

    return Response.json({ success: true, status: data?.subscribeToNewsletter?.status });
  } catch (err) {
    console.error("[api/newsletter]", err);
    return Response.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
