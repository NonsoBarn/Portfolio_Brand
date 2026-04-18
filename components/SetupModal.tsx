"use client";

interface SetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SetupModal({ open, onClose }: SetupModalProps) {
  if (!open) return null;

  return (
    <div className="setup-modal">
      <div className="setup-box">
        <div className="setup-head">
          <h2>// Connect your platforms</h2>
          <button className="setup-close" onClick={onClose}><i className="ri-close-line" /> close</button>
        </div>
        <div className="setup-body">
          <div className="setup-section">
            <h3><i className="ri-circle-fill" style={{ color: "var(--lime)", fontSize: "10px" }} /> Spotify</h3>
            <p>Show what you&apos;re listening to in real-time on the Instagram panel. Requires a Spotify developer app.</p>
            <div className="setup-input-wrap">
              <label className="setup-label">Client ID</label>
              <input className="setup-input" placeholder="e.g. 4abc123..." />
              <label className="setup-label" style={{ marginTop: 6 }}>Client Secret</label>
              <input className="setup-input" type="password" placeholder="••••••••••" />
              <p className="setup-hint">
                Get credentials at{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>developer.spotify.com</a>. Set the redirect URI to your domain + /api/spotify/callback.
              </p>
            </div>
          </div>

          <div className="setup-section">
            <h3><i className="ri-circle-fill" style={{ color: "var(--accent)", fontSize: "10px" }} /> Ghost CMS</h3>
            <p>Pull blog posts automatically from your Ghost publication.</p>
            <div className="setup-input-wrap">
              <label className="setup-label">Ghost URL</label>
              <input className="setup-input" placeholder="https://your-site.ghost.io" />
              <label className="setup-label" style={{ marginTop: 6 }}>Content API Key</label>
              <input className="setup-input" placeholder="e.g. abc123def456..." />
            </div>
          </div>

          <div className="setup-section">
            <h3><i className="ri-circle-fill" style={{ color: "var(--blue)", fontSize: "10px" }} /> YouTube</h3>
            <p>Display your latest videos using the YouTube Data API v3.</p>
            <div className="setup-input-wrap">
              <label className="setup-label">Channel ID</label>
              <input className="setup-input" placeholder="UCxxxxxxxxxxxxxx" />
              <label className="setup-label" style={{ marginTop: 6 }}>API Key</label>
              <input className="setup-input" placeholder="AIzaSy..." />
            </div>
          </div>

          <div className="setup-section">
            <h3><i className="ri-circle-fill" style={{ color: "var(--purple)", fontSize: "10px" }} /> Instagram</h3>
            <p>Show your latest posts via Instagram Basic Display API.</p>
            <div className="setup-input-wrap">
              <label className="setup-label">Access Token</label>
              <input className="setup-input" placeholder="IGxxx..." />
              <p className="setup-hint">Token expires every 60 days. Set up auto-refresh in your backend.</p>
            </div>
          </div>
        </div>
        <div className="setup-footer">
          <button className="setup-skip" onClick={onClose}>Skip for now</button>
          <button className="setup-save" onClick={onClose}>Save & connect</button>
        </div>
      </div>
    </div>
  );
}
