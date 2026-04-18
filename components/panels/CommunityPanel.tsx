"use client";

import type { PanelId } from "@/lib/types";
import { COMMUNITY_MEMBERS as MEMBERS, COMMUNITY_EVENTS } from "@/lib/data";
import { useWhatsApp } from "@/lib/hooks/useWhatsApp";

interface CommunityPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function CommunityPanel({ open, onClose }: CommunityPanelProps) {
  const { memberCountFormatted } = useWhatsApp();
  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">07</span>
            <span className="ph-sep" />
            <span className="ph-title">Community</span>
            <span className="ph-badge live">
              <span className="live-dot" /> {memberCountFormatted} members
            </span>
          </div>
          <div className="ph-actions">
            <button className="panel-close" onClick={onClose}>
              <i className="ri-close-line" /> close
            </button>
          </div>
        </div>

        <div className="comm-card">
          <div className="cc-top">
            <div>
              <h2>BuildLagos</h2>
              <p>
                The home for founders, creatives, and builders in Lagos and
                beyond. Monthly virtual meetups, online discussions,
                accountability groups, and a shared mission: build things that
                matter.
              </p>
            </div>
            <a href="#" className="bjoin" onClick={(e) => e.preventDefault()}>
              Join free <i className="ri-arrow-right-line" />
            </a>
          </div>

          <div className="cc-stats">
            {[
              { n: memberCountFormatted, l: "Members" },
              { n: "2x/yr", l: "IRL Meetups" },
              { n: "1 yrs", l: "Running" },
              { n: "24/7", l: "Online" },
            ].map((s) => (
              <div key={s.l} className="ccs">
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="cc-mb">
            <div className="mavs">
              {MEMBERS.map((m) => (
                <div key={m.initials} className={`mav ${m.cls}`}>
                  {m.initials}
                </div>
              ))}
            </div>
            <p>
              <strong>Amaka, Tolu, Chidi</strong> and {memberCountFormatted}{" "}
              others are already building. Come join us.
            </p>
          </div>
          {/* 
          <div className="cc-platform">
            <p>Platform: WhatsApp + IRL Lagos · Est. 2020</p>
            <a
              href="#"
              className="bjoin"
              style={{ padding: "8px 14px", fontSize: "8px" }}
              onClick={(e) => e.preventDefault()}
            >
              Open WhatsApp <i className="ri-whatsapp-line" />
            </a>
          </div> */}
        </div>

        {/* What's happening */}
        {/* <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              fontFamily: "var(--sm)",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "var(--ink3)",
              textTransform: "uppercase",
              marginBottom: ".75rem",
            }}
          >
            This week in the community
          </div>
          <div className="nli-list">
            {COMMUNITY_EVENTS.map((item, i) => (
              <a
                key={i}
                href="#"
                className="nii"
                onClick={(e) => e.preventDefault()}
              >
                <span className="nii-t">{item.t}</span>
                <span className="nii-d">{item.d}</span>
              </a>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
