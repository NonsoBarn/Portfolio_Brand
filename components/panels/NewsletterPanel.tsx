"use client";

import { useState } from "react";
import type { PanelId } from "@/lib/types";
import { NEWSLETTER_ISSUES as STATIC_ISSUES } from "@/lib/data";
import { useHashnode } from "@/lib/hooks/useHashnode";

interface NewsletterPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function NewsletterPanel({ open, onClose }: NewsletterPanelProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { posts } = useHashnode();
  const issues = posts.length
    ? posts.map((p) => ({ t: p.title, d: p.meta.split(" · ")[0] ?? "", url: p.url }))
    : STATIC_ISSUES.map((i) => ({ ...i, url: "#" }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const json = await res.json();
      if (!res.ok && !json.alreadySubscribed) {
        setError(json.error ?? "Something went wrong. Try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">09</span>
            <span className="ph-sep" />
            <span className="ph-title">Newsletter</span>
            <span className="ph-badge live"><span className="live-dot" /> Weekly</span>
          </div>
          <div className="ph-actions">
            <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
          </div>
        </div>

        <div className="nlcard">
          <div className="nlct">
            <div className="nll">
              <div className="nll-ey"><span className="live-dot" /> The Build Log</div>
              <h2>The unfiltered weekly dispatch from a Lagos engineer building in public.</h2>
              <p className="nd">
                Every week I write about what I&apos;m shipping, what broke in production, what I learned, and what&apos;s on my mind. No fluff. Just the real stuff.
              </p>
              <ul className="nlperks">
                <li>Real engineering decisions and why I made them</li>
                <li>Lessons from building software across fintech, HealthTech, and PropTech</li>
                <li>Behind the scenes of growing BuildLagos</li>
                <li>Early access to content, tools, and community drops</li>
                <li>Cloud, code, and the occasional hot take</li>
              </ul>
            </div>

            <div className="nlrp">
              <div className="nlbox">
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "1rem 0" }}>
                    <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}><i className="ri-check-line" /></div>
                    <h3>You&apos;re in.</h3>
                    <p className="ns" style={{ marginBottom: 0 }}>Check your inbox to confirm.</p>
                  </div>
                ) : (
                  <>
                    <h3>Join 2,400+ builders</h3>
                    <p className="ns">Weekly. Honest. No spam, ever.</p>
                    <form className="nlf" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        placeholder="First name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button type="submit" disabled={submitting}>
                        {submitting ? "Subscribing…" : <>Subscribe free <i className="ri-arrow-right-line" /></>}
                      </button>
                    </form>
                    {error && <p className="nlfoot" style={{ color: "var(--red, #f55)" }}>{error}</p>}
                    <p className="nlfoot">No spam. Unsubscribe any time. Written by a human.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="nli-wrap">
            <div className="nli-l">Recent issues</div>
            <div className="nli-list">
              {issues.map((item, i) => (
                <a
                  key={i}
                  href={item.url ?? "#"}
                  target={item.url && item.url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="nii"
                  onClick={!item.url || item.url === "#" ? (e) => e.preventDefault() : undefined}
                >
                  <span className="nii-t">{item.t}</span>
                  <span className="nii-d">{item.d}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
