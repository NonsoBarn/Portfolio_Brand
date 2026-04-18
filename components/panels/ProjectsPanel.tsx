import type { PanelId } from "@/lib/types";
import {
  PROJECTS_FEATURED as FEATURED,
  PROJECTS_SIDE as SIDE_PROJECTS,
} from "@/lib/data";

interface ProjectsPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function ProjectsPanel({
  open,
  onClose,
  onNav,
}: ProjectsPanelProps) {
  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">05</span>
            <span className="ph-sep" />
            <span className="ph-title">Projects</span>
            <span className="ph-badge">{FEATURED.length} total</span>
          </div>
          <div className="ph-actions">
            <button className="al" onClick={() => onNav("collab")}>
              Collab with me <i className="ri-arrow-right-line" />
            </button>
            <button className="panel-close" onClick={onClose}>
              <i className="ri-close-line" /> close
            </button>
          </div>
        </div>

        {/* Featured projects */}
        {FEATURED.map((p, i) => (
          <div key={i} className="pbig">
            <div className="pbig-in">
              <div>
                <span className={`pb-badge ${p.badge}`}>
                  <span className="live-dot" /> {p.badge.toUpperCase()}
                </span>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                {/* <div className="strow">
                  {p.stack.map((s) => (
                    <span key={s} className="st">
                      {s}
                    </span>
                  ))}
                </div> */}
                <div className="plinks">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href="#"
                      className={`plb${l.pri ? " pri" : ""}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pb-r">
                <div className="pb-big">{p.metric}</div>
                <div className="pb-lbl">{p.metaLabel}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Side projects grid */}
        {/* <div style={{ marginTop: ".75rem", marginBottom: ".5rem" }}>
          <span style={{ fontFamily: "var(--sm)", fontSize: "8px", fontWeight: 700, letterSpacing: "2px", color: "var(--ink3)", textTransform: "uppercase" }}>
            Side projects & experiments
          </span>
        </div>
        <div className="pgrid">
          {SIDE_PROJECTS.map((p, i) => (
            <div key={i} className="pgc">
              <div className="pgc-top">
                <span className="pgc-b">{p.badge}</span>
              </div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              <div className="plinks">
                <a href="#" className="plb" onClick={(e) => e.preventDefault()}>View →</a>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
