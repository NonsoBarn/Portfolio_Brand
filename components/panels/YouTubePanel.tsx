"use client";

import type { PanelId } from "@/lib/types";
import { useYouTube } from "@/lib/hooks/useYouTube";

interface YouTubePanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function YouTubePanel({ open, onClose }: YouTubePanelProps) {
  const { featured: FEATURED, videos: VIDEOS, subs, loading } = useYouTube();
  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">03</span>
            <span className="ph-sep" />
            <span className="ph-title">YouTube</span>
            <span className="ph-badge live"><span className="live-dot" /> {subs} subscribers</span>
          </div>
          <div className="ph-actions">
            <a className="al" href="https://www.youtube.com/@nonsobarn" target="_blank" rel="noopener noreferrer">Subscribe <i className="ri-arrow-right-line" /></a>
            <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
          </div>
        </div>

        {!FEATURED && !loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "4rem 2rem", textAlign: "center" }}>
            <i className="ri-video-line" style={{ fontSize: "2rem", color: "var(--ink3)" }} />
            <div>
              <div style={{ fontFamily: "var(--sm)", fontWeight: 700, fontSize: ".8rem", color: "var(--ink)", marginBottom: ".4rem" }}>No videos yet</div>
              <div style={{ fontFamily: "var(--sm)", fontSize: ".7rem", color: "var(--ink3)", lineHeight: 1.6 }}>First upload coming soon.<br />Subscribe so you don&apos;t miss it.</div>
            </div>
            <a
              href="https://www.youtube.com/@nonsobarn"
              target="_blank"
              rel="noopener noreferrer"
              className="bjoin"
              style={{ fontSize: "8px", padding: "8px 16px" }}
            >
              Subscribe on YouTube <i className="ri-arrow-right-up-line" />
            </a>
          </div>
        ) : FEATURED ? (
          <>
            {/* Featured video */}
            <a
              className="yt-feat"
              href={FEATURED.videoId ? `https://youtu.be/${FEATURED.videoId}` : "#"}
              target={FEATURED.videoId ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={!FEATURED.videoId ? (e) => e.preventDefault() : undefined}
            >
              <div className="yt-thumb">
                {FEATURED.videoId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${FEATURED.videoId}/maxresdefault.jpg`}
                    alt={FEATURED.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${FEATURED.videoId}/hqdefault.jpg`; }}
                  />
                ) : null}
                <span className="yt-dur">{FEATURED.duration}</span>
                <span className="yt-views">{FEATURED.views}</span>
              </div>
              <div className="yt-body">
                <div className="vm">
                  <span>{FEATURED.date}</span>
                  <span>{FEATURED.views}</span>
                  <span>{FEATURED.duration}</span>
                </div>
                <h3>{FEATURED.title}</h3>
                <p>{FEATURED.desc}</p>
                <div className="hbtns">
                  <span className="hbtn fill">Watch now</span>
                </div>
              </div>
            </a>

            {/* Video grid */}
            {VIDEOS.length > 0 && (
              <div className="vgrid" style={{ marginTop: ".5rem" }}>
                {VIDEOS.slice(0, 5).map((v, i) => (
                  <a
                    key={i}
                    href={v.videoId ? `https://youtu.be/${v.videoId}` : "#"}
                    target={v.videoId ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="vc"
                    onClick={!v.videoId ? (e) => e.preventDefault() : undefined}
                  >
                    <div className="vct">
                      {v.videoId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                          alt={v.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : null}
                      <span className="vc-cat">{v.cat}</span>
                      <span className="vc-dur">{v.dur}</span>
                    </div>
                    <div className="vc-info">
                      <h4>{v.title}</h4>
                      <div className="vm">
                        <span>{v.views}</span>
                        <span>{v.dur}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        ) : null}

        <a
          href="https://www.youtube.com/@nonsobarn"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
            width: "100%", padding: ".75rem", marginTop: ".5rem",
            border: "1px solid var(--border2)", color: "var(--ink3)",
            fontFamily: "var(--sm)", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase",
            textDecoration: "none", transition: "color .15s, border-color .15s",
          }}
        >
          See all videos on YouTube <i className="ri-external-link-line" />
        </a>
      </div>
    </div>
  );
}
