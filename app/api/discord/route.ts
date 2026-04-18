// Discord API — guild member count
// Revalidates every 5 minutes.

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export const revalidate = 300; // 5 minutes

export async function GET() {
  if (!BOT_TOKEN || !GUILD_ID) {
    return Response.json({ error: "Discord env vars not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        cache: "force-cache",
        next: { revalidate },
      }
    );

    if (!res.ok) {
      return Response.json({ error: "Discord API error" }, { status: res.status });
    }

    const guild = await res.json();
    const count = guild.approximate_member_count ?? 0;

    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
      return String(n);
    };

    return Response.json({
      memberCount: count,
      memberCountFormatted: fmt(count),
      guildName: guild.name,
    });
  } catch (err) {
    console.error("[api/discord]", err);
    return Response.json({ error: "Failed to fetch Discord data" }, { status: 500 });
  }
}
