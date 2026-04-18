import type { PanelId } from "@/lib/types";
import { COLLAB_TYPES } from "@/lib/data";

interface CollabPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function CollabPanel({ open, onClose }: CollabPanelProps) {
  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">08</span>
            <span className="ph-sep" />
            <span className="ph-title">Collab</span>
            <span className="ph-badge live">
              <span className="live-dot" /> Open
            </span>
          </div>
          <div className="ph-actions">
            <button className="panel-close" onClick={onClose}>
              <i className="ri-close-line" /> close
            </button>
          </div>
        </div>

        <div className="collab-grid">
          <div className="cl">
            <h2>Let&apos;s build something together.</h2>
            <p className="cl-sub">
              I&apos;m open to collaborations that create real value for
              builders and founders in Africa and beyond. Not everything is the
              right fit, but when it is, I show up fully.
            </p>

            <div className="em-block">
              <div className="em-ic">
                <i className="ri-mail-line" />
              </div>
              <div>
                <div className="em-k">Email</div>
                <div className="em-v">hello@nonsobarn.com</div>
              </div>
            </div>

            <div className="em-block">
              <div className="em-ic">
                <i className="ri-at-line" />
              </div>
              <div>
                <div className="em-k">Social DMs</div>
                <div className="em-v">@nonsobarn (X, Instagram, LinkedIn)</div>
              </div>
            </div>

            <p className="cl-note">
              Response time: usually within 24hrs on weekdays. I read
              everything.
            </p>
          </div>

          <div className="citems">
            {COLLAB_TYPES.map((c, i) => (
              <div key={i} className="ci">
                <div className="ci-ic">
                  <i className={c.icon} />
                </div>
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
