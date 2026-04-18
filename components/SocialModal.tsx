/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

interface SocialModalProps {
  open: boolean;
  onClose: () => void;
}

const SOCIALS = [
  {
    icon: "ri-twitter-x-line",
    label: "X / Twitter",
    handle: "@nonsobarn",
    href: "https://x.com/nonsobarn",
  },
  {
    icon: "ri-instagram-line",
    label: "Instagram",
    handle: "@nonsobarn",
    href: "https://instagram.com/nonsobarn",
  },
  {
    icon: "ri-tiktok-line",
    label: "TikTok",
    handle: "@nonsobarn",
    href: "https://tiktok.com/@nonsobarn",
  },
  {
    icon: "ri-linkedin-box-line",
    label: "LinkedIn",
    handle: "Nonso Barn",
    href: "https://linkedin.com/in/nonsobarn",
  },
  {
    icon: "ri-youtube-line",
    label: "YouTube",
    handle: "@nonsobarn",
    href: "https://www.youtube.com/@nonsobarn",
  },
];

export default function SocialModal({ open, onClose }: SocialModalProps) {
  if (!open) return null;

  return (
    <div className="setup-modal" onClick={onClose}>
      <div
        className="setup-box"
        style={{ maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="setup-head">
          <h2>// Connect</h2>
          <button className="setup-close" onClick={onClose}>
            <i className="ri-close-line" /> close
          </button>
        </div>

        <div className="setup-body" style={{ padding: "0 0 .5rem" }}>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: ".85rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--s2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <i
                className={s.icon}
                style={{
                  fontSize: "1.1rem",
                  color: "var(--ink2)",
                  width: 20,
                  textAlign: "center",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--sm)",
                    fontWeight: 700,
                    fontSize: ".75rem",
                    color: "var(--ink)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sm)",
                    fontSize: ".65rem",
                    color: "var(--ink3)",
                    marginTop: 2,
                  }}
                >
                  {s.handle}
                </div>
              </div>
              <i
                className="ri-arrow-right-up-line"
                style={{ fontSize: ".75rem", color: "var(--ink3)" }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
