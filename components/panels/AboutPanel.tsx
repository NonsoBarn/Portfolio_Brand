"use client";

import { useState, useRef, useEffect } from "react";
import type { PanelId } from "@/lib/types";
import {
  ABOUT_TAGS,
  ABOUT_BRANDS,
  ABOUT_STATS,
  ABOUT_GALLERY,
  TERM_LINES,
  ABOUT_PLAYLIST,
} from "@/lib/data";
import { useSpotify } from "@/lib/hooks/useSpotify";
import { useSpotifyPlaylist } from "@/lib/hooks/useSpotifyPlaylist";

interface AboutPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

function MusicPlayer() {
  const spotify = useSpotify();
  const { tracks } = useSpotifyPlaylist();
  const playlist = tracks.length ? tracks : ABOUT_PLAYLIST;
  const [trackIdx, setTrackIdx] = useState(0);

  // Web Playback SDK
  const deviceIdRef = useRef<string | null>(null);
  const playerRef = useRef<Spotify.Player | null>(null);
  const [sdkState, setSdkState] = useState<{
    title?: string;
    artist?: string;
    album?: string;
    albumArt?: string;
    isPlaying?: boolean;
    progress?: number;
    elapsed?: string;
    total?: string;
  } | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  useEffect(() => {
    let player: Spotify.Player | null = null;

    const fmt = (ms: number) => {
      const s = Math.floor(ms / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };

    const initPlayer = async () => {
      const res = await fetch("/api/spotify/token");
      const { token } = await res.json();
      if (!token) {
        console.error("[Spotify SDK] token fetch failed");
        return;
      }

      player = new window.Spotify.Player({
        name: "Nonso Barn Web Player",
        // Always fetch fresh token so Spotify can re-auth without stale tokens
        getOAuthToken: async (cb) => {
          const r = await fetch("/api/spotify/token");
          const { token: t } = await r.json();
          cb(t);
        },
        volume: 0.8,
      });

      player.addListener("ready", (data: unknown) => {
        const { device_id } = data as { device_id: string };
        console.log("[Spotify SDK] ready, device_id:", device_id);
        deviceIdRef.current = device_id;
        setSdkReady(true);
      });
      player.addListener("not_ready", () => {
        deviceIdRef.current = null;
        setSdkReady(false);
      });
      player.addListener("player_state_changed", (state: unknown) => {
        if (!state) {
          setSdkState(null);
          return;
        }
        const s = state as Spotify.PlaybackState;
        const track = s.track_window.current_track;
        setSdkState({
          title: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          isPlaying: !s.paused,
          progress: s.duration > 0 ? (s.position / s.duration) * 100 : 0,
          elapsed: fmt(s.position),
          total: fmt(s.duration),
        });
      });
      player.addListener("initialization_error", (d: unknown) => {
        const m = (d as { message: string }).message;
        console.error("Spotify init:", m);
        setSdkError(`init: ${m}`);
      });
      player.addListener("authentication_error", (d: unknown) => {
        const m = (d as { message: string }).message;
        console.error("Spotify auth:", m);
        setSdkError(`auth: ${m}`);
      });
      player.addListener("account_error", (d: unknown) => {
        const m = (d as { message: string }).message;
        console.error("Spotify account:", m);
        setSdkError(`account: ${m}`);
      });

      playerRef.current = player;
      await player.connect();
    };

    // Always register callback first — covers "script loading" case
    window.onSpotifyWebPlaybackSDKReady = initPlayer;

    if (window.Spotify) {
      // SDK already loaded (e.g. component remounted after HMR)
      initPlayer();
    } else if (!document.getElementById("spotify-sdk")) {
      // First load — inject script; callback fires when it loads
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }
    // else: script is in DOM but not yet loaded — callback will fire when ready

    return () => {
      player?.disconnect();
      playerRef.current = null;
    };
  }, []);

  const playTrack = async (index: number) => {
    if (!deviceIdRef.current) return;
    const uris = playlist
      .map((t) => (t as { uri?: string }).uri)
      .filter((u): u is string => !!u);
    if (!uris.length) return;
    const offset = Math.min(index, uris.length - 1);
    await fetch("/api/spotify/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uris, offset, deviceId: deviceIdRef.current }),
    });
  };

  // Display priority: SDK state > Spotify API polling > playlist selection
  const isSDKPlaying = sdkState?.isPlaying === true;
  const isLive = isSDKPlaying || spotify.isPlaying;

  const activeTrackName =
    sdkState?.title ?? (spotify.isPlaying ? spotify.title : null);
  const activeIdx = activeTrackName
    ? playlist.findIndex(
        (t) => t.title.toLowerCase() === activeTrackName.toLowerCase(),
      )
    : -1;
  const displayIdx = activeIdx >= 0 ? activeIdx : trackIdx;

  const displayTrack = sdkState
    ? {
        title: sdkState.title,
        artist: sdkState.artist,
        album: sdkState.album,
        albumArt: sdkState.albumArt,
        duration: sdkState.total,
        progress: sdkState.progress,
        elapsed: sdkState.elapsed,
      }
    : spotify.isPlaying
      ? {
          title: spotify.title,
          artist: spotify.artist,
          album: spotify.album,
          albumArt: spotify.albumArt,
          duration: spotify.total,
          progress: spotify.progress,
          elapsed: spotify.elapsed,
        }
      : {
          ...(playlist[displayIdx] as (typeof ABOUT_PLAYLIST)[number]),
          albumArt: null,
          elapsed: "0:00",
        };

  return (
    <div>
      {/* Now playing card */}
      <div className="sp-card" style={{ marginBottom: ".5rem" }}>
        <div className="sp-art">
          {displayTrack?.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayTrack.albumArt}
              alt={displayTrack.album ?? ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div className="sp-art-fb">
              <i
                className="ri-music-2-line"
                style={{ fontSize: "2rem", color: "var(--ink3)" }}
              />
              <span
                style={{
                  fontFamily: "var(--sm)",
                  fontSize: "7px",
                  color: "var(--ink3)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {displayTrack?.album}
              </span>
            </div>
          )}
        </div>
        <div className="sp-body">
          <div>
            <div className="sp-now">
              <span className="live-dot" />
              {isSDKPlaying
                ? "Playing in browser"
                : isLive
                  ? "Spotify · now playing"
                  : sdkReady
                    ? "Ready · click a track"
                    : sdkError
                      ? `SDK error: ${sdkError}`
                      : "Connecting web player…"}
            </div>
            <div className="sp-title">{displayTrack?.title ?? "—"}</div>
            <div className="sp-artist">{displayTrack?.artist}</div>
            <div className="sp-prog">
              <div
                className="sp-prog-fill"
                style={{ width: `${displayTrack?.progress ?? 0}%` }}
              />
            </div>
            <div className="sp-times">
              <span>{isLive ? displayTrack?.elapsed : "0:00"}</span>
              <span>{displayTrack?.duration}</span>
            </div>
          </div>
          <div className="sp-footer">
            <div className={`sp-bars${isLive ? "" : " sp-paused"}`}>
              <div className="sp-bar" />
              <div className="sp-bar" />
              <div className="sp-bar" />
              <div className="sp-bar" />
              <div className="sp-bar" />
            </div>
            {sdkReady ? (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => playerRef.current?.previousTrack()}
                  style={{
                    background: "none",
                    border: "1px solid var(--border2)",
                    color: "var(--ink3)",
                    fontFamily: "var(--sm)",
                    fontSize: "9px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    letterSpacing: ".5px",
                  }}
                >
                  <i className="ri-skip-back-line" />
                </button>
                <button
                  onClick={() => playerRef.current?.togglePlay()}
                  style={{
                    background: "var(--accent)",
                    border: "none",
                    color: "var(--bg)",
                    fontFamily: "var(--sm)",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    cursor: "pointer",
                    letterSpacing: ".5px",
                  }}
                >
                  <i
                    className={isSDKPlaying ? "ri-pause-line" : "ri-play-line"}
                  />
                </button>
                <button
                  onClick={() => playerRef.current?.nextTrack()}
                  style={{
                    background: "none",
                    border: "1px solid var(--border2)",
                    color: "var(--ink3)",
                    fontFamily: "var(--sm)",
                    fontSize: "9px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    letterSpacing: ".5px",
                  }}
                >
                  <i className="ri-skip-forward-line" />
                </button>
              </div>
            ) : (
              !spotify.isPlaying && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() =>
                      setTrackIdx(
                        (i) => (i - 1 + playlist.length) % playlist.length,
                      )
                    }
                    style={{
                      background: "none",
                      border: "1px solid var(--border2)",
                      color: "var(--ink3)",
                      fontFamily: "var(--sm)",
                      fontSize: "9px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      letterSpacing: ".5px",
                    }}
                  >
                    <i className="ri-skip-back-line" />
                  </button>
                  <button
                    onClick={() =>
                      setTrackIdx((i) => (i + 1) % playlist.length)
                    }
                    style={{
                      background: "var(--accent)",
                      border: "none",
                      color: "var(--bg)",
                      fontFamily: "var(--sm)",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "5px 12px",
                      cursor: "pointer",
                      letterSpacing: ".5px",
                    }}
                  >
                    <i className="ri-skip-forward-line" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Playlist */}
      <button
        onClick={() => setPlaylistOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: ".5rem .9rem",
          marginTop: ".5rem",
          background: "var(--s2)",
          border: "none",
          borderTop: "1px solid var(--border)",
          borderBottom: playlistOpen ? "none" : "1px solid var(--border)",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sm)",
            fontSize: "8px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--ink3)",
          }}
        >
          Playlist · {playlist.length} tracks
        </span>
        <i
          className={`ri-arrow-${playlistOpen ? "up" : "down"}-s-line`}
          style={{ color: "var(--ink3)", fontSize: "14px" }}
        />
      </button>
      {playlistOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "var(--border)",
          }}
        >
          {playlist.map((t, i) => {
            const isActive = activeIdx >= 0 ? i === activeIdx : i === trackIdx;
            const trackUri = (t as { uri?: string }).uri;
            const trackUrl = (t as { url?: string | null }).url;
            return (
              <button
                key={i}
                onClick={() => {
                  setTrackIdx(i);
                  if (deviceIdRef.current && trackUri) {
                    playTrack(i);
                  } else if (trackUrl) {
                    window.open(trackUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: ".6rem .9rem",
                  background: isActive ? "var(--s3)" : "var(--s1)",
                  textDecoration: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  borderLeft: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  transition: "background .15s",
                  border: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--sm)",
                    fontSize: "8px",
                    color: isActive ? "var(--accent)" : "var(--ink3)",
                    width: "14px",
                    flexShrink: 0,
                  }}
                >
                  {isActive && isLive ? (
                    <i className="ri-play-fill" />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: ".78rem",
                    fontWeight: 600,
                    color: isActive ? "var(--ink)" : "var(--ink2)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--sm)",
                    fontSize: ".68rem",
                    color: "var(--ink3)",
                    flexShrink: 0,
                  }}
                >
                  {t.artist}
                </span>
                <span
                  style={{
                    fontFamily: "var(--sm)",
                    fontSize: ".62rem",
                    color: "var(--ink3)",
                    flexShrink: 0,
                    marginLeft: ".5rem",
                  }}
                >
                  {t.duration}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SUB_TABS = ["vibe", "gallery", "terminal"] as const;
type SubTab = (typeof SUB_TABS)[number];

function Terminal() {
  const [termInput, setTermInput] = useState("");
  const [termLines, setTermLines] = useState(TERM_LINES);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const termBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
    }
  }, [termLines]);

  const getResponse = (cmd: string): { cls: string; text: string }[] => {
    const raw = cmd.trim();
    const c = raw.toLowerCase();
    const parts = c.split(/\s+/);
    const base = parts[0];
    const arg = parts.slice(1).join(" ");

    if (c === "help")
      return [
        { cls: "lime", text: "── Navigation ──────────────────────────" },
        { cls: "out", text: "  whoami        who is nonso barn?" },
        { cls: "out", text: "  pwd           current location" },
        { cls: "out", text: "  ls            list everything" },
        { cls: "out", text: "  ls projects   active ventures" },
        { cls: "out", text: "  ls skills     what i work with" },
        { cls: "lime", text: "── Info ─────────────────────────────────" },
        { cls: "out", text: "  cat status    current focus" },
        { cls: "out", text: "  cat stack     tech & tools" },
        { cls: "out", text: "  cat story     the origin story" },
        { cls: "out", text: "  cat mission   what i'm building toward" },
        { cls: "lime", text: "── Connect ──────────────────────────────" },
        { cls: "out", text: "  contact       links & email" },
        { cls: "out", text: "  socials       all social handles" },
        { cls: "lime", text: "── Git ──────────────────────────────────" },
        { cls: "out", text: "  git log       recent milestones" },
        { cls: "out", text: "  git status    what's in progress" },
        { cls: "lime", text: "── Misc ─────────────────────────────────" },
        { cls: "out", text: "  clear         clear the terminal" },
      ];

    if (c === "whoami")
      return [
        {
          cls: "acc",
          text: "Nonso Barn — builder · founder · brand strategist",
        },
        {
          cls: "out",
          text: "5 years shipping ventures across brand, product & community.",
        },
        {
          cls: "out",
          text: "Based in Lagos. Building infrastructure for African founders.",
        },
      ];

    if (c === "pwd") return [{ cls: "lime", text: "/lagos/nigeria/africa" }];

    if (base === "ls") {
      if (!arg || arg === "." || arg === "./")
        return [
          { cls: "lime", text: "── directories ──" },
          { cls: "out", text: "projects/   skills/   content/   community/" },
          { cls: "lime", text: "── files ──" },
          {
            cls: "out",
            text: "status.txt   stack.txt   story.md   mission.txt",
          },
        ];
      if (arg.includes("project"))
        return [
          {
            cls: "acc",
            text: "buildlagos/   — community platform for Lagos founders",
          },
          { cls: "acc", text: "frame-studio/ — brand & design studio" },
          {
            cls: "acc",
            text: "chop-fast/    — food delivery for busy builders",
          },
          { cls: "acc", text: "nb-merch/     — brand merch for the community" },
        ];
      if (arg.includes("skill"))
        return [
          {
            cls: "gold",
            text: "brand strategy · product design · community building",
          },
          {
            cls: "gold",
            text: "content creation · venture building · public speaking",
          },
        ];
      if (arg.includes("content"))
        return [
          {
            cls: "out",
            text: "youtube/   instagram/   twitter/   newsletter/",
          },
        ];
      return [
        {
          cls: "out",
          text: `ls: cannot access '${arg}': No such file or directory`,
        },
      ];
    }

    if (base === "cat") {
      if (arg.includes("status"))
        return [
          {
            cls: "gold",
            text: "→ deep work mode · building publicly · shipping weekly",
          },
          { cls: "gold", text: "→ open to brand collabs & advisory roles" },
          {
            cls: "gold",
            text: "→ currently: BuildLagos v3 + Frame Studio rebrand",
          },
        ];
      if (arg.includes("stack"))
        return [
          { cls: "lime", text: "── Frontend ──" },
          { cls: "out", text: "Next.js · React · TypeScript · Tailwind" },
          { cls: "lime", text: "── Design ──" },
          { cls: "out", text: "Figma · Framer · Adobe Suite" },
          { cls: "lime", text: "── Infra ──" },
          { cls: "out", text: "Vercel · Supabase · Ghost CMS · Resend" },
          { cls: "lime", text: "── Brand ──" },
          {
            cls: "out",
            text: "Strategy · Identity · Positioning · Storytelling",
          },
        ];
      if (arg.includes("story"))
        return [
          {
            cls: "acc",
            text: "Started with nothing but a laptop and a Figma account.",
          },
          {
            cls: "out",
            text: "Obsessed with why African brands look the way they do.",
          },
          {
            cls: "out",
            text: "Five years later: 4 ventures, 12K+ community, still shipping.",
          },
          {
            cls: "out",
            text: "I grew up consuming Silicon Valley content & Lagos hustle",
          },
          {
            cls: "out",
            text: "simultaneously. That tension is my superpower.",
          },
        ];
      if (arg.includes("mission"))
        return [
          { cls: "acc", text: "Build infrastructure for African founders." },
          {
            cls: "out",
            text: "Document every ugly, chaotic, humbling moment publicly.",
          },
          {
            cls: "out",
            text: "Prove that world-class brands can come from Lagos.",
          },
        ];
      return [{ cls: "out", text: `cat: ${arg}: No such file or directory` }];
    }

    if (c === "contact")
      return [
        { cls: "lime", text: "── Get in touch ──" },
        { cls: "acc", text: "email   → hello@nonsoBarn.com" },
        { cls: "acc", text: "twitter → @nonso_barn" },
        { cls: "acc", text: "ig      → @nonso.barn" },
      ];

    if (c === "socials")
      return [
        { cls: "acc", text: "twitter/x   → @nonso_barn" },
        { cls: "acc", text: "instagram   → @nonso.barn" },
        { cls: "acc", text: "youtube     → /nonsoBarn" },
        { cls: "acc", text: "newsletter  → nonsoBarn.com/subscribe" },
      ];

    if (base === "git") {
      if (arg === "log" || arg.startsWith("log"))
        return [
          { cls: "gold", text: "a3f2b1 shipped: BuildLagos v3 alpha" },
          { cls: "gold", text: "9c8d4e wrote: The Brand from Zero Playbook" },
          { cls: "gold", text: "7e2a0f launched: Frame Studio new site" },
          { cls: "gold", text: "5b1c2a grew: community hit 12,000 members" },
          { cls: "gold", text: "3d9e0f shipped: nonso-barn.com v2" },
        ];
      if (arg === "status")
        return [
          { cls: "lime", text: "On branch: main" },
          { cls: "out", text: "Changes in progress:" },
          { cls: "acc", text: "  modified: BuildLagos v3 — onboarding flow" },
          {
            cls: "acc",
            text: "  new file: Frame Studio — brand identity refresh",
          },
          { cls: "acc", text: "  modified: nb-merch — new collection drop" },
        ];
      return [
        {
          cls: "out",
          text: `git: '${arg}' is not a git command. Try 'git log' or 'git status'`,
        },
      ];
    }

    if (c === "clear") {
      setTermLines([]);
      return [];
    }

    if (c === "exit" || c === "quit")
      return [{ cls: "dim", text: "nice try 😄 — you can't escape the barn" }];

    if (c === "sudo" || c.startsWith("sudo "))
      return [
        { cls: "gold", text: "nice try — you don't have sudo access here 😄" },
      ];

    if (c === "date") return [{ cls: "out", text: new Date().toDateString() }];

    return [
      {
        cls: "out",
        text: `command not found: ${raw}. Type 'help' to see available commands.`,
      },
    ];
  };

  const handleTermKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      setTermInput(history[newIdx] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setTermInput(newIdx === -1 ? "" : history[newIdx]);
      return;
    }
    if (e.key !== "Enter") return;
    const cmd = termInput.trim();
    if (!cmd) return;
    const responses = getResponse(cmd);
    setTermLines((prev) => [
      ...prev,
      { cls: "prompt", text: cmd },
      ...responses,
      { cls: "dim", text: "" },
    ]);
    setHistory((prev) => [cmd, ...prev]);
    setHistIdx(-1);
    setTermInput("");
  };

  return (
    <div className="term">
      <div className="t-head">
        <span className="t-dot" />
        <span className="t-dot" />
        <span className="t-dot" />
        <span className="t-ttl">nonso@lagos — bash</span>
      </div>
      <div className="t-body" ref={termBodyRef}>
        {termLines.map((l, i) => (
          <span key={i} className={`tl ${l.cls}`}>
            {l.text}
          </span>
        ))}
      </div>
      <div className="t-ir">
        <span className="t-ps">nonso@lagos:~$</span>
        <input
          className="t-in"
          value={termInput}
          onChange={(e) => setTermInput(e.target.value)}
          onKeyDown={handleTermKey}
          placeholder="type 'help' to explore..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function AboutPanel({ open, onClose, onNav }: AboutPanelProps) {
  const [activeSub, setActiveSub] = useState<SubTab>("vibe");

  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">01</span>
            <span className="ph-sep" />
            <span className="ph-title">About</span>
            <span className="ph-badge live">
              <span className="live-dot" /> Active
            </span>
          </div>
          <div className="ph-actions">
            <button className="al" onClick={() => onNav("collab")}>
              Work together <i className="ri-arrow-right-line" />
            </button>
            <button className="panel-close" onClick={onClose}>
              <i className="ri-close-line" /> close
            </button>
          </div>
        </div>

        {/* Two-column: bio left, stat grid right */}
        <div className="about-top">
          <div className="about-l">
            <h2 className="about-q">
              Who is <em>Nonso Barn</em> and what does she actually ship?
            </h2>
            <p>
              I&apos;m a <strong>fullstack engineer</strong> based in{" "}
              <strong>Lagos, Nigeria</strong>. I build production-grade web and
              mobile applications and the backend systems behind them. Four
              years of shipping software used by tens of thousands across{" "}
              <strong>fintech, e-commerce, healthtech</strong> and{" "}
              <strong>proptech</strong>.
            </p>
            <p>
              Beyond the code, I take care of the{" "}
              <strong>cloud infrastructure</strong> that keeps things running.
              AWS Certified. I've been lucky to work on things that go straight
              to real users.
            </p>
            <p>
              Outside work I document the engineering journey publicly: videos,
              writing, and a growing community. Code first, ship it, then tell
              the story.
            </p>
            {/* <div className="tags">
              {ABOUT_TAGS.map((t) => (
                <span key={t} className="atag">
                  {t}
                </span>
              ))}
            </div> */}
          </div>

          <div className="stat-grid">
            {ABOUT_STATS.map((s) => (
              <div key={s.num} className="ast">
                <div className="ast-bar" />
                <div className="ast-num">{s.num}</div>
                <div className="ast-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        {/* <div className="blbl">Ventures &amp; projects</div>
        <div className="brow">
          {ABOUT_BRANDS.map((b) => <span key={b} className="bchip">{b}</span>)}
        </div> */}

        {/* Sub-tabs: Vibe / Gallery / Terminal */}
        <div className="sub-wrap">
          {/* <div className="sub-hdr">
            <div className="sub-rule" />
            <div className="sub-btns">
              {SUB_TABS.map((t) => (
                <button
                  key={t}
                  className={`sub-btn${activeSub === t ? " on" : ""}`}
                  onClick={() => setActiveSub(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div> */}

          {/* Vibe — music player */}
          {/* <div className={`sub-pane${activeSub === "vibe" ? " on" : ""}`}>
            <MusicPlayer />
          </div> */}

          {/* Gallery */}
          {/* <div className={`sub-pane${activeSub === "gallery" ? " on" : ""}`}>
            <div className="ig-grid">
              {ABOUT_GALLERY.map((item, i) => (
                <div key={i} className="ig-item">
                  <div className="ig-item-fb">
                    <span>{item.label}</span>
                    <span style={{ opacity: 0.5 }}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Terminal */}
          <div className={`sub-pane${activeSub === "terminal" ? " on" : ""}`}>
            <Terminal key={open ? "open" : "closed"} />
          </div>
        </div>
      </div>
    </div>
  );
}
