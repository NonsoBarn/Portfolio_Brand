// Telegram Bot API — group/channel member count
// Revalidates every 5 minutes.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const revalidate = 300; // 5 minutes

export async function GET() {
  if (!BOT_TOKEN || !CHAT_ID) {
    return Response.json({ error: "Telegram env vars not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=${encodeURIComponent(CHAT_ID)}`,
      { next: { revalidate } }
    );

    if (!res.ok) {
      return Response.json({ error: "Telegram API error" }, { status: res.status });
    }

    const data = await res.json();

    if (!data.ok) {
      return Response.json({ error: data.description ?? "Telegram error" }, { status: 400 });
    }

    const count: number = data.result ?? 0;

    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
      return String(n);
    };

    return Response.json({
      memberCount: count,
      memberCountFormatted: fmt(count),
    });
  } catch (err) {
    console.error("[api/telegram]", err);
    return Response.json({ error: "Failed to fetch Telegram data" }, { status: 500 });
  }
}
