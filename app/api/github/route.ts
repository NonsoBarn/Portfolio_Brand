// GitHub contribution graph — activity levels (26 weeks) + current streak
// Requires a free GitHub Personal Access Token (read:user scope only)
export const revalidate = 3600;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

type Day = { contributionCount: number; date: string };
type Week = { contributionDays: Day[] };

function toLevel(weekTotal: number): number {
  if (weekTotal === 0) return 0;
  if (weekTotal <= 3) return 1;
  if (weekTotal <= 7) return 2;
  if (weekTotal <= 14) return 3;
  return 4;
}

export async function GET() {
  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    return Response.json({ error: "GitHub env vars not configured" }, { status: 503 });
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
    cache: "force-cache",
    next: { revalidate },
  });

  const json = await res.json();
  const weeks: Week[] = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  if (!weeks.length) {
    return Response.json({ error: "No contribution data" }, { status: 502 });
  }

  // Last 26 weeks → level 0-4 per week
  const activityLevels = weeks.slice(-26).map((w) => {
    const total = w.contributionDays.reduce((s, d) => s + d.contributionCount, 0);
    return toLevel(total);
  });

  // Streak: consecutive days (today backwards) with at least 1 contribution
  const allDays = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) streak++;
    else break;
  }

  return Response.json({ activityLevels, streak });
}
