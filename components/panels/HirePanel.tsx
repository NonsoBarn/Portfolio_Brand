import type { PanelId } from "@/lib/types";
import { HIRE_SKILLS as SKILLS, HIRE_CASES as CASES } from "@/lib/data";

interface HirePanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function HirePanel({ open, onClose }: HirePanelProps) {
  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">10</span>
            <span className="ph-sep" />
            <span className="ph-title">Hire</span>
            <span className="ph-badge live">
              <span className="live-dot" /> Available
            </span>
          </div>
          <div className="ph-actions">
            <button className="panel-close" onClick={onClose}>
              <i className="ri-close-line" /> close
            </button>
          </div>
        </div>

        <div className="hire-grid">
          {/* Left column */}
          <div className="hire-l">
            <div className="hire-status">
              <span className="live-dot" />
              Available for work
            </div>

            <h2 className="hire-h">
              Build. Ship.
              <br />
              <em>Let&apos;s work together.</em>
            </h2>

            <p className="hire-desc">
              I&apos;m a Fullstack engineer based in Lagos. I build
              production-ready products end to end, from the first line of code
              to live infrastructure. For founders and teams who need things
              done right.
            </p>

            <div className="hire-ctas">
              <a href="mailto:nonsobarn@gmail.com" className="hire-btn fill">
                Email me <i className="ri-arrow-right-line" />
              </a>
              <a
                href="https://nonsobarn.vercel.app/"
                target="_blank"
                className="hire-btn ghost"
                // onClick={(e) => e.preventDefault()}
              >
                View Portfolio
              </a>
            </div>

            {/* <div className="avail">
              <div className="avail-ic">
                <i className="ri-calendar-line" />
              </div>
              <div>
                <div className="avail-k">Next availability</div>
                <div className="avail-v">May 2025 · 2–3 slots open</div>
              </div>
            </div> */}

            <div className="pp">
              <div className="pp-top">
                <div className="pp-url">
                  <span className="pp-dot" />
                  nonsoBarn.com/work
                </div>
                <a
                  href="https://nonsobarn.vercel.app/"
                  className="pp-open"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View portfolio <i className="ri-arrow-right-line" />
                </a>
              </div>
              <div className="pp-stats">
                {[
                  { n: "4+", l: "Years Experience" },
                  { n: "10+", l: "Live Projects" },
                  { n: "55k+", l: "Users" },
                ].map((s) => (
                  <div key={s.l} className="pp-s">
                    <div className="pp-sn">{s.n}</div>
                    <div className="pp-sl">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="hire-r">
            <div className="brands-lbl" style={{ marginBottom: "1rem" }}>
              Skills &amp; stack
            </div>
            <div className="sk-grid">
              {SKILLS.map((s) => (
                <div key={s.cat} className="sk-cat">
                  <div className="sk-cat-n">{s.cat}</div>
                  <div className="sk-tags">
                    {s.tags.map((t) => (
                      <span key={t} className="sk-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="brands-lbl" style={{ marginBottom: ".85rem" }}>
              Selected work
            </div>
            <div className="case-list">
              {CASES.map((c, i) => (
                <a
                  href={c.link}
                  key={i}
                  className="case-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                  <div className="case-item-r">
                    <div className="case-n">{c.stat}</div>
                    <div className="case-l">{c.label}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
