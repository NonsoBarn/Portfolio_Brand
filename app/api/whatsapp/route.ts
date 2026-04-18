// WhatsApp community member count — configured via env var since WhatsApp
// has no public API for group/community counts.
// Set WHATSAPP_MEMBER_COUNT in your environment to keep this up to date.

export const revalidate = 300; // 5 minutes

const fmt = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return String(n);
};

export async function GET() {
  const raw = process.env.WHATSAPP_MEMBER_COUNT;
  const count = raw ? parseInt(raw, 10) : 12000;

  if (isNaN(count)) {
    return Response.json({ error: "Invalid WHATSAPP_MEMBER_COUNT env var" }, { status: 500 });
  }

  return Response.json({
    memberCount: count,
    memberCountFormatted: fmt(count),
  });
}
