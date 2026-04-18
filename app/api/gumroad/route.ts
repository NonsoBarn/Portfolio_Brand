// Gumroad API — products list
// Revalidates daily.

const ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;

export const revalidate = 86400; // 24 hours

export async function GET() {
  if (!ACCESS_TOKEN) {
    return Response.json({ error: "Gumroad env vars not configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.gumroad.com/v2/products", {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) {
      return Response.json({ error: "Gumroad API error" }, { status: res.status });
    }

    const data = await res.json();

    const formatPrice = (cents: number, currency: string) => {
      if (currency === "usd") {
        return `$${(cents / 100).toFixed(2)}`;
      }
      // Default format
      return `${currency.toUpperCase()} ${(cents / 100).toFixed(2)}`;
    };

    const products = (data.products ?? []).map(
      (
        p: {
          id: string;
          name: string;
          description?: string;
          price: number;
          currency: string;
          sales_count?: number;
          short_url?: string;
          url?: string;
          published?: boolean;
          custom_permalink?: string;
        },
        i: number
      ) => ({
        id: p.id,
        title: p.name,
        desc: p.description?.replace(/<[^>]+>/g, "").slice(0, 180) ?? "",
        price: formatPrice(p.price, p.currency),
        salesCount: p.sales_count ?? 0,
        url: p.short_url ?? p.url ?? "#",
        published: p.published ?? true,
        n: String(i + 1).padStart(2, "0"),
      })
    ).filter((p: { published: boolean }) => p.published);

    return Response.json({ products });
  } catch (err) {
    console.error("[api/gumroad]", err);
    return Response.json({ error: "Failed to fetch Gumroad data" }, { status: 500 });
  }
}
