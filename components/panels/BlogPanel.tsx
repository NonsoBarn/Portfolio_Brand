"use client";

import { useState } from "react";
import type { PanelId } from "@/lib/types";
import { useHashnode } from "@/lib/hooks/useHashnode";

type View = "list" | "all" | "post";

interface BlogPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

interface PostDetail {
  title: string;
  tag: string;
  meta: string;
  coverImage: string | null;
  content: string;
}

interface ArchivePost {
  title: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  tag: string;
}

function groupByYearMonth(posts: ArchivePost[]) {
  const map: Record<number, Record<string, ArchivePost[]>> = {};
  for (const p of posts) {
    const d = new Date(p.publishedAt);
    const y = d.getFullYear();
    const m = d.toLocaleDateString("en-US", { month: "long" });
    if (!map[y]) map[y] = {};
    if (!map[y][m]) map[y][m] = [];
    map[y][m].push(p);
  }
  return map;
}

export default function BlogPanel({ open, onClose, onNav }: BlogPanelProps) {
  const { posts: BLOG_POSTS } = useHashnode();
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<PostDetail | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  // Archive state
  const [archivePosts, setArchivePosts] = useState<ArchivePost[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long" });
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([currentYear]));
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set([`${currentYear}-${currentMonth}`]));

  const openPost = async (slug: string, meta: string) => {
    if (!slug) return;
    setLoadingPost(true);
    try {
      const res = await fetch(`/api/hashnode/${slug}`);
      const json = await res.json();
      if (!json.error) {
        setSelected({ ...json, meta });
        setView("post");
      }
    } finally {
      setLoadingPost(false);
    }
  };

  const openAll = async () => {
    setView("all");
    if (archivePosts.length) return;
    setLoadingAll(true);
    try {
      const res = await fetch("/api/hashnode/all");
      const json = await res.json();
      if (!json.error) setArchivePosts(json.posts);
    } finally {
      setLoadingAll(false);
    }
  };

  const toggleYear = (y: number) => {
    setExpandedYears((prev) => {
      const n = new Set(prev);
      n.has(y) ? n.delete(y) : n.add(y);
      return n;
    });
  };

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const grouped = groupByYearMonth(archivePosts);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">

        {/* ── Single post view ── */}
        {view === "post" && selected && (
          <>
            <div className="panel-head">
              <div className="ph-left">
                <button className="al" onClick={() => { setView("list"); setSelected(null); }}>
                  <i className="ri-arrow-left-line" /> Back
                </button>
              </div>
              <div className="ph-actions">
                <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
              </div>
            </div>
            <div style={{ padding: "1.5rem 1.75rem", maxWidth: 720, margin: "0 auto" }}>
              {selected.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.coverImage} alt={selected.title} style={{ width: "100%", borderRadius: 4, marginBottom: "1.5rem", display: "block", maxHeight: 320, objectFit: "cover" }} />
              )}
              <div style={{ fontFamily: "var(--sm)", fontSize: "8px", fontWeight: 700, letterSpacing: "2px", color: "var(--lime)", textTransform: "uppercase", marginBottom: ".5rem" }}>
                {selected.tag}
              </div>
              <h2 style={{ fontSize: "clamp(1.1rem,2.5vw,1.6rem)", fontWeight: 700, letterSpacing: "-.5px", lineHeight: 1.2, marginBottom: ".75rem", color: "var(--ink)" }}>
                {selected.title}
              </h2>
              <div style={{ fontFamily: "var(--sm)", fontSize: "7px", color: "var(--ink3)", marginBottom: "2rem" }}>
                {selected.meta}
              </div>
              <div className="post-body" dangerouslySetInnerHTML={{ __html: selected.content }} />
            </div>
          </>
        )}

        {/* ── All posts archive view ── */}
        {view === "all" && (
          <>
            <div className="panel-head">
              <div className="ph-left">
                <button className="al" onClick={() => setView("list")}>
                  <i className="ri-arrow-left-line" /> Back
                </button>
                <span className="ph-sep" />
                <span className="ph-title">All Posts</span>
                {archivePosts.length > 0 && (
                  <span className="ph-badge live"><span className="live-dot" /> {archivePosts.length} posts</span>
                )}
              </div>
              <div className="ph-actions">
                <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
              </div>
            </div>

            {loadingAll && (
              <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--sm)", fontSize: "8px", color: "var(--ink3)", letterSpacing: "1px" }}>
                Loading posts...
              </div>
            )}

            {!loadingAll && archivePosts.length === 0 && (
              <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--sm)", fontSize: "8px", color: "var(--ink3)" }}>
                No posts yet.
              </div>
            )}

            {!loadingAll && years.map((year) => {
              const isCurrentYear = year === currentYear;
              const yearExpanded = expandedYears.has(year);
              const months = Object.keys(grouped[year]).sort((a, b) =>
                new Date(`${b} 1, ${year}`).getTime() - new Date(`${a} 1, ${year}`).getTime()
              );

              return (
                <div key={year} style={{ borderBottom: "1px solid var(--border)" }}>
                  {/* Year header */}
                  <button
                    onClick={() => toggleYear(year)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".75rem 1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink)", fontFamily: "var(--sm)", fontWeight: 700, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase" }}
                  >
                    <span>{year}{isCurrentYear && <span style={{ color: "var(--lime)", marginLeft: ".5rem", fontSize: "7px" }}>current</span>}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "var(--ink3)", fontWeight: 400 }}>
                      <span style={{ fontSize: "7px" }}>{archivePosts.filter(p => new Date(p.publishedAt).getFullYear() === year).length} posts</span>
                      <i className={`ri-arrow-${yearExpanded ? "up" : "down"}-s-line`} style={{ fontSize: "10px" }} />
                    </span>
                  </button>

                  {yearExpanded && (
                    <div>
                      {isCurrentYear ? (
                        // Current year: grouped by month, collapsible
                        months.map((month) => {
                          const key = `${year}-${month}`;
                          const monthExpanded = expandedMonths.has(key);
                          return (
                            <div key={month} style={{ borderTop: "1px solid var(--border)" }}>
                              <button
                                onClick={() => toggleMonth(key)}
                                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".5rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink2)", fontFamily: "var(--sm)", fontSize: "8px", letterSpacing: "1px" }}
                              >
                                <span>{month}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: ".4rem", color: "var(--ink3)" }}>
                                  <span style={{ fontSize: "7px" }}>{grouped[year][month].length}</span>
                                  <i className={`ri-arrow-${monthExpanded ? "up" : "down"}-s-line`} style={{ fontSize: "9px" }} />
                                </span>
                              </button>
                              {monthExpanded && grouped[year][month].map((post) => (
                                <ArchiveCard key={post.slug} post={post} fmtDate={fmtDate} onOpen={openPost} />
                              ))}
                            </div>
                          );
                        })
                      ) : (
                        // Past years: flat list of posts
                        months.map((month) =>
                          grouped[year][month].map((post) => (
                            <ArchiveCard key={post.slug} post={post} fmtDate={fmtDate} onOpen={openPost} />
                          ))
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── Post list view ── */}
        {view === "list" && (
          <>
            <div className="panel-head">
              <div className="ph-left">
                <span className="ph-num">02</span>
                <span className="ph-sep" />
                <span className="ph-title">Blog</span>
                <span className="ph-badge live"><span className="live-dot" /> {BLOG_POSTS.length} posts</span>
              </div>
              <div className="ph-actions">
                <button className="al" onClick={() => onNav("newsletter")}>Get it in your inbox <i className="ri-arrow-right-line" /></button>
                <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
              </div>
            </div>

            {loadingPost && (
              <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--sm)", fontSize: "8px", color: "var(--ink3)", letterSpacing: "1px" }}>
                Loading post...
              </div>
            )}

            {!loadingPost && (
              <>
                <div className="blog-grid">
                  {BLOG_POSTS.slice(0, 5).map((post, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`ghost-post${post.featured ? " featured" : ""}`}
                      onClick={(e) => { e.preventDefault(); openPost(post.slug ?? "", post.meta); }}
                    >
                      <div className="gp-body" style={!post.featured ? { padding: ".75rem 1rem" } : undefined}>
                        <div>
                          <div className="gp-tag">{post.tag}</div>
                          <div className="gp-title">{post.title}</div>
                          <div className="gp-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                        </div>
                        <div className="gp-foot">
                          <span className="gp-meta">{post.meta}</span>
                          <span className="gp-read">Read <i className="ri-arrow-right-line" /></span>
                        </div>
                      </div>
                      <div className="gp-img" style={!post.featured ? { minHeight: "60px" } : undefined}>
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div className="gp-img-fb" style={!post.featured ? { minHeight: "60px", padding: "1rem" } : undefined}>
                            <span className="gp-img-fb-n">{post.num}</span>
                            <span className="gp-img-fb-tag">{post.tag}</span>
                            <span className="gp-img-fb-title">{post.title}</span>
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ marginTop: "1px", borderTop: "1px solid var(--border)", padding: "1rem 0", textAlign: "center" }}>
                  <button
                    className="bjoin"
                    style={{ fontSize: "8px", padding: "8px 16px" }}
                    onClick={openAll}
                  >
                    See all publications <i className="ri-arrow-right-line" />
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}

function ArchiveCard({ post, fmtDate, onOpen }: {
  post: ArchivePost;
  fmtDate: (iso: string) => string;
  onOpen: (slug: string, meta: string) => void;
}) {
  const meta = `${fmtDate(post.publishedAt)} · ${post.readTimeInMinutes} min`;
  return (
    <button
      onClick={() => onOpen(post.slug, meta)}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: ".75rem", padding: ".55rem 1.75rem", background: "transparent", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "background .12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--s2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontFamily: "var(--sm)", fontSize: "6px", fontWeight: 700, letterSpacing: "1.5px", color: "var(--lime)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{post.tag}</span>
      <span style={{ flex: 1, fontFamily: "var(--sg)", fontSize: ".75rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{post.title}</span>
      <span style={{ fontFamily: "var(--sm)", fontSize: "6.5px", color: "var(--ink3)", whiteSpace: "nowrap" }}>{meta}</span>
      <i className="ri-arrow-right-line" style={{ fontSize: "10px", color: "var(--ink3)" }} />
    </button>
  );
}
