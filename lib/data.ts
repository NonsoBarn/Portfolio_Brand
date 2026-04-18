// ─── Hero ───────────────────────────────────────────────────────────────────

import { link } from "fs";

export const HERO_ACTIVITY_LEVELS = [
  0, 0, 1, 0, 2, 1, 0, 3, 2, 1, 4, 3, 2, 1, 0, 2, 3, 4, 2, 1, 0, 1, 2, 0, 1, 3,
];

export const HERO_CARD_ROWS = [
  { k: "Focus", v: "Brand building", cls: "o" },
  { k: "Status", v: "// Deep work", cls: "" },
  { k: "Stack", v: "Nest.js · Next.js · React Native · DevOps", cls: "" },
  { k: "Streak", v: "47 days", cls: "g" },
];

export const HERO_CARD_SOCIALS = [
  { p: "Twitter", n: "4.2K" },
  { p: "YouTube", n: "9.8K" },
  { p: "IG", n: "6.1K" },
  { p: "Email", n: "2.4K" },
];

// ─── About ──────────────────────────────────────────────────────────────────

export const ABOUT_TAGS = [
  "Code",
  "Startups",
  "Content",
  "Community",
  "Lagos",
  "Africa",
  "Tech",
];

export const ABOUT_BRANDS = [
  "Peri Drinks",
  "Frame Studio",
  "BuildLagos",
  "Chop Fast",
  "NB Digital",
  "Merch Drop",
];

export const ABOUT_STATS = [
  {
    num: "3+",
    desc: "Ventures built from zero. Products, communities, and brands.",
  },
  {
    num: "100+",
    desc: "People in the BuildLagos community. Growing every week.",
  },
  { num: "50+", desc: "Videos shipped across YouTube, Instagram and TikTok." },
  { num: "1yrs", desc: "Building publicly and loudly since 2026." },
];

export const ABOUT_PLAYLIST = [
  {
    title: "Subaru Boys: FINAL FORM",
    artist: "Cruel Santino",
    album: "SUBARU BOYS",
    duration: "3:42",
    progress: 62,
  },
  {
    title: "Revel in the Rhythm",
    artist: "Odunsi (The Engine)",
    album: "rare.",
    duration: "3:18",
    progress: 0,
  },
  {
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile Soundtrack",
    duration: "5:26",
    progress: 0,
  },
  {
    title: "Big Steppa",
    artist: "Fireboy DML",
    album: "Apollo",
    duration: "3:55",
    progress: 0,
  },
  {
    title: "Lagos to Kampala",
    artist: "Burna Boy ft. Chance",
    album: "African Giant",
    duration: "4:12",
    progress: 0,
  },
  {
    title: "Party Next Door",
    artist: "Santi",
    album: "Mandy & the Jungle",
    duration: "3:29",
    progress: 0,
  },
];

export const ABOUT_GALLERY = [
  { label: "BuildLagos Meetup", sub: "Jan 2024" },
  { label: "Frame Studio HQ", sub: "Lagos" },
  { label: "Product Sprint", sub: "Feb 2024" },
  { label: "Community Day", sub: "Dec 2023" },
  { label: "Brand Shoot", sub: "Mar 2024" },
  { label: "Podcast Recording", sub: "Feb 2024" },
  { label: "Workshop", sub: "Nov 2023" },
  { label: "Team Collab", sub: "Jan 2024" },
  { label: "Demo Day", sub: "Oct 2023" },
];

// Shared terminal initial lines (About + Now panels)
export const TERM_LINES = [
  { cls: "acc", text: "Welcome. This is an interactive terminal." },
  { cls: "dim", text: "Type a command below and press Enter." },
  { cls: "dim", text: "" },
  { cls: "lime", text: "Try one of these:" },
  { cls: "out", text: "  whoami      → who is Nonso Barn?" },
  { cls: "out", text: "  ls projects → active ventures" },
  { cls: "out", text: "  cat story   → the origin story" },
  { cls: "out", text: "  cat stack   → tools & tech" },
  { cls: "out", text: "  git log     → recent milestones" },
  { cls: "out", text: "  contact     → get in touch" },
  { cls: "dim", text: "" },
  { cls: "dim", text: "  ↑ ↓ arrow keys cycle command history" },
  { cls: "dim", text: "  help  for the full command list" },
  { cls: "dim", text: "" },
];

// ─── Now ────────────────────────────────────────────────────────────────────

export const NOW_CARDS = [
  {
    cls: "c1",
    cat: "Building",
    title: "BuildLagos v3",
    desc: "Redesigning the community platform. New onboarding, resource library, and accountability tools.",
  },
  {
    cls: "c2",
    cat: "Reading",
    title: "The Mom Test",
    desc: "Re-reading it before the next product sprint. Always hits differently.",
  },
  {
    cls: "c3",
    cat: "Learning",
    title: "Rust basics",
    desc: "Side experiment. No immediate plan. Just curious about systems programming.",
  },
  {
    cls: "c4",
    cat: "Watching",
    title: "Hard Knocks: NFL",
    desc: "Studying how they tell transformation stories in real-time. Applies to founder content.",
  },
  {
    cls: "c5",
    cat: "Listening",
    title: "Cruel Santino",
    desc: "Subaru Boys: FINAL FORM on repeat. Afrofusion done right.",
  },
  {
    cls: "c1",
    cat: "Shipping",
    title: "Frame Studio rebrand",
    desc: "New site, new positioning, new pricing. Dropping in April.",
  },
];

// ─── Blog ────────────────────────────────────────────────────────────────────

export const BLOG_POSTS = [
  {
    featured: true,
    tag: "Founder Notes",
    title: "Why I almost quit building in public (and what changed)",
    excerpt:
      "Six months in, the likes dried up, the comments stopped, and I was shipping into the void. Here&apos;s the exact moment I decided to keep going — and the mental model that flipped everything.",
    meta: "Mar 2024 · 12 min",
    num: "01",
  },
  {
    featured: false,
    tag: "Brand",
    title: "The Lagos aesthetic playbook: dark, dense, intentional",
    excerpt:
      "A breakdown of why every brand I build looks the way it does. Grid systems, type hierarchies, and the philosophy behind the palette.",
    meta: "Feb 2024 · 8 min",
    num: "02",
  },
  {
    featured: false,
    tag: "Community",
    title: "How BuildLagos hit 12K members with zero paid ads",
    excerpt:
      "Organic community growth is not a myth. It just requires a different playbook than what the growth hackers are selling.",
    meta: "Jan 2024 · 10 min",
    num: "03",
  },
  {
    featured: false,
    tag: "Product",
    title: "Shipping a product in 30 days: the honest post-mortem",
    excerpt:
      "What we got right, what we got embarrassingly wrong, and the one metric that told us everything we needed to know on day 3.",
    meta: "Dec 2023 · 7 min",
    num: "04",
  },
  {
    featured: false,
    tag: "Money",
    title: "Revenue transparency: what I actually made in 2023",
    excerpt:
      "Numbers, sources, and the uncomfortable truth about which bets paid off and which ones cost me time I won&apos;t get back.",
    meta: "Jan 2024 · 6 min",
    num: "05",
  },
];

// ─── YouTube ─────────────────────────────────────────────────────────────────

export const YOUTUBE_FEATURED = {
  cat: "Founder Series",
  title: "I built a brand in 7 days — here's everything that went wrong",
  desc: "Full uncut breakdown of the 7-day brand sprint. Concept, visual identity, first revenue, and the 3 AM crisis moment that almost ended it.",
  views: "42K views",
  duration: "24:18",
  date: "Mar 2024",
  subs: "9.8K",
};

export const YOUTUBE_VIDEOS = [
  {
    cat: "Build Log",
    title: "Week 4 of BuildLagos: community hits 10K",
    dur: "18:42",
    views: "28K",
  },
  {
    cat: "Brand",
    title: "Logo teardown: Lagos vs London design sensibility",
    dur: "12:05",
    views: "19K",
  },
  {
    cat: "Revenue",
    title: "My first $1,000 month: what actually worked",
    dur: "21:33",
    views: "55K",
  },
  {
    cat: "Product",
    title: "Shipping Chop Fast v2 — live walkthrough",
    dur: "31:07",
    views: "14K",
  },
  {
    cat: "Collab",
    title: "Recording a podcast in Lagos: the setup",
    dur: "9:22",
    views: "8K",
  },
  {
    cat: "Mindset",
    title: "Why I document everything, even failures",
    dur: "15:44",
    views: "33K",
  },
];

// ─── Instagram ───────────────────────────────────────────────────────────────

export const INSTAGRAM_GRID = [
  { likes: "2.4K", type: "Reel" },
  { likes: "1.8K", type: "Post" },
  { likes: "3.1K", type: "Reel" },
  { likes: "990", type: "Post" },
  { likes: "1.2K", type: "Reel" },
  { likes: "4.4K", type: "Post" },
  { likes: "870", type: "Post" },
  { likes: "2.1K", type: "Reel" },
  { likes: "1.5K", type: "Post" },
];

export const INSTAGRAM_SPOTIFY = {
  title: "Made in Lagos",
  artist: "Cruel Santino",
  album: "Subaru Boys: FINAL FORM",
  progress: 62,
  elapsed: "1:44",
  total: "2:51",
};

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECTS_FEATURED = [
  {
    badge: "live",
    name: "BuildLagos",
    desc: "The largest community for builders, founders, and creatives in Lagos. Weekly meetups, online community, and a shared mission to document and accelerate the Lagos tech scene.",
    stack: ["Next.js", "Supabase", "Discord", "Stripe"],
    metric: "300+",
    metaLabel: "Members",
    links: [
      { label: "Visit →", pri: true },
      // { label: "GitHub", pri: false },
      // { label: "Case Study", pri: false },
    ],
  },
  {
    badge: "live",
    name: "Veval AI",
    desc: "A Gov-Tech platform simplifying vehicle registration, license renewal, and insurance for Nigerian drivers and vehicle owners. Fully online and AI-assisted, veval handles every document, submission, and delivery through a verified agent network, so you never have to visit an FRSC office again.",
    stack: ["Figma", "Framer", "Ghost", "Linear"],
    metric: "40+",
    metaLabel: "Clients",
    links: [
      { label: "Visit →", pri: true },
      // { label: "Dribbble", pri: false },
    ],
  },
];

export const PROJECTS_SIDE = [
  {
    badge: "Beta",
    name: "Chop Fast",
    desc: "Food discovery app for Lagos street food. Rate spots, find hidden gems, track your eating pattern.",
  },
  {
    badge: "Live",
    name: "NB Merch",
    desc: "Limited drops of clothes and goods for the builder community. Ships from Lagos.",
  },
  {
    badge: "WIP",
    name: "Peri Drinks",
    desc: "Nigerian-made non-alcoholic drinks brand. Starting with hibiscus and ginger.",
  },
  {
    badge: "Archive",
    name: "DevLog",
    desc: "Daily 60-second video diary of the build process. Over 300 episodes.",
  },
];

// ─── Shop ────────────────────────────────────────────────────────────────────

export const SHOP_PRODUCTS = [
  {
    vis: "v1",
    badge: "hot",
    type: "eb",
    typeLabel: "E-Book",
    title: "The Brand from Zero Playbook",
    desc: "The exact framework I use to go from idea to launched brand in 30 days. 80+ pages, templates, real examples from my own builds.",
    price: "₦ 7,500",
    sub: "PDF",
    n: "01",
  },
  {
    vis: "v2",
    badge: "new",
    type: "tp",
    typeLabel: "Template",
    title: "Founder OS — Notion System",
    desc: "My complete operating system for running a startup solo. Project tracking, content pipeline, CRM, weekly reviews. One workspace to rule them all.",
    price: "₦ 4,000",
    sub: "Notion",
    n: "02",
  },
  {
    vis: "v3",
    badge: null,
    type: "no",
    typeLabel: "Notion",
    title: "Brand Audit Workbook",
    desc: "A structured process for auditing any brand — your own or a competitor's. 12 dimensions, scoring rubric, action plan template.",
    price: "₦ 2,500",
    sub: "Notion",
    n: "03",
  },
  {
    vis: "v4",
    badge: "new",
    type: "co",
    typeLabel: "Course",
    title: "Content for Founders — Mini Course",
    desc: "4 modules on building a content engine as a one-person team. Covers ideation, filming, editing workflow, and distribution strategy.",
    price: "₦ 15,000",
    sub: "Video",
    n: "04",
  },
];

// ─── Community ───────────────────────────────────────────────────────────────

export const COMMUNITY_MEMBERS = [
  { initials: "AK", cls: "ma1" },
  { initials: "TO", cls: "ma2" },
  { initials: "CJ", cls: "ma3" },
  { initials: "EB", cls: "ma4" },
  { initials: "MF", cls: "ma5" },
  { initials: "RA", cls: "ma6" },
];

export const COMMUNITY_EVENTS = [
  {
    t: "Startup demo night recap — 12 pitches, 3 investments",
    d: "2 days ago",
  },
  { t: "AMA: Building a hardware company in Lagos", d: "5 days ago" },
  { t: "New accountability group forming — apply by Friday", d: "6 days ago" },
  { t: "Community jobs board: 8 new opportunities", d: "1 week ago" },
];

// ─── Collab ──────────────────────────────────────────────────────────────────

export const COLLAB_TYPES = [
  {
    icon: "ri-mic-line",
    title: "Podcast / Interview",
    desc: "Looking to talk to a builder or founder building in Africa? Let's record.",
  },
  {
    icon: "ri-code-s-slash-line",
    title: "Freelance / Contract Work",
    desc: "Need an engineer to build or ship something? Let's talk scope and timeline.",
  },
  {
    icon: "ri-shake-hands-line",
    title: "Community Partnership",
    desc: "Partnering with brands, tools, and orgs that serve African founders and developers.",
  },
  {
    icon: "ri-box-3-line",
    title: "Product Feedback",
    desc: "I review early-stage products honestly. Ship me access or a prototype.",
  },
  {
    icon: "ri-movie-2-line",
    title: "Sponsored Content",
    desc: "Sponsored YouTube or newsletter slots. Strict alignment policy, must be useful to builders.",
  },
];

// ─── Newsletter ──────────────────────────────────────────────────────────────

export const NEWSLETTER_ISSUES = [
  { t: "The week I almost ran out of runway — and what saved us", d: "Mar 18" },
  { t: "5 tools I actually use to run a one-person startup", d: "Mar 11" },
  { t: "Why your brand feels cheap (and how to fix it for free)", d: "Mar 4" },
  {
    t: "The distribution playbook: how I get 10X from the same content",
    d: "Feb 25",
  },
  { t: "Honest revenue numbers for Q1 2024", d: "Feb 18" },
];

// ─── Hire ────────────────────────────────────────────────────────────────────

export const HIRE_SKILLS = [
  {
    cat: "Frontend & Mobile",
    tags: ["React", "ReactNative", "Next.js", "TypeScript", "Flutter"],
  },
  {
    cat: "Backend",
    tags: ["Node.js", "Express", "Nest.js", "PostgreSQL", "MongoDB"],
  },
  {
    cat: "Cloud & DevOps",
    tags: [
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
      "GitHub Actions",
      "Vercel",
      "Expo EAS",
    ],
  },
  {
    cat: "AI / ML",
    tags: [
      "AI-powered integrations",
      "Predictive analytics",
      "Python (ML)",
      "MLOps concepts",
    ],
  },
];

export const HIRE_CASES = [
  {
    title: "Bankit MFB",
    desc: "CBN-licensed digital bank offering instant transfers, savings, and bills payment across Nigeria.",
    stat: "75K+",
    label: "Monthly Transactions",
    link: "https://bankitafrica.com/",
  },
  {
    title: "Leansite AI",
    desc: "AI-powered facility management platform automating work orders, vendor dispatch, and predictive maintenance.",
    stat: "12k+",
    label: "Active Users",
    link: "https://getleansite.com/",
  },
  {
    title: "NexVZT EVV",
    desc: "Electronic Visit Verification platform by Potternex for home care compliance and caregiver tracking.",
    stat: "25K+",
    label: "Visits",
    link: "https://nexvzt.potternex.com/",
  },
];
